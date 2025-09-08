'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/utils/currency'
import { 
  FileText, 
  Download, 
  Calendar, 
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Filter,
  Search,
  BarChart3,
  PieChart,
  FileBarChart,
  Printer
} from 'lucide-react'

interface Report {
  id: string
  name: string
  description: string
  category: 'financial' | 'member' | 'loans' | 'contributions'
  icon: any
  lastGenerated?: string
  format: 'PDF' | 'Excel' | 'CSV'
}

interface FinancialSummary {
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })
  const [financialSummary] = useState<FinancialSummary>({
    totalAssets: 340517.89,
    totalLiabilities: 206780.50,
    totalEquity: 100000.00,
    totalRevenue: 188970.00,
    totalExpenses: 61200.00,
    netIncome: 127770.00
  })

  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Trial Balance',
      description: 'Complete trial balance with all account balances',
      category: 'financial',
      icon: BarChart3,
      lastGenerated: '2024-02-20',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity statement',
      category: 'financial',
      icon: Building2,
      format: 'PDF'
    },
    {
      id: '3',
      name: 'Income Statement',
      description: 'Revenue and expenses for the period',
      category: 'financial',
      icon: TrendingUp,
      format: 'PDF'
    },
    {
      id: '4',
      name: 'Member Contribution Report',
      description: 'Individual member contribution history',
      category: 'member',
      icon: Users,
      lastGenerated: '2024-02-18',
      format: 'Excel'
    },
    {
      id: '5',
      name: 'Loan Portfolio Report',
      description: 'All loans with payment status and balances',
      category: 'loans',
      icon: CreditCard,
      format: 'Excel'
    },
    {
      id: '6',
      name: 'Member Directory',
      description: 'Complete member contact information',
      category: 'member',
      icon: FileText,
      format: 'CSV'
    },
    {
      id: '7',
      name: 'Cash Flow Statement',
      description: 'Operating, investing, and financing activities',
      category: 'financial',
      icon: DollarSign,
      format: 'PDF'
    },
    {
      id: '8',
      name: 'Monthly Contributions Summary',
      description: 'Summary of all contributions by month',
      category: 'contributions',
      icon: PieChart,
      format: 'Excel'
    },
    {
      id: '9',
      name: 'Defaulters Report',
      description: 'Members with outstanding payments or loans',
      category: 'member',
      icon: TrendingDown,
      format: 'PDF'
    }
  ])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-blue-700 bg-blue-100'
      case 'member': return 'text-green-700 bg-green-100'
      case 'loans': return 'text-purple-700 bg-purple-100'
      case 'contributions': return 'text-orange-700 bg-orange-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const handleGenerateReport = async (report: Report) => {
    // Simulate report generation
    const loadingToast = setTimeout(() => {
      alert(`${report.name} has been generated and is ready for download!`)
    }, 2000)
    
    alert(`Generating ${report.name}... Please wait.`)
    
    return () => clearTimeout(loadingToast)
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Reports...</h2>
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
            <div className="flex items-center gap-4 mb-2">
              <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-white">
                Reports & Analytics
              </h1>
            </div>
            <p className="text-xl text-blue-100">
              Generate comprehensive reports for PRAWS operations
            </p>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card-success p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Assets</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(financialSummary.totalAssets)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="card-danger p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Liabilities</p>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(financialSummary.totalLiabilities)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="card-primary p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Income</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(financialSummary.netIncome)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="card-glow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="financial">Financial</option>
                <option value="member">Member Reports</option>
                <option value="loans">Loan Reports</option>
                <option value="contributions">Contributions</option>
              </select>
              
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="self-center text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const IconComponent = report.icon
              return (
                <div key={report.id} className="card-glow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{report.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                          {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {report.format}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  {report.lastGenerated && (
                    <p className="text-xs text-gray-500 mb-4">
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGenerateReport(report)}
                      className="btn btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Generate
                    </button>
                    <button className="btn btn-outline text-sm">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reports Found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card-glow p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="btn btn-success flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All Data
              </button>
              <button className="btn btn-primary flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Monthly Summary
              </button>
              <button className="btn btn-accent flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Financial Dashboard
              </button>
              <button className="btn btn-outline flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
