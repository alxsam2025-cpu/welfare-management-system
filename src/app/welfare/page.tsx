'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  ArrowLeft,
  Users,
  DollarSign
} from 'lucide-react'

export default function WelfarePage() {
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
                Welfare Services
              </h1>
            </div>
            <p className="text-xl text-blue-100">Emergency Assistance & Member Benefits</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Welfare Support System</h3>
            <p className="text-gray-600 text-center">
              Comprehensive welfare services for PRAWS members including emergency assistance, 
              medical support, and family welfare programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
