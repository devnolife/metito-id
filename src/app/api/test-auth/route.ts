import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Test Auth API: Starting...')

    // Test authentication
    console.log('Test Auth API: Testing authentication...')
    const authResult = await verifyAdminAuth(request)
    console.log('Test Auth API: Auth result:', authResult)

    return NextResponse.json({
      success: true,
      message: 'Authentication test completed',
      data: {
        authResult,
        headers: {
          authorization: request.headers.get('authorization') ? 'Present' : 'Missing',
          cookie: request.headers.get('cookie') ? 'Present' : 'Missing'
        }
      }
    })

  } catch (error) {
    console.error('Test Auth API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
