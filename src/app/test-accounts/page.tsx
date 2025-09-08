'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Plus, 
  ArrowLeft
} from 'lucide-react'

interface ChartAccount {
  id: string
  accountCode: string
  accountName: string
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  balance: number
  isActive: boolean
  description: string
  createdAt: string
}

export default function TestAccountsPage() {
  const [accounts, setAccounts] = useState<ChartAccount[]>([
    {
      id: '1',
      accountCode: '1000',
      accountName: 'Cash and Bank',
      accountType: 'ASSET',
      balance: 234567.89,
      isActive: true,
      description: 'Cash in hand and bank balances',
      createdAt: '2023-01-01'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'ASSET' as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
    description: '',
    balance: 0
  })

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    const accountToAdd: ChartAccount = {
      ...newAccount,
      id: (accounts.length + 1).toString(),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setAccounts(prev => [accountToAdd, ...prev])
    setNewAccount({
      accountCode: '',
      accountName: '',
      accountType: 'ASSET',
      description: '',
      balance: 0
    })
    setShowAddForm(false)
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
                Test Chart of Accounts
              </h1>
            </div>
            <p className="text-xl text-blue-100">
              PRAWS Accounting System - Test Version
            </p>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Chart of Accounts ({accounts.length} accounts)</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-success flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Account
              </button>
            </div>
            
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{account.accountName}</p>
                      <p className="text-sm text-gray-600">{account.accountCode} • {account.accountType}</p>
                      <p className="text-xs text-gray-500">{account.description}</p>
                    </div>
                    <p className="font-bold text-blue-600">{formatCurrency(account.balance)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Account Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Account</h2>
                
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Code *</label>
                    <input
                      type="text"
                      required
                      value={newAccount.accountCode}
                      onChange={(e) => setNewAccount({...newAccount, accountCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                    <input
                      type="text"
                      required
                      value={newAccount.accountName}
                      onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account name"
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
                      <option value="ASSET">Asset</option>
                      <option value="LIABILITY">Liability</option>
                      <option value="EQUITY">Equity</option>
                      <option value="REVENUE">Revenue</option>
                      <option value="EXPENSE">Expense</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      required
                      value={newAccount.description}
                      onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the purpose of this account"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance (₵) *</label>
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
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
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
