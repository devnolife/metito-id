import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const createServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDesc: z.string().optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).default([]),
  pricing: z.record(z.any()).optional(),
  isFeatured: z.boolean().default(false),
})

// GET /api/services - List all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const where: any = { isActive: true }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const services = await db.service.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { name: 'asc' }
      ]
    })

    return successResponse(services)

  } catch (error) {
    console.error('Get services error:', error)
    return errorResponse('Failed to fetch services', 500)
  }
}

// POST /api/services - Create new service (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createServiceSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Generate slug
    const slug = slugify(data.name, { lower: true, strict: true })

    // Check if slug already exists
    const existingService = await db.service.findUnique({
      where: { slug }
    })

    if (existingService) {
      return errorResponse('Service with this name already exists', 409)
    }

    // Create service
    const service = await db.service.create({
      data: {
        ...data,
        slug,
      }
    })

    return successResponse(service, 'Service created successfully', 201)

  } catch (error) {
    console.error('Create service error:', error)
    return errorResponse('Failed to create service', 500)
  }
} 
