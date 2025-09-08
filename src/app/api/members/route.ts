import { NextResponse } from 'next/server'

// Mock data for now - replace with actual database calls later
const mockMembers = [
  {
    id: '1',
    memberNumber: 'PRAWS20240001',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@parliament.gov.gh',
    phoneNumber: '+233 24 123 4567',
    constituency: 'Accra Central',
    mpName: 'Hon. Samuel Atta Mills',
    floorNumber: '2',
    roomNumber: '201A',
    telephoneContact: '+233 30 266 0001',
    status: 'ACTIVE',
    totalContributions: 2500.00,
    currentLoanBalance: 1000.00,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'MALE',
    maritalStatus: 'MARRIED',
    address: '123 Liberation Road, Accra',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+233 24 987 6543',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    memberNumber: 'PRAWS20240002',
    firstName: 'Mary',
    lastName: 'Asante',
    fullName: 'Mary Asante',
    email: 'mary.asante@parliament.gov.gh',
    phoneNumber: '+233 24 234 5678',
    constituency: 'Kumasi Metropolitan',
    mpName: 'Hon. Osei Kyei-Mensah-Bonsu',
    floorNumber: '3',
    roomNumber: '302B',
    telephoneContact: '+233 30 266 0002',
    status: 'ACTIVE',
    totalContributions: 3200.00,
    currentLoanBalance: 0.00,
    dateOfBirth: new Date('1985-05-15'),
    gender: 'FEMALE',
    maritalStatus: 'SINGLE',
    address: '456 Manhyia Palace Road, Kumasi',
    emergencyContact: 'Kwame Asante',
    emergencyPhone: '+233 24 876 5432',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function GET() {
  try {
    // Return mock data for now
    return NextResponse.json(mockMembers)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Mock creating a new member
    const newMember = {
      id: String(mockMembers.length + 1),
      memberNumber: `PRAWS2024${String(mockMembers.length + 1).padStart(4, '0')}`,
      ...data,
      totalContributions: 0,
      currentLoanBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockMembers.push(newMember)
    
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
