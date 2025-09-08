'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  ArrowLeft,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface Payment {
  id: string
  memberName: string
  staffId: string
  amount: number
  paymentType: 'contribution' | 'loan_payment' | 'fee'
  status: 'completed' | 'pending' | 'failed'
  paymentDate: string
  reference: string
  description: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPayments = () => {
      const demoPayments: Payment[] = [
        {
          id: '1',
          memberName: 'John Kwame Asante',
          staffId: 'RA001',
          amount: 250.00,
          paymentType: 'contribution',
          status: 'completed',
          paymentDate: '2024-02-15',
          reference: 'PAY001',
          description: 'Monthly welfare contribution'
        },
        {
          id: '2',
          memberName: 'Grace Osei-Bonsu',
          staffId: 'RA002',
          amount: 877.57,
          paymentType: 'loan_payment',
          status: 'completed',
          paymentDate: '2024-02-14',
          reference: 'PAY002',
          description: 'Loan repayment - February'
        }
      ]
      setPayments(demoPayments)
      setIsLoading(false)
    }
    setTimeout(loadPayments, 500)
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
          <h2 className="text-xl font-semibold text-gray-600">Loading Payments...</h2>
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
                Payments
              </h1>
            </div>
            <p className="text-xl text-blue-100">Member Payments & Contributions</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Payments</h3>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.memberName}</p>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{payment.paymentDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
