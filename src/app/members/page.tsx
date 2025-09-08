'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  User,
  Building,
  Calendar,
  ArrowLeft
} from 'lucide-react'

interface Member {
  id: string
  fullName: string
  staffId: string
  email: string
  phone: string
  constituency: string
  mpName: string
  floorNumber?: string
  roomNumber?: string
  telephoneContact?: string
  joinedDate: string
  status: 'active' | 'inactive' | 'suspended'
  totalContributions: number
  activeLoans: number
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Load demo members data
    const loadMembers = () => {
      const demoMembers: Member[] = [
        {
          id: '1',
          fullName: 'John Kwame Asante',
          staffId: 'RA001',
          email: 'j.asante@parliament.gh',
          phone: '+233244123456',
          constituency: 'Accra Central',
          mpName: 'Hon. Mary Adjei',
          floorNumber: '2nd Floor',
          roomNumber: 'Room 205',
          telephoneContact: '+233302123456',
          joinedDate: '2023-01-15',
          status: 'active',
          totalContributions: 3500.00,
          activeLoans: 1
        },
        {
          id: '2',
          fullName: 'Grace Osei-Bonsu',
          staffId: 'RA002',
          email: 'g.osei@parliament.gh',
          phone: '+233244789123',
          constituency: 'Kumasi North',
          mpName: 'Hon. Peter Mensah',
          floorNumber: '1st Floor',
          roomNumber: 'Room 105',
          telephoneContact: '+233302456789',
          joinedDate: '2023-02-01',
          status: 'active',
          totalContributions: 4200.00,
          activeLoans: 0
        },
        {
          id: '3',
          fullName: 'Emmanuel Tetteh',
          staffId: 'RA003',
          email: 'e.tetteh@parliament.gh',
          phone: '+233244567890',
          constituency: 'Cape Coast Central',
          mpName: 'Hon. Akosua Frema',
          floorNumber: '3rd Floor',
          roomNumber: 'Room 302',
          telephoneContact: '+233302987654',
          joinedDate: '2023-01-10',
          status: 'active',
          totalContributions: 2800.00,
          activeLoans: 2
        },
        {
          id: '4',
          fullName: 'Fatima Al-Hassan',
          staffId: 'RA004',
          email: 'f.hassan@parliament.gh',
          phone: '+233244321654',
          constituency: 'Tamale North',
          mpName: 'Hon. Abdul Rahman',
          floorNumber: '2nd Floor',
          roomNumber: 'Room 210',
          telephoneContact: '+233302654321',
          joinedDate: '2023-03-15',
          status: 'active',
          totalContributions: 1500.00,
          activeLoans: 0
        }
      ]
      
      setMembers(demoMembers)
      setIsLoading(false)
    }

    setTimeout(loadMembers, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHC',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100'
      case 'inactive': return 'text-gray-700 bg-gray-100'
      case 'suspended': return 'text-red-700 bg-red-100'
      default: return 'text-blue-700 bg-blue-100'
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.constituency.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Loading Members...</h2>
          <p className="text-gray-500">Please wait while we fetch member data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-pattern min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-4 mb-2">
                  <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-bold text-gradient-white">
                    Members Management
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  Manage PRAWS Welfare Scheme Members
                </p>
                <p className="text-blue-200 mt-2">
                  Total Members: {members.length} | Active: {members.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-success flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Member
                </button>
                <button className="btn btn-secondary flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import from Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Search and Filter Bar */}
          <div className="card-glow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, staff ID, or constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button className="btn btn-outline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <div key={member.id} className="card-glow p-6 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{member.fullName}</h3>
                      <p className="text-sm text-gray-600">{member.staffId}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{member.constituency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{member.mpName}</span>
                  </div>
                  {member.floorNumber && member.roomNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{member.floorNumber}, {member.roomNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {new Date(member.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Contributions</p>
                    <p className="font-bold text-green-700">{formatCurrency(member.totalContributions)}</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Active Loans</p>
                    <p className="font-bold text-blue-700">{member.activeLoans}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="btn btn-outline text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Members Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first welfare member.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
