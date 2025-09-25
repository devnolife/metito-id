import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const createCertificationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  issuer: z.string().min(2, 'Issuer is required'),
  certificate: z.string().optional(),
  issuedAt: z.string().datetime('Invalid issued date'),
  expiresAt: z.string().datetime('Invalid expiry date').optional(),
  certificateNumber: z.string().optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional().or(z.literal('')).optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  status: z.enum(['active','expired','pending']).optional(),
})

// GET /api/certifications - List all certifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}

    if (active === 'true') {
      where.isActive = true
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }

    const certifications = await db.certification.findMany({
      where,
      orderBy: { issuedAt: 'desc' }
    })

    return successResponse(certifications)

  } catch (error) {
    console.error('Get certifications error:', error)
    return errorResponse('Failed to fetch certifications', 500)
  }
}

// POST /api/certifications - Create new certification (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createCertificationSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { issuedAt, expiresAt, status, ...rest } = result.data
    // derive status if not provided
    let finalStatus = status
    if (!finalStatus) {
      const expDate = expiresAt ? new Date(expiresAt) : null
      if (expDate && expDate < new Date()) finalStatus = 'expired'
      else finalStatus = 'active'
    }

    // Create certification
    const certification = await db.certification.create({
      data: {
        ...rest,
        status: finalStatus,
        issuedAt: new Date(issuedAt),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    })

    return successResponse(certification, 'Certification created successfully', 201)

  } catch (error) {
    console.error('Create certification error:', error)
    return errorResponse('Failed to create certification', 500)
  }
} 
