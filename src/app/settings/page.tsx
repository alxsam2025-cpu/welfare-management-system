'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Settings, 
  ArrowLeft,
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Key,
  UserCog
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'COMMITTEE_MEMBER' | 'ACCOUNTANT' | 'STAFF'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)

  useEffect(() => {
    const loadUsers = () => {
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'System Administrator',
          email: 'admin@praws.gov.gh',
          role: 'ADMIN',
          status: 'active',
          createdAt: '2023-01-01',
          lastLogin: '2024-02-15'
        },
        {
          id: '2',
          name: 'Committee Chairman',
          email: 'chairman@praws.gov.gh',
          role: 'COMMITTEE_MEMBER',
          status: 'active',
          createdAt: '2023-01-15',
          lastLogin: '2024-02-14'
        },
        {
          id: '3',
          name: 'Financial Officer',
          email: 'finance@praws.gov.gh',
          role: 'ACCOUNTANT',
          status: 'active',
          createdAt: '2023-02-01',
          lastLogin: '2024-02-13'
        }
      ]
      
      setUsers(demoUsers)
      setIsLoading(false)
    }

    setTimeout(loadUsers, 500)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-700 bg-red-100'
      case 'COMMITTEE_MEMBER': return 'text-blue-700 bg-blue-100'
      case 'ACCOUNTANT': return 'text-green-700 bg-green-100'
      case 'STAFF': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'ADMIN': 
        return ['Full system access', 'User management', 'All financial operations', 'System settings']
      case 'COMMITTEE_MEMBER': 
        return ['Loan approvals', 'Member management', 'Financial reports', 'Welfare decisions']
      case 'ACCOUNTANT': 
        return ['Financial transactions', 'Chart of accounts', 'Journal entries', 'Financial reports']
      case 'STAFF': 
        return ['Member registration', 'Payment recording', 'Basic reports']
      default: 
        return ['Read-only access']
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Settings...</h2>
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
                System Settings
              </h1>
            </div>
            <p className="text-xl text-blue-100">User Management & System Configuration</p>
          </div>
        </div>
        
        <div className="container-custom py-8">
          {/* User Management Section */}
          <div className="card-glow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserCog className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">User Management</h3>
              </div>
              <button 
                onClick={() => setShowAddUser(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
            
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'}`}>
                          {user.status}
                        </div>
                      </div>
                      
                      <div className="ml-13">
                        <p className="text-xs text-gray-500 mb-2">
                          Created: {new Date(user.createdAt).toLocaleDateString()} 
                          {user.lastLogin && ` • Last login: ${new Date(user.lastLogin).toLocaleDateString()}`}
                        </p>
                        
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {getRolePermissions(user.role).map((permission, index) => (
                              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-glow p-6">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">Security Settings</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configure password policies, session timeouts, and security preferences.
              </p>
              <button className="btn btn-outline text-sm">Configure</button>
            </div>

            <div className="card-glow p-6">
              <Key className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">API Settings</h3>
              <p className="text-gray-600 text-sm mb-4">
                Manage API keys, webhooks, and external integrations.
              </p>
              <button className="btn btn-outline text-sm">Manage</button>
            </div>

            <div className="card-glow p-6">
              <Settings className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">System Preferences</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configure system-wide settings, notifications, and defaults.
              </p>
              <button className="btn btn-outline text-sm">Settings</button>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h2>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="user@praws.gov.gh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Select role</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="COMMITTEE_MEMBER">Committee Member</option>
                      <option value="ACCOUNTANT">Accountant</option>
                      <option value="STAFF">Staff</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Temporary password"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      Create User
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
