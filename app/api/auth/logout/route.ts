import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  const response = successResponse(null, 'Logged out successfully')

  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Always use 'lax' for better compatibility
    path: '/',
    maxAge: 0,
  })

  // Clear the auth status cookie
  response.cookies.set('auth-status', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Always use 'lax' for better compatibility
    path: '/',
    maxAge: 0,
  })



  return response
} 
