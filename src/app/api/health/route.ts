import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'PRAWS Welfare Management System is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
