'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/utils/currency'
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Building2,
  PiggyBank,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Activity,
  Banknote,
  UserPlus,
  FileCheck,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  Award
} from 'lucide-react'

interface DashboardStats {
  totalMembers: number
  activeLoans: number
  totalContributions: number
  pendingApplications: number
  monthlyGrowth: number
  loanDefaultRate: number
  totalDisbursed: number
  availableFunds: number
}

interface RecentActivity {
  id: string
  type: 'member' | 'loan' | 'payment' | 'welfare'
  description: string
  amount?: number
  timestamp: Date
  status: 'success' | 'pending' | 'warning'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeLoans: 0,
    totalContributions: 0,
    pendingApplications: 0,
    monthlyGrowth: 0,
    loanDefaultRate: 0,
    totalDisbursed: 0,
    availableFunds: 0
  })

  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatedStats, setAnimatedStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeLoans: 0,
    totalContributions: 0,
    pendingApplications: 0,
    monthlyGrowth: 0,
    loanDefaultRate: 0,
    totalDisbursed: 0,
    availableFunds: 0
  })

  useEffect(() => {
    // Load dashboard data immediately with demo data
    const loadDashboardData = () => {
      try {
        // Set demo stats for PRAWS
        setStats({
          totalMembers: 276, // All Research Assistants
          activeLoans: 43,
          totalContributions: 156780.50,
          pendingApplications: 12,
          monthlyGrowth: 15.3,
          loanDefaultRate: 2.1,
          totalDisbursed: 89450.00,
          availableFunds: 234567.89
        })

        setActivities([
          {
            id: '1',
            type: 'member',
            description: 'New member registration: John Doe (Accra Central)',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: 'success'
          },
          {
            id: '2',
            type: 'loan',
            description: 'Personal loan approved - 6 months (3% interest)',
            amount: 5000,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: 'success'
          },
          {
            id: '3',
            type: 'payment',
            description: 'Monthly welfare contribution received',
            amount: 250,
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            status: 'success'
          },
          {
            id: '4',
            type: 'welfare',
            description: 'Emergency medical support disbursed',
            amount: 1500,
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: 'pending'
          }
        ])

        setIsLoading(false)
        
        // Animate the numbers
        animateNumbers()
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Always set loading to false to prevent infinite loading
        setIsLoading(false)
      }
    }
    
    const animateNumbers = () => {
      const duration = 2000 // 2 seconds
      const steps = 60
      const stepDuration = duration / steps
      
      let currentStep = 0
      
      const animate = () => {
        if (currentStep <= steps) {
          const progress = currentStep / steps
          const easeOut = 1 - Math.pow(1 - progress, 3)
          
          setAnimatedStats({
            totalMembers: Math.floor(276 * easeOut),
            activeLoans: Math.floor(43 * easeOut),
            totalContributions: 156780.50 * easeOut,
            pendingApplications: Math.floor(12 * easeOut),
            monthlyGrowth: 15.3 * easeOut,
            loanDefaultRate: 2.1 * easeOut,
            totalDisbursed: 89450.00 * easeOut,
            availableFunds: 234567.89 * easeOut
          })
          
          currentStep++
          setTimeout(animate, stepDuration)
        }
      }
      
      animate()
    }

    // Load immediately first
    loadDashboardData()
    
    // Also set a timeout as backup
    const timeoutId = setTimeout(loadDashboardData, 200)
    
    // Final fallback to ensure loading never stays true forever
    const fallbackId = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(fallbackId)
    }
  }, [])


  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member': return <UserPlus className="w-4 h-4" />
      case 'loan': return <Banknote className="w-4 h-4" />
      case 'payment': return <CreditCard className="w-4 h-4" />
      case 'welfare': return <FileCheck className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'warning': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Dashboard...</h2>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="mb-4">
                <h2 className="text-lg text-blue-200 font-medium mb-1">
                  Welcome to PRAWS Management System
                </h2>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient-white">
                  PRAWS Welfare System
                </h1>
              </div>
              <p className="text-xl text-blue-100">
                Parliamentarian Research Assistant Welfare Scheme
              </p>
              <p className="text-blue-200 mt-2">
                Comprehensive welfare management for our valued members
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/members"
                className="btn btn-success flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Member
              </Link>
              <Link
                href="/loans"
                className="btn btn-primary flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Loan Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* PRAWS About Section - Moved to Top */}
        <div className="card-glow p-8 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gradient mb-2">About PRAWS</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              PARLIAMENTARIAN RESEARCH ASSISTANT WELFARE SCHEME (PRAWS)
            </h3>
            <p className="text-lg text-purple-700 font-medium mb-6">
              NINTH PARLIAMENT OF GHANA
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              The Parliamentarian Research Assistance Welfare has been established to promote financial security, 
              well-being, and professional empowerment for all <strong>276 Research Assistants (RAs)</strong> serving 
              Members of Parliament. The scheme seeks to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-blue-600 font-semibold mb-2">1.01</div>
                <p className="text-sm text-gray-700">
                  Provide timely financial support during emergencies and critical life events.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-purple-600 font-semibold mb-2">1.02</div>
                <p className="text-sm text-gray-700">
                  Offer a structured, transparent, and self-sustaining system for contributions, loans, and benefits.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-green-600 font-semibold mb-2">1.03</div>
                <p className="text-sm text-gray-700">
                  Foster a spirit of solidarity, accountability, and financial leverage among RAs.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-3 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Our Mission
              </h4>
              <p className="text-blue-100 leading-relaxed">
                To enhance the socio-economic leverage among Research Assistants by providing accessible 
                and responsive welfare support mechanisms.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-3 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                Our Vision
              </h4>
              <p className="text-purple-100 leading-relaxed">
                To become a sustainable and empowering welfare scheme that supports the holistic growth and 
                financial stability for all Parliamentarian Research Assistants in Ghana.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Animated Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members - Animated */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-blue-200 animate-pulse" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Members</p>
                <p className="text-4xl font-bold mb-2 font-mono">{Math.floor(animatedStats.totalMembers).toLocaleString()}</p>
                <div className="flex items-center text-sm text-blue-200">
                  <ArrowUp className="w-4 h-4 mr-1 animate-bounce" />
                  <span>+{animatedStats.monthlyGrowth.toFixed(1)}% this month</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>

          {/* Active Loans - Animated */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <Target className="w-6 h-6 text-green-200 animate-pulse" />
              </div>
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Active Loans</p>
                <p className="text-4xl font-bold mb-2 font-mono">{Math.floor(animatedStats.activeLoans)}</p>
                <div className="flex items-center text-sm text-green-200">
                  <TrendingUp className="w-4 h-4 mr-1 animate-bounce" />
                  <span>Default rate: {animatedStats.loanDefaultRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>

          {/* Total Contributions - Animated */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <Zap className="w-6 h-6 text-purple-200 animate-pulse" />
              </div>
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Contributions</p>
                <p className="text-3xl font-bold mb-2 font-mono">{formatCurrency(animatedStats.totalContributions)}</p>
                <div className="flex items-center text-sm text-purple-200">
                  <PiggyBank className="w-4 h-4 mr-1 animate-bounce" />
                  <span>Member welfare fund</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>

          {/* Pending Applications - Animated */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <Award className="w-6 h-6 text-orange-200 animate-pulse" />
              </div>
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Pending Applications</p>
                <p className="text-4xl font-bold mb-2 font-mono">{Math.floor(animatedStats.pendingApplications)}</p>
                <div className="flex items-center text-sm text-orange-200">
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  <span>Awaiting review</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Financial Summary */}
          <div className="card-glow p-6 fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-blue-600" />
              Financial Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <span className="font-medium text-gray-700">Total Disbursed</span>
                <span className="text-xl font-bold text-blue-700">
                  {formatCurrency(stats.totalDisbursed)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <span className="font-medium text-gray-700">Available Funds</span>
                <span className="text-xl font-bold text-green-700">
                  {formatCurrency(stats.availableFunds)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <span className="font-medium text-gray-700">Monthly Contributions</span>
                <span className="text-xl font-bold text-purple-700">
                  {formatCurrency(stats.totalContributions / 12)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card-glow p-6 fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-600" />
                Recent Activities
              </h3>
              <Link href="/activities" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.description}
                    </p>
                    {activity.amount && (
                      <p className="text-sm text-blue-600 font-medium">
                        {formatCurrency(activity.amount)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glow p-6 fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Eye className="w-6 h-6 mr-3 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Link href="/members" className="btn btn-outline flex-col h-24 gap-2">
              <Users className="w-6 h-6" />
              <span className="text-xs">Members</span>
            </Link>
            <Link href="/loans" className="btn btn-outline flex-col h-24 gap-2">
              <CreditCard className="w-6 h-6" />
              <span className="text-xs">Loans</span>
            </Link>
            <Link href="/payments" className="btn btn-outline flex-col h-24 gap-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-xs">Payments</span>
            </Link>
            <Link href="/welfare" className="btn btn-outline flex-col h-24 gap-2">
              <FileCheck className="w-6 h-6" />
              <span className="text-xs">Welfare</span>
            </Link>
            <Link href="/accounts" className="btn btn-outline flex-col h-24 gap-2">
              <Building2 className="w-6 h-6" />
              <span className="text-xs">Accounts</span>
            </Link>
            <Link href="/journal" className="btn btn-outline flex-col h-24 gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Journal</span>
            </Link>
            <Link href="/bank" className="btn btn-outline flex-col h-24 gap-2">
              <PiggyBank className="w-6 h-6" />
              <span className="text-xs">Banking</span>
            </Link>
            <Link href="/business" className="btn btn-outline flex-col h-24 gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Business</span>
            </Link>
            <Link href="/reports" className="btn btn-outline flex-col h-24 gap-2">
              <FileText className="w-6 h-6" />
              <span className="text-xs">Reports</span>
            </Link>
            <Link href="/settings" className="btn btn-outline flex-col h-24 gap-2">
              <AlertCircle className="w-6 h-6" />
              <span className="text-xs">Settings</span>
            </Link>
            <Link href="/demo" className="btn btn-secondary flex-col h-24 gap-2">
              <Eye className="w-6 h-6" />
              <span className="text-xs">Demo</span>
            </Link>
          </div>
        </div>


        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="card-success p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">System Status</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
          </div>
          <div className="card-primary p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Performance</p>
                <p className="text-sm text-gray-600">Excellent response times</p>
              </div>
            </div>
          </div>
          <div className="card-accent p-4">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Updates</p>
                <p className="text-sm text-gray-600">System up to date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
