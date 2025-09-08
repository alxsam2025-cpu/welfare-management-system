'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
    setTimeout(loadEntries, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC',
      minimumFractionDigits: 2,
    }).format(amount)
  }

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
              <button className="btn btn-primary flex items-center gap-2">
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
      </div>
    </div>
  )
}
