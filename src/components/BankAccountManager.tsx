'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building, 
  CreditCard, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  branchName?: string
  branchCode?: string
  swiftCode?: string
  routingNumber?: string
  accountType: 'SAVINGS' | 'CHECKING' | 'CURRENT' | 'BUSINESS'
  currency: string
  isActive: boolean
  isPrimary: boolean
  isVerified: boolean
  verifiedAt?: Date
  verificationMethod?: string
  createdAt: Date
  updatedAt: Date
}

interface BankAccountFormData {
  bankName: string
  accountNumber: string
  accountName: string
  branchName?: string
  branchCode?: string
  swiftCode?: string
  routingNumber?: string
  accountType: 'SAVINGS' | 'CHECKING' | 'CURRENT' | 'BUSINESS'
  currency: string
  isPrimary: boolean
}

interface BankAccountManagerProps {
  memberId: string
  accounts: BankAccount[]
  onAccountAdded?: (account: BankAccount) => void
  onAccountUpdated?: (account: BankAccount) => void
  onAccountDeleted?: (accountId: string) => void
}

const BankAccountManager: React.FC<BankAccountManagerProps> = ({
  memberId,
  accounts = [],
  onAccountAdded,
  onAccountUpdated,
  onAccountDeleted
}) => {
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BankAccountFormData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    branchName: '',
    branchCode: '',
    swiftCode: '',
    routingNumber: '',
    accountType: 'SAVINGS',
    currency: 'GHC',
    isPrimary: false
  })

  const ghanaianBanks = [
    'Access Bank Ghana',
    'Absa Bank Ghana',
    'Agricultural Development Bank',
    'Bank of Ghana',
    'Consolidated Bank Ghana',
    'Ecobank Ghana',
    'First Atlantic Bank',
    'First National Bank Ghana',
    'GCB Bank',
    'Guaranty Trust Bank Ghana',
    'National Investment Bank',
    'OmniBank Ghana',
    'Prudential Bank',
    'Republic Bank Ghana',
    'Societe Generale Ghana',
    'Standard Chartered Bank Ghana',
    'Stanbic Bank Ghana',
    'United Bank for Africa Ghana',
    'Universal Merchant Bank',
    'Zenith Bank Ghana'
  ]

  const accountTypes = [
    { value: 'SAVINGS', label: 'Savings Account' },
    { value: 'CHECKING', label: 'Checking Account' },
    { value: 'CURRENT', label: 'Current Account' },
    { value: 'BUSINESS', label: 'Business Account' }
  ]

  const currencies = [
    { value: 'GHC', label: 'Ghana Cedi (GHC)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ]

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      accountName: '',
      branchName: '',
      branchCode: '',
      swiftCode: '',
      routingNumber: '',
      accountType: 'SAVINGS',
      currency: 'GHS',
      isPrimary: false
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.bankName.trim()) {
      toast.error('Bank name is required')
      return false
    }
    if (!formData.accountNumber.trim()) {
      toast.error('Account number is required')
      return false
    }
    if (!formData.accountName.trim()) {
      toast.error('Account name is required')
      return false
    }
    if (formData.accountNumber.length < 10) {
      toast.error('Account number must be at least 10 digits')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const endpoint = editingAccountId 
        ? `/api/members/${memberId}/bank-accounts/${editingAccountId}`
        : `/api/members/${memberId}/bank-accounts`
      
      const method = editingAccountId ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save bank account')
      }

      const savedAccount = await response.json()
      
      if (editingAccountId) {
        onAccountUpdated?.(savedAccount)
        toast.success('Bank account updated successfully!')
        setEditingAccountId(null)
      } else {
        onAccountAdded?.(savedAccount)
        toast.success('Bank account added successfully!')
        setIsAddingAccount(false)
      }
      
      resetForm()
    } catch (error) {
      console.error('Error saving bank account:', error)
      toast.error('Failed to save bank account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (account: BankAccount) => {
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      branchName: account.branchName || '',
      branchCode: account.branchCode || '',
      swiftCode: account.swiftCode || '',
      routingNumber: account.routingNumber || '',
      accountType: account.accountType,
      currency: account.currency,
      isPrimary: account.isPrimary
    })
    setEditingAccountId(account.id)
    setIsAddingAccount(true)
  }

  const handleDelete = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/members/${memberId}/bank-accounts/${accountId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bank account')
      }

      onAccountDeleted?.(accountId)
      toast.success('Bank account deleted successfully!')
    } catch (error) {
      console.error('Error deleting bank account:', error)
      toast.error('Failed to delete bank account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPrimary = async (accountId: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/members/${memberId}/bank-accounts/${accountId}/set-primary`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to set primary account')
      }

      const updatedAccount = await response.json()
      onAccountUpdated?.(updatedAccount)
      toast.success('Primary account updated successfully!')
    } catch (error) {
      console.error('Error setting primary account:', error)
      toast.error('Failed to set primary account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingAccount(false)
    setEditingAccountId(null)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Bank Accounts</h2>
        </div>
        {!isAddingAccount && (
          <button
            onClick={() => setIsAddingAccount(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bank Account
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAddingAccount && (
        <div className="card-glow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingAccountId ? 'Edit Bank Account' : 'Add New Bank Account'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Bank Name *</label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select a bank</option>
                  {ghanaianBanks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Account Type *</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  {accountTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div>
                <label className="label">Account Name *</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Account holder name"
                  required
                />
              </div>

              <div>
                <label className="label">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Branch name"
                />
              </div>

              <div>
                <label className="label">Branch Code</label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Branch code"
                />
              </div>

              <div>
                <label className="label">SWIFT Code</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="SWIFT/BIC code"
                />
              </div>

              <div>
                <label className="label">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="select"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700">
                Set as primary account
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {editingAccountId ? 'Update Account' : 'Add Account'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bank Accounts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full">
            <div className="card-glow p-8 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Bank Accounts</h3>
              <p className="text-gray-500 mb-4">
                Add a bank account to enable financial transactions and payments.
              </p>
              <button
                onClick={() => setIsAddingAccount(true)}
                className="btn btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Your First Bank Account
              </button>
            </div>
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="card-glow p-6 relative">
              {account.isPrimary && (
                <div className="absolute top-4 right-4">
                  <span className="badge-primary">Primary</span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{account.bankName}</h3>
                    <p className="text-sm text-gray-600">{account.accountType} Account</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit account"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Number:</span>
                  <span className="font-mono text-sm font-medium">
                    ****{account.accountNumber.slice(-4)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Name:</span>
                  <span className="text-sm font-medium">{account.accountName}</span>
                </div>

                {account.branchName && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Branch:</span>
                    <span className="text-sm">{account.branchName}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Currency:</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-sm font-medium">{account.currency}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center gap-2">
                    {account.isVerified ? (
                      <span className="badge-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="badge-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                    {account.isActive ? (
                      <span className="badge-success">Active</span>
                    ) : (
                      <span className="badge-error">Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              {!account.isPrimary && account.isActive && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSetPrimary(account.id)}
                    className="btn btn-outline btn-sm w-full"
                    disabled={isLoading}
                  >
                    Set as Primary Account
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BankAccountManager
