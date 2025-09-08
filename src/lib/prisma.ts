import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Enhanced loan interest calculation utility
export const calculateLoanInterest = (principal: number, termMonths: number): {
  interestRate: number;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
} => {
  let interestRate: number;
  
  // Interest rate structure: 3 months - 1%, 6 months - 3%, 12 months - 5%
  switch (termMonths) {
    case 3:
      interestRate = 0.01; // 1%
      break;
    case 6:
      interestRate = 0.03; // 3%
      break;
    case 12:
      interestRate = 0.05; // 5%
      break;
    default:
      throw new Error('Invalid loan term. Only 3, 6, or 12 months are allowed.');
  }
  
  const totalInterest = principal * interestRate;
  const totalAmount = principal + totalInterest;
  const monthlyPayment = totalAmount / termMonths;
  
  return {
    interestRate,
    totalInterest,
    totalAmount,
    monthlyPayment
  };
};

// Generate payment schedule with principal and interest breakdown
export const generatePaymentSchedule = (
  principal: number, 
  termMonths: number, 
  startDate: Date
): Array<{
  installmentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
}> => {
  const { totalInterest, monthlyPayment } = calculateLoanInterest(principal, termMonths);
  const monthlyInterest = totalInterest / termMonths;
  const monthlyPrincipal = principal / termMonths;
  
  const schedule = [];
  
  for (let i = 1; i <= termMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    schedule.push({
      installmentNumber: i,
      dueDate,
      principalAmount: monthlyPrincipal,
      interestAmount: monthlyInterest,
      totalAmount: monthlyPayment
    });
  }
  
  return schedule;
};

// Member number generation utility
export const generateMemberNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `PRAWS${currentYear}`;
  
  // Get the count of existing members this year
  const memberCount = await prisma.member.count({
    where: {
      memberNumber: {
        startsWith: prefix
      }
    }
  });
  
  const sequence = (memberCount + 1).toString().padStart(4, '0');
  return `${prefix}${sequence}`;
};

// Receipt number generation utility
export const generateReceiptNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `RCP${currentYear}${currentMonth}`;
  
  // Get the count of existing payments this month
  const paymentCount = await prisma.payment.count({
    where: {
      receiptNumber: {
        startsWith: prefix
      }
    }
  });
  
  const sequence = (paymentCount + 1).toString().padStart(4, '0');
  return `${prefix}${sequence}`;
};

// Loan number generation utility
export const generateLoanNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `LOAN${currentYear}`;
  
  // Get the count of existing loans this year
  const loanCount = await prisma.loan.count({
    where: {
      loanNumber: {
        startsWith: prefix
      }
    }
  });
  
  const sequence = (loanCount + 1).toString().padStart(4, '0');
  return `${prefix}${sequence}`;
};

// Application number generation utility
export const generateApplicationNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `APP${currentYear}`;
  
  // Get the count of existing applications this year
  const appCount = await prisma.loanApplication.count({
    where: {
      applicationNumber: {
        startsWith: prefix
      }
    }
  });
  
  const sequence = (appCount + 1).toString().padStart(4, '0');
  return `${prefix}${sequence}`;
};

export default prisma;
