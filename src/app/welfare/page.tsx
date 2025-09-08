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
          {/* Welfare Benefits Overview */}
          <div className="card-glow p-6 mb-8">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Welfare Support System</h3>
            <p className="text-gray-600 text-center mb-6">
              Comprehensive welfare services for PRAWS members including emergency assistance, 
              medical support, and family welfare programs.
            </p>
          </div>

          {/* Clause 2.4: Categories of Benefits */}
          <div className="card-glow p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-red-600" />
              Clause 2.4: Categories of Benefits
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Section 2.4.1: Recognized Benefit Types</h4>
              <p className="text-blue-700 text-sm">The following benefit types shall be recognized:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-red-800 mb-2">Emergency Medical Care</h4>
                <p className="text-red-700 text-sm">
                  Financial support for urgent medical treatments, hospital bills, and emergency healthcare needs.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Death of Spouse, Child, or Biological Parent</h4>
                <p className="text-gray-700 text-sm">
                  Bereavement support and financial assistance during the loss of immediate family members.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-pink-800 mb-2">Marriage Support</h4>
                <p className="text-pink-700 text-sm">
                  Financial assistance to support members during their wedding ceremonies and celebrations.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-green-800 mb-2">Naming Ceremony Support</h4>
                <p className="text-green-700 text-sm">
                  Support for traditional naming ceremonies and celebration of new births in member families.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-orange-800 mb-2">Termination of Appointment</h4>
                <p className="text-orange-700 text-sm">
                  Financial support during career transitions and end of parliamentary service periods.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 2.5: Benefit Approval Process */}
          <div className="card-glow p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Clause 2.5: Benefit Approval Process
            </h3>

            <div className="space-y-6">
              {/* Section 2.5.1 */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h4 className="font-bold text-blue-800 mb-3">Section 2.5.1: Application Submission</h4>
                <p className="text-blue-700 mb-4">
                  Members must submit a formal request and attach relevant documents such as:
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-2 ml-4">
                  <li>Medical bills and hospital receipts</li>
                  <li>Funeral notices and death certificates</li>
                  <li>Marriage certificates and wedding invitations</li>
                  <li>Birth certificates for naming ceremonies</li>
                  <li>Termination letters and official documents</li>
                </ul>
              </div>

              {/* Section 2.5.2 */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6">
                <h4 className="font-bold text-green-800 mb-3">Section 2.5.2: Document Validation</h4>
                <p className="text-green-700">
                  The Committee will validate the submitted documents and assess eligibility based on:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-2 ml-4 mt-3">
                  <li>Member's contribution status and compliance</li>
                  <li>Authenticity and completeness of supporting documents</li>
                  <li>Alignment with recognized benefit categories</li>
                  <li>Available fund allocation and budget constraints</li>
                </ul>
              </div>

              {/* Section 2.5.3 */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                <h4 className="font-bold text-purple-800 mb-3">Section 2.5.3: Committee Approval</h4>
                <p className="text-purple-700 mb-4">
                  A quorum of three Committee members, including the Chairperson, must approve the disbursement.
                </p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Approval Requirements:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <p className="text-sm text-purple-700">Minimum Committee Members</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <p className="text-sm text-purple-700">Chairperson Required</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <p className="text-sm text-purple-700">Unanimous Approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
