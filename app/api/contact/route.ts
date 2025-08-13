import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  productId: z.string().optional(),
})

// POST /api/contact - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = createInquirySchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Get user if authenticated
    const user = await getUserFromRequest(request)

    // If product inquiry, verify product exists
    if (data.productId) {
      const product = await db.product.findUnique({
        where: { id: data.productId, isActive: true }
      })

      if (!product) {
        return errorResponse('Product not found', 404)
      }
    }

    // Create inquiry
    const inquiry = await db.inquiry.create({
      data: {
        ...data,
        userId: user?.id,
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    // TODO: Send email notification to admin
    // await sendInquiryNotification(inquiry)

    return successResponse(inquiry, 'Your inquiry has been submitted successfully. We will contact you soon.', 201)

  } catch (error) {
    console.error('Create inquiry error:', error)
    return errorResponse('Failed to submit inquiry', 500)
  }
}

// GET /api/contact - Get inquiries (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Admin access required', 403)
    }

    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Filters
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get inquiries
    const [inquiries, total] = await Promise.all([
      db.inquiry.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, slug: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.inquiry.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    console.error('Get inquiries error:', error)
    return errorResponse('Failed to fetch inquiries', 500)
  }
} 
