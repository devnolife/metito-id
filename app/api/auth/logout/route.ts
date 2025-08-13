import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  const response = successResponse(null, 'Logged out successfully')

  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0), // Force immediate expiration
  })

  // Clear the auth status cookie
  response.cookies.set('auth-status', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0), // Force immediate expiration
  })

  return response
} 
