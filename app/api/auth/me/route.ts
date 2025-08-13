import { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return unauthorizedResponse('Please login to access this resource')
    }

    return successResponse(user, 'User profile retrieved successfully')

  } catch (error) {
    console.error('Get user profile error:', error)
    return unauthorizedResponse('Failed to get user profile')
  }
} 
