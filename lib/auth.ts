import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './db'
import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'metito-tempur'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  [key: string]: unknown
}

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export const signJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' })
}

// Edge-compatible JWT utilities
export const signJWTEdge = async (payload: JWTPayload): Promise<string> => {
  const secret = new TextEncoder().encode(JWT_SECRET)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret)
}

export const verifyJWTEdge = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    return payload
  } catch (error) {
    return null
  }
}

// Get user from request
export const getUserFromRequest = async (request: NextRequest) => {
  try {
    // Try multiple token sources for better compatibility
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    const bearerToken = authHeader?.replace('Bearer ', '') || null

    // Prioritize Authorization header, then cookie
    const token = bearerToken || cookieToken

    if (!token) {
      return null
    }

    const payload = await verifyJWTEdge(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      }
    })

    return user
  } catch (error) {
    // Only log actual errors, not expected authentication failures
    if (error instanceof Error && !error.message.includes('Invalid compact JWE')) {
      console.error('Error in getUserFromRequest:', error)
    }
    return null
  }
}

// Edge-compatible user retrieval
export const getUserFromRequestEdge = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return null
    }

    const payload = await verifyJWTEdge(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      }
    })

    return user
  } catch (error) {
    return null
  }
}

// Check if user is admin
export const isAdmin = async (request: NextRequest): Promise<boolean> => {
  const user = await getUserFromRequest(request)
  return user?.role === 'ADMIN' && user?.isActive === true
}

// Edge-compatible admin check
export const isAdminEdge = async (request: NextRequest): Promise<boolean> => {
  const user = await getUserFromRequestEdge(request)
  return user?.role === 'ADMIN' && user?.isActive === true
}

// Check if user is authenticated
export const isAuthenticated = async (request: NextRequest): Promise<boolean> => {
  const user = await getUserFromRequest(request)
  return user !== null && user.isActive === true
} 
