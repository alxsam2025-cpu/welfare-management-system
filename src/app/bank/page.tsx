'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface BankAccount {
  id: string
  accountName: string
  bankName: string
  accountNumber: string
  accountType: 'CURRENT' | 'SAVINGS' | 'FIXED_DEPOSIT'
  balance: number
  currency: string
  status: 'active' | 'inactive' | 'frozen'
  openingDate: string
  signatories: string[]
  purpose: string
}

export default function BankAccountPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddAccount, setShowAddAccount] = useState(false)

  useEffect(() => {
    const loadAccounts = () => {
      const demoAccounts: BankAccount[] = [
        {
          id: '1',
          accountName: 'PRAWS Main Operating Account',
          bankName: 'Ghana Commercial Bank',
          accountNumber: '1234567890',
          accountType: 'CURRENT',
          balance: 234567.89,
          currency: 'GHC',
          status: 'active',
          openingDate: '2023-01-01',
          signatories: ['Committee Chairman', 'Treasurer', 'Secretary'],
          purpose: 'Main operational funds and member contributions'
        },
        {
          id: '2',
          accountName: 'PRAWS Emergency Reserve Fund',
          bankName: 'Ecobank Ghana',
          accountNumber: '9876543210',
          accountType: 'SAVINGS',
          balance: 150000.00,
          currency: 'GHC',
          status: 'active',
          openingDate: '2023-01-15',
          signatories: ['Committee Chairman', 'Financial Secretary'],
          purpose: 'Emergency assistance and welfare disbursements'
        },
        {
          id: '3',
          accountName: 'PRAWS Investment Account',
          bankName: 'Stanbic Bank Ghana',
          accountNumber: '1122334455',
          accountType: 'FIXED_DEPOSIT',
          balance: 100000.00,
          currency: 'GHC',
          status: 'active',
          openingDate: '2023-02-01',
          signatories: ['Committee Chairman', 'Investment Committee Chair'],
          purpose: 'Long-term investments and capital growth'
        }
      ]
      
      setAccounts(demoAccounts)
      setIsLoading(false)
    }

    setTimeout(loadAccounts, 500)
  }, [])

  const formatCurrency = (amount: number, currency: string = 'GHC') => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'CURRENT': return 'text-blue-700 bg-blue-100'
      case 'SAVINGS': return 'text-green-700 bg-green-100'
      case 'FIXED_DEPOSIT': return 'text-purple-700 bg-purple-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100'
      case 'inactive': return 'text-gray-700 bg-gray-100'
      case 'frozen': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <AlertCircle className="w-4 h-4" />
      case 'frozen': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

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
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-white">
                Bank Account Management
              </h1>
            </div>
            <p className="text-xl text-blue-100">PRAWS Financial Accounts & Banking</p>
            <p className="text-blue-200 mt-2">
              Total Accounts: {accounts.length} | Total Balance: {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          {/* Account Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card-primary p-4 text-center">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Banks</p>
              <p className="text-2xl font-bold text-blue-700">{new Set(accounts.map(a => a.bankName)).size}</p>
            </div>
            <div className="card-success p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="card-accent p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
              <p className="text-2xl font-bold text-purple-700">{accounts.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="card-warning p-4 text-center">
              <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Account Types</p>
              <p className="text-2xl font-bold text-orange-700">{new Set(accounts.map(a => a.accountType)).size}</p>
            </div>
          </div>

          {/* Bank Accounts List */}
          <div className="card-glow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Bank Accounts</h3>
              <button 
                onClick={() => setShowAddAccount(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
            
            <div className="space-y-6">
              {accounts.map((account) => (
                <div key={account.id} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {account.bankName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{account.accountName}</h4>
                          <p className="text-gray-600">{account.bankName}</p>
                          <p className="text-sm text-gray-500">Account: {account.accountNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                      <div className="flex items-center gap-2 justify-end">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getAccountTypeColor(account.accountType)}`}>
                          {account.accountType.replace('_', ' ')}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(account.status)}`}>
                          {getStatusIcon(account.status)}
                          {account.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Account Details</h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Opened:</span> {new Date(account.openingDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Currency:</span> {account.currency}</p>
                        <p><span className="font-medium">Purpose:</span> {account.purpose}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Authorized Signatories</h5>
                      <div className="space-y-1">
                        {account.signatories.map((signatory, index) => (
                          <span key={index} className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mr-2 mb-1">
                            {signatory}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="btn btn-outline flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      View Transactions
                    </button>
                    <button className="btn btn-outline flex items-center gap-2 text-sm">
                      <Edit className="w-4 h-4" />
                      Edit Details
                    </button>
                    <button className="btn btn-outline text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm">
                      <Trash2 className="w-4 h-4" />
                      Close Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Account Modal */}
        {showAddAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Bank Account</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. PRAWS Operating Account"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Ghana Commercial Bank"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Account number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select type</option>
                        <option value="CURRENT">Current Account</option>
                        <option value="SAVINGS">Savings Account</option>
                        <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the purpose of this account"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAccount(false)}
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
