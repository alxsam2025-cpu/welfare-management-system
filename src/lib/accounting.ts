import { prisma } from './prisma'
import { calculateLoanInterest } from './prisma'

export interface ReconciliationData {
  loanId: string
  expectedPrincipal: number
  expectedInterest: number
  expectedTotal: number
  actualPrincipal: number
  actualInterest: number
  actualTotal: number
  difference: number
  status: 'RECONCILED' | 'DISCREPANCY' | 'PENDING'
}

export interface AccountingSummary {
  totalLoansOutstanding: number
  totalPrincipalOutstanding: number
  totalInterestOutstanding: number
  totalPrincipalReceived: number
  totalInterestReceived: number
  totalContributions: number
  availableFunds: number
  reconciliationStatus: 'GOOD' | 'ISSUES' | 'CRITICAL'
}

// Calculate expected vs actual loan repayments for reconciliation
export const calculateLoanReconciliation = async (loanId: string): Promise<ReconciliationData> => {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      payments: {
        where: { paymentType: 'LOAN_REPAYMENT' }
      },
      paymentSchedule: true
    }
  })

  if (!loan) {
    throw new Error('Loan not found')
  }

  // Calculate expected amounts
  const { totalInterest } = calculateLoanInterest(loan.principal, loan.termMonths)
  const expectedPrincipal = loan.principal
  const expectedInterest = totalInterest
  const expectedTotal = expectedPrincipal + expectedInterest

  // Calculate actual amounts received
  const actualPrincipal = loan.payments.reduce((sum, payment) => 
    sum + (payment.principalAmount || 0), 0)
  const actualInterest = loan.payments.reduce((sum, payment) => 
    sum + (payment.interestAmount || 0), 0)
  const actualTotal = actualPrincipal + actualInterest

  // Calculate difference
  const difference = expectedTotal - actualTotal

  // Determine status
  let status: 'RECONCILED' | 'DISCREPANCY' | 'PENDING' = 'PENDING'
  if (Math.abs(difference) < 0.01) {
    status = 'RECONCILED'
  } else if (Math.abs(difference) > 0.01) {
    status = 'DISCREPANCY'
  }

  return {
    loanId,
    expectedPrincipal,
    expectedInterest,
    expectedTotal,
    actualPrincipal,
    actualInterest,
    actualTotal,
    difference,
    status
  }
}

// Reconcile all loans and create reconciliation records
export const reconcileAllLoans = async (): Promise<ReconciliationData[]> => {
  const activeLoans = await prisma.loan.findMany({
    where: { 
      status: { 
        in: ['ACTIVE', 'COMPLETED'] 
      } 
    }
  })

  const reconciliationResults: ReconciliationData[] = []

  for (const loan of activeLoans) {
    try {
      const reconciliation = await calculateLoanReconciliation(loan.id)
      reconciliationResults.push(reconciliation)

      // Create reconciliation record if there's a discrepancy
      if (reconciliation.status === 'DISCREPANCY') {
        await prisma.reconciliationRecord.create({
          data: {
            reconciliationType: 'LOAN_PAYMENT',
            referenceNumber: loan.loanNumber,
            entityId: loan.id,
            expectedAmount: reconciliation.expectedTotal,
            actualAmount: reconciliation.actualTotal,
            difference: reconciliation.difference,
            status: 'DISCREPANCY',
            notes: `Loan payment discrepancy detected. Expected: ${reconciliation.expectedTotal}, Actual: ${reconciliation.actualTotal}`
          }
        })
      }

      // Update loan reconciliation status
      await prisma.loan.update({
        where: { id: loan.id },
        data: {
          isFullyReconciled: reconciliation.status === 'RECONCILED',
          lastReconciledAt: new Date()
        }
      })
    } catch (error) {
      console.error(`Error reconciling loan ${loan.loanNumber}:`, error)
    }
  }

  return reconciliationResults
}

