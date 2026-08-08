import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { SignJWT } from 'jose'

// Edge-compatible JWT signing
async function signJWTEdge(payload: { userId: string; email: string; role: string }): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'metito-tempur')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret)
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { email, password } = result.data

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
        avatar: true,
        company: true,
        phone: true,
      }
    })

    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated', 401)
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401)
    }

    // Generate JWT token
    const token = await signJWTEdge({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response = successResponse({
      user: userWithoutPassword,
      token,
    }, 'Login successful')

    // Set HTTP-only cookie with proper configuration
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for development (localhost)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours to match JWT expiry
    })

    // Also set a client-side readable cookie for auth status
    response.cookies.set('auth-status', 'authenticated', {
      httpOnly: false,
      secure: false, // Set to false for development (localhost)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    })



    return response

  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Login failed', 500)
  }
} 
