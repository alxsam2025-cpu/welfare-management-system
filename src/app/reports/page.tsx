'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  ArrowLeft,
  BarChart3,
  Download
} from 'lucide-react'

export default function ReportsPage() {
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
                Reports & Analytics
              </h1>
            </div>
            <p className="text-xl text-blue-100">Financial Reports & Member Statistics</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Report Generation</h3>
            <p className="text-gray-600 text-center">
              Generate comprehensive reports for member activities, financial statements, 
              loan portfolios, and welfare scheme performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