// Generate comprehensive accounting summary
export const generateAccountingSummary = async (): Promise<AccountingSummary> => {
  // Get all active loans
  const activeLoans = await prisma.loan.findMany({
    where: { 
      status: { 
        in: ['ACTIVE', 'DISBURSED'] 
      } 
    },
    include: {
      payments: {
        where: { paymentType: 'LOAN_REPAYMENT' }
      }
    }
  })

  // Calculate outstanding amounts
  const totalLoansOutstanding = activeLoans.length
  let totalPrincipalOutstanding = 0
  let totalInterestOutstanding = 0
  let totalPrincipalReceived = 0
  let totalInterestReceived = 0

  for (const loan of activeLoans) {
    totalPrincipalOutstanding += loan.outstandingPrincipal
    totalInterestOutstanding += loan.outstandingInterest
    totalPrincipalReceived += loan.principalRepaid
    totalInterestReceived += loan.interestRepaid
  }

  // Get total contributions
  const contributionsResult = await prisma.payment.aggregate({
    where: {
      paymentType: { 
        in: ['MEMBERSHIP_FEE', 'MONTHLY_CONTRIBUTION', 'SPECIAL_LEVY', 'ESB_CONTRIBUTION'] 
      }
    },
    _sum: {
      amount: true
    }
  })
  
  const totalContributions = contributionsResult._sum.amount || 0

  // Get total disbursements
  const disbursementsResult = await prisma.loan.aggregate({
    where: {
      status: { 
        in: ['DISBURSED', 'ACTIVE', 'COMPLETED'] 
      }
    },
    _sum: {
      amountDisbursed: true
    }
  })
  
  const totalDisbursed = disbursementsResult._sum.amountDisbursed || 0

  // Calculate available funds
  const availableFunds = totalContributions + totalPrincipalReceived + totalInterestReceived - totalDisbursed

  // Determine reconciliation status
  const reconciliationIssues = await prisma.reconciliationRecord.count({
    where: {
      status: { 
        in: ['DISCREPANCY', 'PENDING'] 
      }
    }
  })

  let reconciliationStatus: 'GOOD' | 'ISSUES' | 'CRITICAL' = 'GOOD'
  if (reconciliationIssues > 0 && reconciliationIssues <= 5) {
    reconciliationStatus = 'ISSUES'
  } else if (reconciliationIssues > 5) {
    reconciliationStatus = 'CRITICAL'
  }

  return {
    totalLoansOutstanding,
    totalPrincipalOutstanding,
    totalInterestOutstanding,
    totalPrincipalReceived,
    totalInterestReceived,
    totalContributions,
    availableFunds,
    reconciliationStatus
  }
}

