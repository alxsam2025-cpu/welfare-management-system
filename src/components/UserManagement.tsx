'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Search,
  Settings,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER' | 'COMMITTEE_MEMBER' | 'OVERSIGHT_COMMITTEE' | 'ACCOUNTANT'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  member?: {
    id: string
    fullName: string
    memberNumber: string
  }
}

interface UserFormData {
  email: string
  name: string
  password: string
  role: string
  isActive: boolean
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    password: '',
    role: 'USER',
    isActive: true
  })

  const userRoles = [
    { value: 'ADMIN', label: 'Administrator', icon: Crown, description: 'Full system access' },
    { value: 'COMMITTEE_MEMBER', label: 'Committee Member', icon: Shield, description: 'Loan approval access' },
    { value: 'OVERSIGHT_COMMITTEE', label: 'Oversight Committee', icon: Eye, description: 'Audit and oversight access' },
    { value: 'ACCOUNTANT', label: 'Accountant', icon: Settings, description: 'Financial management access' },
    { value: 'USER', label: 'Regular User', icon: Users, description: 'Basic member access' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast.error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Error loading users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return false
    }
    if (!editingUserId && (!formData.password || formData.password.length < 6)) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    if (!formData.role) {
      toast.error('Role is required')
      return false
    }
    
    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const endpoint = editingUserId 
        ? `/api/admin/users/${editingUserId}`
        : '/api/admin/users'
      
      const method = editingUserId ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save user')
      }

      const savedUser = await response.json()
      
      if (editingUserId) {
        setUsers(prev => prev.map(u => u.id === savedUser.id ? savedUser : u))
        toast.success('User updated successfully!')
        setEditingUserId(null)
      } else {
        setUsers(prev => [...prev, savedUser])
        toast.success('User created successfully!')
        setIsCreating(false)
      }
      
      resetForm()
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.message || 'Failed to save user')
    }
  }

  const handleEdit = (user: User) => {
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role,
      isActive: user.isActive
    })
    setEditingUserId(user.id)
    setIsCreating(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      const updatedUser = await response.json()
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
      
      toast.success(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`)
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'USER',
      isActive: true
    })
    setShowPassword(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingUserId(null)
    resetForm()
  }

  const getRoleInfo = (role: string) => {
    return userRoles.find(r => r.value === role) || userRoles[userRoles.length - 1]
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600 bg-red-100'
      case 'COMMITTEE_MEMBER': return 'text-blue-600 bg-blue-100'
      case 'OVERSIGHT_COMMITTEE': return 'text-purple-600 bg-purple-100'
      case 'ACCOUNTANT': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gradient">User Management</h1>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        )}
      </div>

      {/* Create/Edit User Form */}
      {isCreating && (
        <div className="card-glow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingUserId ? 'Edit User' : 'Create New User'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="user@praws.gov.gh"
                  required
                />
              </div>

              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="label">
                  {editingUserId ? 'New Password (leave empty to keep current)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input pr-10"
                    placeholder={editingUserId ? 'Enter new password' : 'Enter password'}
                    required={!editingUserId}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!editingUserId && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              <div>
                <label className="label">User Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  {userRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                {getRoleInfo(formData.role).label} Permissions:
              </h3>
              <p className="text-blue-700 text-sm">
                {getRoleInfo(formData.role).description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                User is active and can access the system
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                {editingUserId ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {!isCreating && (
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Users List */}
      {!isCreating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => {
            const roleInfo = getRoleInfo(user.role)
            const RoleIcon = roleInfo.icon
            
            return (
              <div key={user.id} className="card-glow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                      <RoleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className={`badge ${getRoleColor(user.role)} text-xs`}>
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isActive 
                          ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                          : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={user.isActive ? 'Deactivate user' : 'Activate user'}
                    >
                      {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {user.lastLogin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {user.member && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Linked Member:</span>
                      <span className="font-medium text-blue-600">
                        {user.member.fullName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>{roleInfo.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isCreating && filteredUsers.length === 0 && (
        <div className="card-glow p-8 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm ? 'No users found' : 'No users created yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first user to get started with user management'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First User
            </button>
          )}
        </div>
      )}

      {/* Role Legend */}
      {!isCreating && users.length > 0 && (
        <div className="card-glow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRoles.map((role) => {
              const RoleIcon = role.icon
              return (
                <div key={role.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <RoleIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-800">{role.label}</div>
                    <div className="text-xs text-gray-600">{role.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
