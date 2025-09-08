'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  CreditCard,
  PiggyBank,
  ArrowLeft,
  Filter
} from 'lucide-react'

interface ChartAccount {
  id: string
  accountCode: string
  accountName: string
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  parentAccountId?: string
  balance: number
  isActive: boolean
  description: string
  createdAt: string
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<ChartAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Load demo chart of accounts data
    const loadAccounts = () => {
      const demoAccounts: ChartAccount[] = [
        {
          id: '1',
          accountCode: '1000',
          accountName: 'Cash and Bank',
          accountType: 'ASSET',
          balance: 234567.89,
          isActive: true,
          description: 'Cash in hand and bank balances',
          createdAt: '2023-01-01'
        },
        {
          id: '2',
          accountCode: '1100',
          accountName: 'Member Contributions Receivable',
          accountType: 'ASSET',
          balance: 12500.00,
          isActive: true,
          description: 'Outstanding member welfare contributions',
          createdAt: '2023-01-01'
        },
        {
          id: '3',
          accountCode: '1200',
          accountName: 'Loans Receivable',
          accountType: 'ASSET',
          balance: 89450.00,
          isActive: true,
          description: 'Outstanding member loans',
          createdAt: '2023-01-01'
        },
        {
          id: '4',
          accountCode: '1300',
          accountName: 'Interest Receivable',
          accountType: 'ASSET',
          balance: 4500.00,
          isActive: true,
          description: 'Accrued interest on loans',
          createdAt: '2023-01-01'
        },
        {
          id: '5',
          accountCode: '2000',
          accountName: 'Member Welfare Fund',
          accountType: 'LIABILITY',
          balance: 156780.50,
          isActive: true,
          description: 'Total member welfare contributions',
          createdAt: '2023-01-01'
        },
        {
          id: '6',
          accountCode: '2100',
          accountName: 'Emergency Fund Reserve',
          accountType: 'LIABILITY',
          balance: 50000.00,
          isActive: true,
          description: 'Reserved funds for emergency assistance',
          createdAt: '2023-01-01'
        },
        {
          id: '7',
          accountCode: '3000',
          accountName: 'PRAWS Capital Fund',
          accountType: 'EQUITY',
          balance: 100000.00,
          isActive: true,
          description: 'Initial capital and retained earnings',
          createdAt: '2023-01-01'
        },
        {
          id: '8',
          accountCode: '4000',
          accountName: 'Member Contributions Income',
          accountType: 'REVENUE',
          balance: 180000.00,
          isActive: true,
          description: 'Monthly member welfare contributions',
          createdAt: '2023-01-01'
        },
        {
          id: '9',
          accountCode: '4100',
          accountName: 'Interest Income',
          accountType: 'REVENUE',
          balance: 8970.00,
          isActive: true,
          description: 'Interest earned on member loans',
          createdAt: '2023-01-01'
        },
        {
          id: '10',
          accountCode: '5000',
          accountName: 'Administrative Expenses',
          accountType: 'EXPENSE',
          balance: 15000.00,
          isActive: true,
          description: 'General administrative costs',
          createdAt: '2023-01-01'
        },
        {
          id: '11',
          accountCode: '5100',
          accountName: 'Welfare Disbursements',
          accountType: 'EXPENSE',
          balance: 45000.00,
          isActive: true,
          description: 'Emergency assistance and welfare payments',
          createdAt: '2023-01-01'
        },
        {
          id: '12',
          accountCode: '5200',
          accountName: 'Bank Charges',
          accountType: 'EXPENSE',
          balance: 1200.00,
          isActive: true,
          description: 'Banking fees and transaction charges',
          createdAt: '2023-01-01'
        }
      ]
      
      setAccounts(demoAccounts)
      setIsLoading(false)
    }

    setTimeout(loadAccounts, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'ASSET': return 'text-green-700 bg-green-100'
      case 'LIABILITY': return 'text-red-700 bg-red-100'
      case 'EQUITY': return 'text-blue-700 bg-blue-100'
      case 'REVENUE': return 'text-purple-700 bg-purple-100'
      case 'EXPENSE': return 'text-orange-700 bg-orange-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSET': return <TrendingUp className="w-4 h-4" />
      case 'LIABILITY': return <TrendingDown className="w-4 h-4" />
      case 'EQUITY': return <Building2 className="w-4 h-4" />
      case 'REVENUE': return <DollarSign className="w-4 h-4" />
      case 'EXPENSE': return <CreditCard className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || account.accountType === typeFilter
    
    return matchesSearch && matchesType
  })

  const getTotalByType = (type: string) => {
    return accounts
      .filter(acc => acc.accountType === type)
      .reduce((sum, acc) => sum + acc.balance, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Chart of Accounts...</h2>
          <p className="text-gray-500">Please wait while we fetch accounting data</p>
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
                    Chart of Accounts
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  PRAWS Accounting System
                </p>
                <p className="text-blue-200 mt-2">
                  Total Accounts: {accounts.length} | Active: {accounts.filter(a => a.isActive).length}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-success flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Account
                </button>
                <Link href="/journal" className="btn btn-secondary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Journal Entries
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Account Type Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="card-success p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(getTotalByType('ASSET'))}</p>
            </div>
            <div className="card-danger p-4 text-center">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Liabilities</p>
              <p className="text-lg font-bold text-red-700">{formatCurrency(getTotalByType('LIABILITY'))}</p>
            </div>
            <div className="card-primary p-4 text-center">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Equity</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(getTotalByType('EQUITY'))}</p>
            </div>
            <div className="card-accent p-4 text-center">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-purple-700">{formatCurrency(getTotalByType('REVENUE'))}</p>
            </div>
            <div className="card-warning p-4 text-center">
              <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-lg font-bold text-orange-700">{formatCurrency(getTotalByType('EXPENSE'))}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="card-glow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by account name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="ASSET">Assets</option>
                  <option value="LIABILITY">Liabilities</option>
                  <option value="EQUITY">Equity</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expenses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="card-glow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account, index) => (
                    <tr key={account.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">{account.accountCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{account.accountName}</div>
                          <div className="text-xs text-gray-500">{account.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                          {getAccountTypeIcon(account.accountType)}
                          {account.accountType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(account.balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${account.isActive ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'}`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Accounts Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first account.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
