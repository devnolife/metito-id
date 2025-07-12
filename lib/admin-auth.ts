import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isAdmin } from './auth'
import { errorResponse } from './api-response'

/**
 * Verify admin authentication and return result
 * Used in API routes for admin authentication
 */
export async function verifyAdminAuth(request: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(request)

    if (!isAdminUser) {
      return { success: false, message: 'Admin access required' }
    }

    // Get user data
    const user = await getUserFromRequest(request)

    if (!user) {
      return { success: false, message: 'Authentication required' }
    }

    return { success: true, user }

  } catch (error) {
    console.error('Admin auth error:', error)
    return { success: false, message: 'Authentication failed' }
  }
}

/**
 * Higher-order function to protect admin API routes
 * Usage: export const POST = withAdminAuth(async (request, user) => { ... })
 */
export function withAdminAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      // Check if user is admin
      const isAdminUser = await isAdmin(request)

      if (!isAdminUser) {
        return errorResponse('Admin access required', 403)
      }

      // Get user data
      const user = await getUserFromRequest(request)

      if (!user) {
        return errorResponse('Authentication required', 401)
      }

      // Call the actual handler with user data
      return await handler(request, user)

    } catch (error) {
      console.error('Admin auth error:', error)
      return errorResponse('Authentication failed', 500)
    }
  }
}

/**
 * Higher-order function to protect authenticated API routes (admin or customer)
 * Usage: export const POST = withAuth(async (request, user) => { ... })
 */
export function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      // Get user data
      const user = await getUserFromRequest(request)

      if (!user) {
        return errorResponse('Authentication required', 401)
      }

      // Call the actual handler with user data
      return await handler(request, user)

    } catch (error) {
      console.error('Auth error:', error)
      return errorResponse('Authentication failed', 500)
    }
  }
}

/**
 * Get user info from request headers (set by middleware)
 */
export function getUserFromHeaders(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const userEmail = request.headers.get('x-user-email')
  const userRole = request.headers.get('x-user-role')

  if (!userId || !userEmail || !userRole) {
    return null
  }

  return {
    id: userId,
    email: userEmail,
    role: userRole
  }
}

/**
 * Check if current user is admin from headers
 */
export function isAdminFromHeaders(request: NextRequest): boolean {
  const userRole = request.headers.get('x-user-role')
  return userRole === 'ADMIN'
}

/**
 * Middleware helper to validate admin access
 */
export async function validateAdminAccess(request: NextRequest) {
  const user = await getUserFromRequest(request)

  if (!user) {
    throw new Error('Authentication required')
  }

  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated')
  }

  return user
}

/**
 * Response helper for admin routes
 */
export function adminResponse(data: any, message: string = 'Success', status: number = 200) {
  return NextResponse.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }, { status })
}

/**
 * Error response helper for admin routes
 */
export function adminErrorResponse(message: string, status: number = 400, error?: any) {
  return NextResponse.json({
    success: false,
    message,
    error: error || 'ADMIN_ERROR',
    timestamp: new Date().toISOString()
  }, { status })
} 
