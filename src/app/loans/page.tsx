'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CreditCard, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ArrowLeft,
  Send,
  AlertCircle,
  Upload,
  FileText,
  Trash2
} from 'lucide-react'

interface Loan {
  id: string
  memberName: string
  staffId: string
  email: string
  amount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  applicationDate: string
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed'
  purpose: string
  approvedBy?: string
  disbursementDate?: string
}

interface LoanApplication {
  memberName: string
  email: string
  amount: number
  purpose: string
  termMonths: number
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState<LoanApplication>({
    memberName: '',
    email: '',
    amount: 0,
    purpose: '',
    termMonths: 3
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    // Load demo loans data
    const loadLoans = () => {
      const demoLoans: Loan[] = [
        {
          id: '1',
          memberName: 'John Kwame Asante',
          staffId: 'RA001',
          email: 'j.asante@parliament.gh',
          amount: 5000,
          interestRate: 3,
          termMonths: 6,
          monthlyPayment: 877.57,
          applicationDate: '2024-01-15',
          status: 'approved',
          purpose: 'Medical Emergency',
          approvedBy: 'Committee',
          disbursementDate: '2024-01-20'
        },
        {
          id: '2',
          memberName: 'Grace Osei-Bonsu',
          staffId: 'RA002',
          email: 'g.osei@parliament.gh',
          amount: 3000,
          interestRate: 1,
          termMonths: 3,
          monthlyPayment: 1010.05,
          applicationDate: '2024-02-01',
          status: 'pending',
          purpose: 'Personal Development',
        },
        {
          id: '3',
          memberName: 'Emmanuel Tetteh',
          staffId: 'RA003',
          email: 'e.tetteh@parliament.gh',
          amount: 10000,
          interestRate: 5,
          termMonths: 12,
          monthlyPayment: 927.96,
          applicationDate: '2024-01-10',
          status: 'disbursed',
          purpose: 'Business Investment',
          approvedBy: 'Committee',
          disbursementDate: '2024-01-15'
        },
        {
          id: '4',
          memberName: 'Fatima Al-Hassan',
          staffId: 'RA004',
          email: 'f.hassan@parliament.gh',
          amount: 2000,
          interestRate: 1,
          termMonths: 3,
          monthlyPayment: 673.37,
          applicationDate: '2024-02-15',
          status: 'rejected',
          purpose: 'Personal Expenses',
        }
      ]
      
      setLoans(demoLoans)
      setIsLoading(false)
    }

    setTimeout(loadLoans, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100'
      case 'pending': return 'text-yellow-700 bg-yellow-100'
      case 'rejected': return 'text-red-700 bg-red-100'
      case 'disbursed': return 'text-blue-700 bg-blue-100'
      case 'completed': return 'text-purple-700 bg-purple-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'disbursed': return <DollarSign className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Calculate interest rate based on term
    const interestRate = applicationData.termMonths === 3 ? 1 : 
                        applicationData.termMonths === 6 ? 3 : 5
    
    // Calculate monthly payment
    const principal = applicationData.amount
    const monthlyRate = interestRate / 100
    const totalAmount = principal * (1 + monthlyRate)
    const monthlyPayment = totalAmount / applicationData.termMonths

    const newLoan: Loan = {
      id: Date.now().toString(),
      memberName: applicationData.memberName,
      staffId: 'RA' + String(Date.now()).slice(-3),
      email: applicationData.email,
      amount: applicationData.amount,
      interestRate,
      termMonths: applicationData.termMonths,
      monthlyPayment,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      purpose: applicationData.purpose
    }

    // Add to loans list
    setLoans(prev => [newLoan, ...prev])
    
    // Send email notification (simulation)
    setTimeout(() => {
      alert(`Email sent to ${applicationData.email} with loan application details and next steps.`)
    }, 1000)

    // Reset form
    setApplicationData({
      memberName: '',
      email: '',
      amount: 0,
      purpose: '',
      termMonths: 3
    })
    setUploadedFiles([])
    setShowApplicationForm(false)
  }

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Loans...</h2>
          <p className="text-gray-500">Please wait while we fetch loan data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-pattern min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-4 mb-2">
                  <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-bold text-gradient-white">
                    Loan Management
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  Manage PRAWS Member Loans & Applications
                </p>
                <p className="text-blue-200 mt-2">
                  Total Loans: {loans.length} | Pending: {loans.filter(l => l.status === 'pending').length} | Active: {loans.filter(l => l.status === 'disbursed').length}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="btn btn-success flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Loan Application
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Search and Filter Bar */}
          <div className="card-glow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by member name, staff ID, or purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="btn btn-outline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Loans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLoans.map((loan, index) => (
              <div key={loan.id} className="card-glow p-6 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{loan.memberName}</h3>
                    <p className="text-sm text-gray-600">{loan.staffId}</p>
                    <p className="text-xs text-gray-500">{loan.email}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(loan.status)}`}>
                    {getStatusIcon(loan.status)}
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                    <p className="font-bold text-blue-700 text-lg">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Monthly Payment</p>
                    <p className="font-bold text-green-700 text-lg">{formatCurrency(loan.monthlyPayment)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{loan.interestRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-medium">{loan.termMonths} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium">{loan.purpose}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Applied:</span>
                    <span className="font-medium">{new Date(loan.applicationDate).toLocaleDateString()}</span>
                  </div>
                  {loan.approvedBy && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Approved by:</span>
                      <span className="font-medium">{loan.approvedBy}</span>
                    </div>
                  )}
                  {loan.disbursementDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disbursed:</span>
                      <span className="font-medium">{new Date(loan.disbursementDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {loan.status === 'pending' && (
                    <>
                      <button className="btn btn-success flex-1 text-sm">
                        Approve
                      </button>
                      <button className="btn btn-outline text-red-600 hover:bg-red-50 flex-1 text-sm">
                        Reject
                      </button>
                    </>
                  )}
                  {loan.status === 'approved' && (
                    <button className="btn btn-primary flex-1 text-sm">
                      Disburse
                    </button>
                  )}
                  <button className="btn btn-outline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Loans Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first loan application.'}
              </p>
            </div>
          )}
        </div>

        {/* Loan Application Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Create Loan Application</h2>
                  <button 
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationData.memberName}
                      onChange={(e) => setApplicationData({...applicationData, memberName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter member full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="member@parliament.gh"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount (GHC) *
                    </label>
                    <input
                      type="number"
                      required
                      min="500"
                      max="20000"
                      value={applicationData.amount || ''}
                      onChange={(e) => setApplicationData({...applicationData, amount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term *
                    </label>
                    <select
                      value={applicationData.termMonths}
                      onChange={(e) => setApplicationData({...applicationData, termMonths: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={3}>3 months (1% interest)</option>
                      <option value={6}>6 months (3% interest)</option>
                      <option value={12}>12 months (5% interest)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose of Loan *
                    </label>
                    <textarea
                      required
                      value={applicationData.purpose}
                      onChange={(e) => setApplicationData({...applicationData, purpose: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Briefly describe the purpose of this loan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload supporting documents (ID, Payslips, Bank Statements)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setUploadedFiles(prev => [...prev, ...files])
                          }}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="btn btn-outline text-sm cursor-pointer inline-block"
                        >
                          Choose Files
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Max 5MB per file. PDF, JPG, PNG, DOC formats only.
                        </p>
                      </div>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFiles(prev => prev.filter((_, i) => i !== index))
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Email Notification</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      An email will be sent to the member with application details and instructions to complete the full loan application process.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Create & Send Email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
