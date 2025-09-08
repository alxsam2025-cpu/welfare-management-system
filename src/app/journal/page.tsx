'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/utils/currency'
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react'

interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    debitAccount: '',
    creditAccount: '',
    amount: 0
  })

  useEffect(() => {
    const loadEntries = () => {
      const demoEntries: JournalEntry[] = [
        {
          id: '1',
          date: '2024-02-15',
          reference: 'JE001',
          description: 'Member contribution received',
          debitAccount: 'Cash and Bank (1000)',
          creditAccount: 'Member Contributions Income (4000)',
          amount: 250.00
        }
      ]
      setEntries(demoEntries)
      setIsLoading(false)
    }
    setTimeout(loadEntries, 100)
  }, [])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Journal Entries...</h2>
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
                Journal Entries
              </h1>
            </div>
            <p className="text-xl text-blue-100">Accounting Transactions & Journal Records</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Journal Entries</h3>
              <button 
                onClick={() => setShowAddEntry(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </div>
            
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-gray-600">{entry.reference} • {entry.date}</p>
                    </div>
                    <p className="font-bold text-blue-600">{formatCurrency(entry.amount)}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Debit:</p>
                      <p className="font-medium">{entry.debitAccount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Credit:</p>
                      <p className="font-medium">{entry.creditAccount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {entries.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No journal entries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Journal Entry Modal */}
        {showAddEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">New Journal Entry</h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const entryToAdd: JournalEntry = {
                    ...newEntry,
                    id: (entries.length + 1).toString(),
                    reference: newEntry.reference || `JE${String(entries.length + 1).padStart(3, '0')}`
                  }
                  setEntries(prev => [entryToAdd, ...prev])
                  setNewEntry({
                    date: new Date().toISOString().split('T')[0],
                    reference: '',
                    description: '',
                    debitAccount: '',
                    creditAccount: '',
                    amount: 0
                  })
                  setShowAddEntry(false)
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        required
                        value={newEntry.date}
                        onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                      <input
                        type="text"
                        value={newEntry.reference}
                        onChange={(e) => setNewEntry({...newEntry, reference: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto-generated if empty"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      required
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the transaction"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Debit Account *</label>
                    <select
                      required
                      value={newEntry.debitAccount}
                      onChange={(e) => setNewEntry({...newEntry, debitAccount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Debit Account</option>
                      <option value="Cash and Bank (1000)">Cash and Bank (1000)</option>
                      <option value="Member Contributions Receivable (1100)">Member Contributions Receivable (1100)</option>
                      <option value="Loans Receivable (1200)">Loans Receivable (1200)</option>
                      <option value="Interest Receivable (1300)">Interest Receivable (1300)</option>
                      <option value="Administrative Expenses (5000)">Administrative Expenses (5000)</option>
                      <option value="Welfare Disbursements (5100)">Welfare Disbursements (5100)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Account *</label>
                    <select
                      required
                      value={newEntry.creditAccount}
                      onChange={(e) => setNewEntry({...newEntry, creditAccount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Credit Account</option>
                      <option value="Member Welfare Fund (2000)">Member Welfare Fund (2000)</option>
                      <option value="Emergency Fund Reserve (2100)">Emergency Fund Reserve (2100)</option>
                      <option value="PRAWS Capital Fund (3000)">PRAWS Capital Fund (3000)</option>
                      <option value="Member Contributions Income (4000)">Member Contributions Income (4000)</option>
                      <option value="Interest Income (4100)">Interest Income (4100)</option>
                      <option value="Cash and Bank (1000)">Cash and Bank (1000)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₵) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newEntry.amount || ''}
                      onChange={(e) => setNewEntry({...newEntry, amount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddEntry(false)
                        setNewEntry({
                          date: new Date().toISOString().split('T')[0],
                          reference: '',
                          description: '',
                          debitAccount: '',
                          creditAccount: '',
                          amount: 0
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
                      Create Entry
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
