'use client'

import React, { useState, useEffect } from 'react'
import { Users, Edit, Trash2, Plus, Search, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import BankAccountManager from './BankAccountManager'

interface Member {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'
  address: string
  emergencyContact: string
  emergencyPhone: string
  nationalId?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED'
  totalContributions: number
  currentLoanBalance: number
  bankAccounts?: any[]
}

const MemberManager: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showBankAccounts, setShowBankAccounts] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Member>>({})

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      toast.error('Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (member: Member) => {
    setEditForm(member)
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    if (!editForm.id) return
    
    try {
      const response = await fetch(`/api/members/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        const updatedMember = await response.json()
        setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m))
        setIsEditing(false)
        toast.success('Member updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update member')
    }
  }

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMembers(prev => prev.filter(m => m.id !== memberId))
        toast.success('Member deleted successfully!')
      }
    } catch (error) {
      toast.error('Failed to delete member')
    }
  }

  const filteredMembers = members.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  if (showBankAccounts && selectedMember) {
    return (
      <div>
        <button 
          onClick={() => setShowBankAccounts(false)}
          className="btn btn-ghost mb-4"
        >
          ← Back to Members
        </button>
        <BankAccountManager 
          memberId={selectedMember.id}
          accounts={selectedMember.bankAccounts || []}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Member Management</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          className="input pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card-glow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-gray-600">{member.memberNumber}</p>
                <span className={`badge ${
                  member.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'
                }`}>
                  {member.status}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 hover:bg-blue-50 rounded-lg"
                  title="Edit member"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(member)
                    setShowBankAccounts(true)
                  }}
                  className="p-2 hover:bg-green-50 rounded-lg"
                  title="Manage bank accounts"
                >
                  <Eye className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 hover:bg-red-50 rounded-lg"
                  title="Delete member"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{member.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{member.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contributions:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(member.totalContributions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Balance:</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(member.currentLoanBalance)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Edit Member</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    className="input"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    className="input"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    className="select"
                    value={editForm.status || 'ACTIVE'}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value as Member['status']})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="TERMINATED">Terminated</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="btn btn-primary"
                >
                  Update Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberManager
