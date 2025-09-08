'use client'

import React, { useState } from 'react'
import { 
  FileText, 
  User, 
  Briefcase, 
  Phone, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface LoanApplicationFormData {
  // Loan Details
  loanType: string
  requestedAmount: number
  purpose: string
  repaymentPeriod: number
  
  // Personal Information  
  occupation: string
  employerName: string
  monthlyIncome: number
  otherIncome: number
  monthlyExpenses: number
  
  // Emergency Contacts
  guarantor1Name: string
  guarantor1Phone: string
  guarantor1Relationship: string
  guarantor2Name: string
  guarantor2Phone: string
  guarantor2Relationship: string
  
  // Agreement
  agreesToTerms: boolean
  agreesToInterestRate: boolean
  acknowledgesRepayment: boolean
}

interface LoanApplicationFormProps {
  memberId?: string
  onSubmit?: (data: LoanApplicationFormData) => void
  onCancel?: () => void
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  memberId,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitting' | 'submitted'>('draft')
  
  const [formData, setFormData] = useState<LoanApplicationFormData>({
    loanType: '',
    requestedAmount: 0,
    purpose: '',
    repaymentPeriod: 3,
    occupation: '',
    employerName: '',
    monthlyIncome: 0,
    otherIncome: 0,
    monthlyExpenses: 0,
    guarantor1Name: '',
    guarantor1Phone: '',
    guarantor1Relationship: '',
    guarantor2Name: '',
    guarantor2Phone: '',
    guarantor2Relationship: '',
    agreesToTerms: false,
    agreesToInterestRate: false,
    acknowledgesRepayment: false
  })

  const loanTypes = [
    { value: 'PERSONAL', label: 'Personal Loan' },
    { value: 'EMERGENCY', label: 'Emergency Loan' },
    { value: 'BUSINESS', label: 'Business Loan' },
    { value: 'EDUCATIONAL', label: 'Educational Loan' },
    { value: 'MEDICAL', label: 'Medical Loan' },
    { value: 'HOUSING', label: 'Housing Loan' }
  ]

  const repaymentOptions = [
    { value: 3, label: '3 Months (1% Interest)', rate: '1%' },
    { value: 6, label: '6 Months (3% Interest)', rate: '3%' },
    { value: 12, label: '12 Months (5% Interest)', rate: '5%' }
  ]

  const calculateLoanDetails = () => {
    const principal = formData.requestedAmount
    const termMonths = formData.repaymentPeriod
    
    let interestRate = 0
    switch (termMonths) {
      case 3: interestRate = 0.01; break
      case 6: interestRate = 0.03; break
      case 12: interestRate = 0.05; break
    }
    
    const totalInterest = principal * interestRate
    const totalAmount = principal + totalInterest
    const monthlyPayment = totalAmount / termMonths
    
    return {
      principal,
      interestRate: interestRate * 100,
      totalInterest,
      totalAmount,
      monthlyPayment
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.loanType || !formData.requestedAmount || !formData.purpose) {
          toast.error('Please complete all loan details')
          return false
        }
        if (formData.requestedAmount < 100 || formData.requestedAmount > 50000) {
          toast.error('Loan amount must be between GHC 100 and GHC 50,000')
          return false
        }
        return true
      
      case 2:
        if (!formData.occupation || !formData.employerName || !formData.monthlyIncome) {
          toast.error('Please complete all employment information')
          return false
        }
        if (formData.monthlyIncome < 500) {
          toast.error('Monthly income must be at least GHC 500')
          return false
        }
        return true
      
      case 3:
        if (!formData.guarantor1Name || !formData.guarantor1Phone || !formData.guarantor1Relationship ||
            !formData.guarantor2Name || !formData.guarantor2Phone || !formData.guarantor2Relationship) {
          toast.error('Please provide both guarantor details')
          return false
        }
        return true
      
      case 4:
        if (!formData.agreesToTerms || !formData.agreesToInterestRate || !formData.acknowledgesRepayment) {
          toast.error('Please agree to all terms and conditions')
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    setApplicationStatus('submitting')
    
    try {
      const response = await fetch('/api/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          memberId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      const result = await response.json()
      setApplicationStatus('submitted')
      
      // Send email notification
      await fetch('/api/notifications/loan-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: result.id,
          memberId,
          notificationType: 'APPLICATION_SUBMITTED'
        })
      })

      toast.success('Loan application submitted successfully!')
      onSubmit?.(formData)
      
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
      setApplicationStatus('draft')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC'
    }).format(amount)
  }

  const loanDetails = calculateLoanDetails()

  if (applicationStatus === 'submitted') {
    return (
      <div className="card-glow p-8 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your loan application has been successfully submitted and is now under review. 
          You will receive email notifications about the status of your application.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
          <div className="text-sm text-blue-700 text-left space-y-1">
            <p>• Your application will be reviewed by our loan committee</p>
            <p>• You may be contacted for additional documentation</p>
            <p>• Decision will be communicated via email within 5-7 business days</p>
          </div>
        </div>
        <button onClick={onCancel} className="btn btn-primary">
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`h-1 w-20 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Loan Details</span>
          <span>Employment</span>
          <span>Guarantors</span>
          <span>Agreement</span>
        </div>
      </div>

      <div className="card-glow p-6">
        {/* Step 1: Loan Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Loan Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Loan Type *</label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select loan type</option>
                  {loanTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Requested Amount (GHC) *</label>
                <input
                  type="number"
                  name="requestedAmount"
                  value={formData.requestedAmount}
                  onChange={handleInputChange}
                  className="input"
                  min="100"
                  max="50000"
                  step="50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: GHC 100, Maximum: GHC 50,000</p>
              </div>

              <div>
                <label className="label">Repayment Period *</label>
                <select
                  name="repaymentPeriod"
                  value={formData.repaymentPeriod}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  {repaymentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Purpose of Loan *</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="input h-24"
                placeholder="Please explain the purpose of this loan..."
                required
              />
            </div>

            {/* Loan Calculation Preview */}
            {formData.requestedAmount > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-4">Loan Calculation Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(loanDetails.principal)}
                    </div>
                    <div className="text-sm text-gray-600">Principal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {loanDetails.interestRate}%
                    </div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(loanDetails.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(loanDetails.monthlyPayment)}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Employment Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Employment Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Research Assistant"
                  required
                />
              </div>

              <div>
                <label className="label">Employer Name *</label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Parliament of Ghana"
                  required
                />
              </div>

              <div>
                <label className="label">Monthly Income (GHC) *</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  className="input"
                  min="500"
                  step="50"
                  required
                />
              </div>

              <div>
                <label className="label">Other Income (GHC)</label>
                <input
                  type="number"
                  name="otherIncome"
                  value={formData.otherIncome}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  step="50"
                />
              </div>

              <div>
                <label className="label">Monthly Expenses (GHC)</label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  step="50"
                />
              </div>
            </div>

            {/* Financial Summary */}
            {formData.monthlyIncome > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(formData.monthlyIncome + formData.otherIncome)}
                    </div>
                    <div className="text-sm text-gray-600">Total Monthly Income</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(formData.monthlyExpenses)}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Expenses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency((formData.monthlyIncome + formData.otherIncome) - formData.monthlyExpenses)}
                    </div>
                    <div className="text-sm text-gray-600">Net Income</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Guarantors */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Guarantor Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Guarantor 1 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">First Guarantor</h3>
                
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    name="guarantor1Name"
                    value={formData.guarantor1Name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="tel"
                    name="guarantor1Phone"
                    value={formData.guarantor1Phone}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Relationship *</label>
                  <input
                    type="text"
                    name="guarantor1Relationship"
                    value={formData.guarantor1Relationship}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Colleague, Friend, Family"
                    required
                  />
                </div>
              </div>

              {/* Guarantor 2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Second Guarantor</h3>
                
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    name="guarantor2Name"
                    value={formData.guarantor2Name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="tel"
                    name="guarantor2Phone"
                    value={formData.guarantor2Phone}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Relationship *</label>
                  <input
                    type="text"
                    name="guarantor2Relationship"
                    value={formData.guarantor2Relationship}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Colleague, Friend, Family"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Loan Agreement */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Loan Agreement</h2>
            </div>

            {/* Loan Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-lg font-bold text-blue-600">{formData.loanType}</div>
                  <div className="text-sm text-gray-600">Loan Type</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(formData.requestedAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Amount</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {formData.repaymentPeriod} months
                  </div>
                  <div className="text-sm text-gray-600">Term</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {loanDetails.interestRate}%
                  </div>
                  <div className="text-sm text-gray-600">Interest Rate</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {formatCurrency(loanDetails.monthlyPayment)}
                  </div>
                  <div className="text-gray-600">Monthly Payment</div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p><strong>1. Loan Terms:</strong> The loan amount of {formatCurrency(formData.requestedAmount)} will be disbursed upon approval with an interest rate of {loanDetails.interestRate}% for a term of {formData.repaymentPeriod} months.</p>
                
                <p><strong>2. Repayment:</strong> Monthly payments of {formatCurrency(loanDetails.monthlyPayment)} are due on the same date each month. Late payments may incur additional fees.</p>
                
                <p><strong>3. Guarantors:</strong> The named guarantors agree to be liable for the loan amount in case of default.</p>
                
                <p><strong>4. Default:</strong> Failure to make payments for 2 consecutive months will result in default status and may affect future loan eligibility.</p>
                
                <p><strong>5. Early Repayment:</strong> Borrower may repay the loan early without penalties.</p>
                
                <p><strong>6. PRAWS Rights:</strong> PRAWS reserves the right to recover the loan amount through payroll deduction or other legal means if necessary.</p>
              </div>
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreesToTerms"
                  name="agreesToTerms"
                  checked={formData.agreesToTerms}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded mt-1"
                />
                <label htmlFor="agreesToTerms" className="text-sm text-gray-700">
                  I agree to the terms and conditions of this loan agreement and understand my obligations as a borrower.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreesToInterestRate"
                  name="agreesToInterestRate"
                  checked={formData.agreesToInterestRate}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded mt-1"
                />
                <label htmlFor="agreesToInterestRate" className="text-sm text-gray-700">
                  I understand and agree to the {loanDetails.interestRate}% interest rate for this {formData.repaymentPeriod}-month loan.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acknowledgesRepayment"
                  name="acknowledgesRepayment"
                  checked={formData.acknowledgesRepayment}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded mt-1"
                />
                <label htmlFor="acknowledgesRepayment" className="text-sm text-gray-700">
                  I acknowledge my responsibility to make monthly payments of {formatCurrency(loanDetails.monthlyPayment)} and understand the consequences of default.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="btn btn-ghost flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-success flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanApplicationForm
