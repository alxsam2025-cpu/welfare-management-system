'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Activity, 
  ArrowLeft,
  UserPlus,
  Banknote,
  CreditCard,
  FileCheck,
  Calendar,
  Filter
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'member' | 'loan' | 'payment' | 'welfare'
  description: string
  amount?: number
  timestamp: Date
  status: 'success' | 'pending' | 'warning'
  memberName?: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivities = () => {
      const allActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'member',
          description: 'New member registration: John Doe (Accra Central)',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          status: 'success',
          memberName: 'John Doe'
        },
        {
          id: '2',
          type: 'loan',
          description: 'Personal loan approved - 6 months (3% interest)',
          amount: 5000,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success',
          memberName: 'Grace Osei-Bonsu'
        },
        {
          id: '3',
          type: 'payment',
          description: 'Monthly welfare contribution received',
          amount: 250,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          status: 'success',
          memberName: 'Emmanuel Tetteh'
        },
        {
          id: '4',
          type: 'welfare',
          description: 'Emergency medical support disbursed',
          amount: 1500,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          status: 'pending',
          memberName: 'Fatima Al-Hassan'
        },
        {
          id: '5',
          type: 'member',
          description: 'Member profile updated - Contact information',
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          status: 'success',
          memberName: 'John Kwame Asante'
        },
        {
          id: '6',
          type: 'loan',
          description: 'Loan application submitted for review',
          amount: 3000,
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          status: 'pending',
          memberName: 'Mary Adjei'
        }
      ]
      
      setActivities(allActivities)
      setIsLoading(false)
    }

    setTimeout(loadActivities, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC',
      minimumFractionDigits: 2,
    }).format(amount)
  }

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
      case 'member': return <UserPlus className="w-5 h-5" />
      case 'loan': return <Banknote className="w-5 h-5" />
      case 'payment': return <CreditCard className="w-5 h-5" />
      case 'welfare': return <FileCheck className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member': return 'text-blue-600 bg-blue-100'
      case 'loan': return 'text-purple-600 bg-purple-100'
      case 'payment': return 'text-green-600 bg-green-100'
      case 'welfare': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Activities...</h2>
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
                System Activities
              </h1>
            </div>
            <p className="text-xl text-blue-100">All Member & System Activities</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="card-glow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
              <button className="btn btn-outline flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {activity.description}
                          </p>
                          {activity.memberName && (
                            <p className="text-xs text-gray-600 mb-2">
                              Member: {activity.memberName}
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {activity.amount && (
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              {formatCurrency(activity.amount)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {activities.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activities found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
