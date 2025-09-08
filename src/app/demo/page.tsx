'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, Users, CreditCard, Building, Shield, FileText } from 'lucide-react'

export default function DemoPage() {
  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Complete member profiles with parliamentary details',
      features: ['Full Name & Constituency', 'MP Name & Floor/Room', 'Contact Information', 'Status Tracking'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: 'Loan Application System',
      description: '4-step loan process with smart interest rates',
      features: ['3 months (1%)', '6 months (3%)', '12 months (5%)', 'Digital Agreement'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Building,
      title: 'Bank Account Management',
      description: 'Complete banking integration for all Ghanaian banks',
      features: ['20+ Major Banks', 'Multiple Account Types', 'Primary Account Selection', 'Verification System'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'User Management',
      description: 'Role-based access control with admin privileges',
      features: ['Admin Access', 'Committee Members', 'Oversight Committee', 'Regular Users'],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FileText,
      title: 'Accounting System',
      description: 'Chart of accounts with journal entries',
      features: ['Welfare Contributions', 'Loan Accounts', 'Investment Tracking', 'Payment Matching'],
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gradient">PRAWS System Demo</h1>
            <p className="text-gray-600">Feature Showcase</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="card-glow p-8 mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Complete Welfare Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Serving all 276 Research Assistants in the Ninth Parliament of Ghana
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">276</div>
              <div className="text-blue-800 font-medium">Research Assistants</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-green-800 font-medium">Mobile Responsive</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-purple-800 font-medium">System Availability</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="card-glow p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${feature.color} text-white rounded-lg`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Technical Specs */}
        <div className="card-glow p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Frontend Technology</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• React Hot Toast notifications</li>
                <li>• Lucide React icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Backend & Database</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• PostgreSQL database</li>
                <li>• Prisma ORM</li>
                <li>• NextAuth.js authentication</li>
                <li>• API routes with validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Deployment</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Vercel hosting</li>
                <li>• Automatic deployments</li>
                <li>• Environment variables</li>
                <li>• Production optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card-glow p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Transform Welfare Management?
          </h3>
          <p className="text-gray-600 mb-6">
            Experience the future of parliamentary research assistant welfare management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn btn-primary flex items-center gap-2 justify-center"
            >
              <Users className="w-4 h-4" />
              View Dashboard
            </Link>
            <a
              href="https://github.com/alxsam2025-cpu/welfare-management-system"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline flex items-center gap-2 justify-center"
            >
              <FileText className="w-4 h-4" />
              View Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
