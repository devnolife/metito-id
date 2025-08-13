import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Test API: Starting...')

    // Test database connection
    console.log('Test API: Testing database connection...')
    await prisma.$connect()
    console.log('Test API: Database connected successfully')

    // Test basic query
    const userCount = await prisma.user.count()
    console.log('Test API: User count:', userCount)

    // Test auth
    console.log('Test API: Testing authentication...')
    const authResult = await verifyAdminAuth(request)
    console.log('Test API: Auth result:', authResult)

    return NextResponse.json({
      success: true,
      message: 'Test successful',
      data: {
        databaseConnected: true,
        userCount,
        authResult
      }
    })

  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 
