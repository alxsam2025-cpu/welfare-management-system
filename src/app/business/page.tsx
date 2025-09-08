'use client'

import Link from 'next/link'
import { 
  ArrowLeft,
  Building2,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export default function BusinessPage() {
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
                Business Management
              </h1>
            </div>
            <p className="text-xl text-blue-100">PRAWS Business Activities & Investments</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Business Operations</h3>
            <p className="text-gray-600 text-center">
              Manage PRAWS business activities, investments, and revenue-generating initiatives 
              for the welfare scheme sustainability.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
