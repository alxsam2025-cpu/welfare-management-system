'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/utils/currency'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Upload,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react'

interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  accountType: 'savings' | 'current' | 'fixed_deposit'
  balance: number
  currency: 'GHC' | 'USD' | 'EUR'
  branchName: string
  branchCode: string
  swiftCode?: string
  isActive: boolean
  dateOpened: string
  lastReconciled?: string
}

interface Transaction {
  id: string
  accountId: string
  date: string
  description: string
  reference: string
  type: 'credit' | 'debit'
  amount: number
  balance: number
  category: string
  reconciled: boolean
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    accountType: 'savings',
    balance: 0,
    currency: 'GHC',
    branchName: '',
    branchCode: '',
    swiftCode: ''
  })

  useEffect(() => {
    // Load demo bank accounts data
    const loadData = () => {
      const demoAccounts: BankAccount[] = [
        {
          id: '1',
          bankName: 'Ghana Commercial Bank',
          accountName: 'PRAWS Main Operating Account',
          accountNumber: '1234567890123',
          accountType: 'current',
          balance: 156780.50,
          currency: 'GHC',
          branchName: 'Ring Road Central Branch',
          branchCode: 'GCB-RRC-001',
          swiftCode: 'GHBCGHAC',
          isActive: true,
          dateOpened: '2023-01-15',
          lastReconciled: '2024-02-15'
        },
        {
          id: '2',
          bankName: 'Ecobank Ghana',
          accountName: 'PRAWS Emergency Fund',
          accountNumber: '9876543210987',
          accountType: 'savings',
          balance: 50000.00,
          currency: 'GHC',
          branchName: 'Osu Branch',
          branchCode: 'ECO-OSU-002',
          swiftCode: 'ECOCGHAC',
          isActive: true,
          dateOpened: '2023-02-01',
          lastReconciled: '2024-02-10'
        },
        {
          id: '3',
          bankName: 'Standard Chartered Bank',
          accountName: 'PRAWS USD Reserve Account',
          accountNumber: '5555666677778888',
          accountType: 'savings',
          balance: 12500.00,
          currency: 'USD',
          branchName: 'Independence Avenue Branch',
          branchCode: 'SCB-IAB-003',
          swiftCode: 'SCBLGHAC',
          isActive: true,
          dateOpened: '2023-03-15'
        }
      ]
      
      const demoTransactions: Transaction[] = [
        {
          id: '1',
          accountId: '1',
          date: '2024-02-20',
          description: 'Member contribution - February',
          reference: 'TXN-001',
          type: 'credit',
          amount: 15000.00,
          balance: 156780.50,
          category: 'Contributions',
          reconciled: false
        },
        {
          id: '2',
          accountId: '1',
          date: '2024-02-18',
          description: 'Welfare disbursement - Emergency assistance',
          reference: 'TXN-002',
          type: 'debit',
          amount: 5000.00,
          balance: 141780.50,
          category: 'Welfare Payments',
          reconciled: true
        },
        {
          id: '3',
          accountId: '2',
          date: '2024-02-15',
          description: 'Interest earned on savings',
          reference: 'INT-001',
          type: 'credit',
          amount: 250.00,
          balance: 50000.00,
          category: 'Interest Income',
          reconciled: true
        }
      ]
      
      setAccounts(demoAccounts)
      setTransactions(demoTransactions)
      setIsLoading(false)
    }

    setTimeout(loadData, 500)
  }, [])

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'current': return 'text-blue-700 bg-blue-100'
      case 'savings': return 'text-green-700 bg-green-100'
      case 'fixed_deposit': return 'text-purple-700 bg-purple-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'current': return <CreditCard className="w-4 h-4" />
      case 'savings': return <Banknote className="w-4 h-4" />
      case 'fixed_deposit': return <Building2 className="w-4 h-4" />
      default: return <DollarSign className="w-4 h-4" />
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredTransactions = transactions.filter(transaction => {
    return selectedAccount === 'all' || transaction.accountId === selectedAccount
  })

  const getTotalBalance = (currency: string) => {
    return accounts
      .filter(acc => acc.currency === currency && acc.isActive)
      .reduce((sum, acc) => sum + acc.balance, 0)
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    const accountToAdd: BankAccount = {
      ...newAccount as BankAccount,
      id: (accounts.length + 1).toString(),
      isActive: true,
      dateOpened: new Date().toISOString().split('T')[0]
    }
    setAccounts(prev => [accountToAdd, ...prev])
    setNewAccount({
      bankName: '',
      accountName: '',
      accountNumber: '',
      accountType: 'savings',
      balance: 0,
      currency: 'GHC',
      branchName: '',
      branchCode: '',
      swiftCode: ''
    })
    setShowAddForm(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Bank Accounts...</h2>
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
                    Bank Account Management
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  Manage PRAWS Banking Operations & Reconciliation
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
                  Add Bank Account
                </button>
                <button className="btn btn-secondary flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Bank Reconciliation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Balance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card-success p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total GHC Balance</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(getTotalBalance('GHC'))}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="card-primary p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total USD Balance</p>
                  <p className="text-2xl font-bold text-blue-700">${getTotalBalance('USD').toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="card-accent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
                  <p className="text-2xl font-bold text-purple-700">{accounts.filter(a => a.isActive).length}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="card-glow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by bank name, account name, or account number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button className="btn btn-outline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Statements
                </button>
                <button className="btn btn-outline flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import Transactions
                </button>
              </div>
            </div>
          </div>

          {/* Bank Accounts Table */}
          <div className="card-glow overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank & Account Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Reconciled
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account, index) => (
                    <tr key={account.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{account.bankName}</div>
                          <div className="text-sm text-gray-600">{account.accountName}</div>
                          <div className="text-xs text-gray-500 font-mono">{account.accountNumber}</div>
                          <div className="text-xs text-gray-500">{account.branchName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                          {getAccountTypeIcon(account.accountType)}
                          {account.accountType.replace('_', ' ').toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-bold text-green-600">
                          {account.currency === 'GHC' ? formatCurrency(account.balance) : `${account.currency} ${account.balance.toLocaleString()}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.lastReconciled ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">{new Date(account.lastReconciled).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-600">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1">
                            <ArrowRightLeft className="w-4 h-4" />
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

          {/* Recent Transactions */}
          <div className="card-glow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Accounts</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'credit' ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> :
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.reference} • {transaction.date}</p>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">{transaction.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600">Balance: {formatCurrency(transaction.balance)}</p>
                    {transaction.reconciled ? (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Bank Account Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Bank Account</h2>
                
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                      <input
                        type="text"
                        required
                        value={newAccount.bankName || ''}
                        onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Ghana Commercial Bank"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
                      <select
                        required
                        value={newAccount.accountType}
                        onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="savings">Savings Account</option>
                        <option value="current">Current Account</option>
                        <option value="fixed_deposit">Fixed Deposit</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                    <input
                      type="text"
                      required
                      value={newAccount.accountName || ''}
                      onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. PRAWS Main Operating Account"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                      <input
                        type="text"
                        required
                        value={newAccount.accountNumber || ''}
                        onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Account number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                      <select
                        value={newAccount.currency}
                        onChange={(e) => setNewAccount({...newAccount, currency: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GHC">Ghanaian Cedi (GHC)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                      <input
                        type="text"
                        required
                        value={newAccount.branchName || ''}
                        onChange={(e) => setNewAccount({...newAccount, branchName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Branch name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branch Code</label>
                      <input
                        type="text"
                        value={newAccount.branchCode || ''}
                        onChange={(e) => setNewAccount({...newAccount, branchCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Branch code"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newAccount.balance || ''}
                        onChange={(e) => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT Code</label>
                      <input
                        type="text"
                        value={newAccount.swiftCode || ''}
                        onChange={(e) => setNewAccount({...newAccount, swiftCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="For international transfers"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setNewAccount({
                          bankName: '',
                          accountName: '',
                          accountNumber: '',
                          accountType: 'savings',
                          balance: 0,
                          currency: 'GHC',
                          branchName: '',
                          branchCode: '',
                          swiftCode: ''
                        })
                      }}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      Add Account
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