// Process loan payment and update accounting
export const processLoanPayment = async (
  loanId: string, 
  paymentAmount: number,
  paymentDate: Date = new Date()
): Promise<{ principalAmount: number; interestAmount: number; remainingBalance: number }> => {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      paymentSchedule: {
        where: { status: 'PENDING' },
        orderBy: { dueDate: 'asc' },
        take: 1
      }
    }
  })

  if (!loan) {
    throw new Error('Loan not found')
  }

  const nextSchedule = loan.paymentSchedule[0]
  if (!nextSchedule) {
    throw new Error('No pending payment schedule found')
  }

  // Calculate principal and interest allocation
  let principalAmount = Math.min(paymentAmount, nextSchedule.principalAmount)
  let interestAmount = Math.min(paymentAmount - principalAmount, nextSchedule.interestAmount)

  // If payment is more than scheduled, allocate excess to principal
  if (paymentAmount > (nextSchedule.principalAmount + nextSchedule.interestAmount)) {
    const excess = paymentAmount - (nextSchedule.principalAmount + nextSchedule.interestAmount)
    principalAmount += excess
  }

  // Update loan balances
  const newPrincipalRepaid = loan.principalRepaid + principalAmount
  const newInterestRepaid = loan.interestRepaid + interestAmount
  const newTotalRepaid = loan.totalRepaid + paymentAmount
  const newOutstandingPrincipal = Math.max(0, loan.principal - newPrincipalRepaid)
  const newOutstandingInterest = Math.max(0, loan.totalInterest - newInterestRepaid)
  const newOutstandingBalance = newOutstandingPrincipal + newOutstandingInterest

  // Update loan
  await prisma.loan.update({
    where: { id: loanId },
    data: {
      principalRepaid: newPrincipalRepaid,
      interestRepaid: newInterestRepaid,
      totalRepaid: newTotalRepaid,
      outstandingPrincipal: newOutstandingPrincipal,
      outstandingInterest: newOutstandingInterest,
      outstandingBalance: newOutstandingBalance,
      status: newOutstandingBalance <= 0.01 ? 'COMPLETED' : loan.status
    }
  })

  // Update payment schedule
  const scheduleStatus = paymentAmount >= nextSchedule.totalAmount ? 'PAID' : 'PARTIAL'
  await prisma.paymentSchedule.update({
    where: { id: nextSchedule.id },
    data: {
      status: scheduleStatus,
      paidAmount: paymentAmount,
      paidPrincipal: principalAmount,
      paidInterest: interestAmount,
      paidDate: paymentDate,
      isReconciled: true,
      reconciledAt: new Date()
    }
  })

  return {
    principalAmount,
    interestAmount,
    remainingBalance: newOutstandingBalance
  }
}

// Generate interest-based financial report
export const generateInterestReport = async (startDate: Date, endDate: Date) => {
  const interestPayments = await prisma.payment.findMany({
    where: {
      paymentType: 'LOAN_REPAYMENT',
      paymentDate: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      member: true,
      loan: true
    }
  })

  const report = {
    totalInterestCollected: 0,
    totalPrincipalCollected: 0,
    paymentsByTerm: {
      threeMonths: { count: 0, totalInterest: 0, rate: '1%' },
      sixMonths: { count: 0, totalInterest: 0, rate: '3%' },
      twelveMonths: { count: 0, totalInterest: 0, rate: '5%' }
    },
    detailedPayments: [] as any[]
  }

  for (const payment of interestPayments) {
    const principalAmount = payment.principalAmount || 0
    const interestAmount = payment.interestAmount || 0
    
    report.totalPrincipalCollected += principalAmount
    report.totalInterestCollected += interestAmount

    // Categorize by loan term
    if (payment.loan) {
      const termMonths = payment.loan.termMonths
      if (termMonths === 3) {
        report.paymentsByTerm.threeMonths.count++
        report.paymentsByTerm.threeMonths.totalInterest += interestAmount
      } else if (termMonths === 6) {
        report.paymentsByTerm.sixMonths.count++
        report.paymentsByTerm.sixMonths.totalInterest += interestAmount
      } else if (termMonths === 12) {
        report.paymentsByTerm.twelveMonths.count++
        report.paymentsByTerm.twelveMonths.totalInterest += interestAmount
      }
    }

    report.detailedPayments.push({
      paymentId: payment.id,
      memberName: `${payment.member.firstName} ${payment.member.lastName}`,
      loanNumber: payment.loan?.loanNumber,
      paymentDate: payment.paymentDate,
      principalAmount,
      interestAmount,
      totalAmount: payment.amount,
      loanTerm: payment.loan?.termMonths,
      interestRate: payment.loan?.interestRate
    })
  }

  return report
}

// Create reconciliation audit trail
export const createReconciliationAuditTrail = async (
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: any
) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'RECONCILE',
      entity: entityType,
      entityId,
      newValues: details,
      createdAt: new Date()
    }
  })
}

export default {
  calculateLoanReconciliation,
  reconcileAllLoans,
  generateAccountingSummary,
  processLoanPayment,
  generateInterestReport,
  createReconciliationAuditTrail
}
