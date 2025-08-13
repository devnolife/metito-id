import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const createGalleryItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  category: z.string().optional(),
  projectType: z.enum(['INDUSTRIAL', 'MUNICIPAL', 'RESIDENTIAL', 'COMMERCIAL']).default('INDUSTRIAL'),
  location: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
})

// GET /api/gallery - List gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const projectType = searchParams.get('projectType')
    const featured = searchParams.get('featured')

    // Build where clause
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (projectType) {
      where.projectType = projectType
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Get gallery items
    const [galleryItems, total] = await Promise.all([
      db.galleryItem.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { completedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      db.galleryItem.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      galleryItems,
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
    console.error('Get gallery items error:', error)
    return errorResponse('Failed to fetch gallery items', 500)
  }
}

// POST /api/gallery - Create new gallery item (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createGalleryItemSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { completedAt, ...data } = result.data

    // Create gallery item
    const galleryItem = await db.galleryItem.create({
      data: {
        ...data,
        completedAt: completedAt ? new Date(completedAt) : null,
      }
    })

    return successResponse(galleryItem, 'Gallery item created successfully', 201)

  } catch (error) {
    console.error('Create gallery item error:', error)
    return errorResponse('Failed to create gallery item', 500)
  }
} 
