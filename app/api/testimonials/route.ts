import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  position: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5).default(5),
  avatar: z.string().optional(),
})

// GET /api/testimonials - List testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      isApproved: true
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        company: true,
        position: true,
        content: true,
        rating: true,
        avatar: true,
        isFeatured: true,
        createdAt: true,
      }
    })

    return successResponse(testimonials)

  } catch (error) {
    console.error('Get testimonials error:', error)
    return errorResponse('Failed to fetch testimonials', 500)
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = createTestimonialSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Get user if authenticated
    const user = await getUserFromRequest(request)

    // Create testimonial (requires admin approval)
    const testimonial = await db.testimonial.create({
      data: {
        ...data,
        userId: user?.id,
        isApproved: false, // Requires admin approval
      }
    })

    return successResponse(testimonial, 'Thank you for your testimonial! It will be reviewed and published soon.', 201)

  } catch (error) {
    console.error('Create testimonial error:', error)
    return errorResponse('Failed to submit testimonial', 500)
  }
} 
