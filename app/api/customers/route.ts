import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

// Force this route to run in the Node.js runtime (NOT edge) so Prisma works reliably
export const runtime = 'nodejs'
// Ensure no static optimization that could cache stale data during dev
export const dynamic = 'force-dynamic'

// Validation schema for creating a customer
const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional().nullable(),
  email: z.string().email('Invalid email'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  projectType: z.string().optional().nullable(),
  testimonial: z.string().optional().nullable(),
  rating: z.number().int().min(0).max(5).default(0).optional(),
  avatar: z.string().optional().nullable(),
  website: z.string().url('Invalid URL').optional().nullable(),
  contactDate: z.string().datetime().optional().nullable(),
  projectValue: z.string().optional().nullable(),
  status: z.enum(['potential','active','completed']).default('potential').optional(),
  isPublicTestimonial: z.boolean().default(false).optional(),
  featured: z.boolean().default(false).optional()
})

// GET /api/customers - list customers with optional filters & pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const skip = (page - 1) * limit

    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const featured = searchParams.get('featured')
    const q = searchParams.get('q')?.toLowerCase()

    const where: any = {}
    if (status) where.status = status
    if (industry) where.industry = industry
    if (featured === 'true') where.featured = true

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { projectType: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Extra safety: if customer delegate is somehow missing (stale client), log keys
    if (!(db as any).customer && process.env.NODE_ENV !== 'production') {
      console.error('[api/customers] Prisma client missing customer delegate. Keys:', Object.keys(db as any))
      throw new Error('Prisma client missing customer delegate (customer). Hot-reload stale instance?')
    }

    const [customers, total] = await Promise.all([
      (db as any).customer.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      (db as any).customer.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (e) {
    console.error('List customers error', e)
    // Provide more diagnostics in development to trace the 500
    if (process.env.NODE_ENV !== 'production') {
      return errorResponse(`Failed to fetch customers: ${(e as any)?.message || e}`, 500)
    }
    return errorResponse('Failed to fetch customers', 500)
  }
}

// POST /api/customers - create customer (admin)
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid pulling auth (and thus prisma) code into edge/middleware bundles
    const { isAdmin } = await import('@/lib/auth')
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')

    const body = await request.json()
    const result = createCustomerSchema.safeParse(body)
    if (!result.success) {
      return validationErrorResponse(result.error.flatten().fieldErrors)
    }
    const data = result.data
    const { contactDate, ...rest } = data
    const created = await db.customer.create({
      data: {
        ...rest,
        contactDate: contactDate ? new Date(contactDate) : null
      }
    })
    return successResponse(created, 'Customer created', 201)
  } catch (e: any) {
    // Handle unique email constraint
    if (e?.code === 'P2002') {
      return errorResponse('Email already exists', 409)
    }
    console.error('Create customer error', e)
    return errorResponse('Failed to create customer', 500)
  }
}
