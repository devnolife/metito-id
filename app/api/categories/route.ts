import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = includeInactive ? {} : { isActive: true }

    const categories = await db.category.findMany({
      where,
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return successResponse(categories)

  } catch (error) {
    console.error('Get categories error:', error)
    return errorResponse('Failed to fetch categories', 500)
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdminEdge(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createCategorySchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Generate slug
    const slug = slugify(data.name, { lower: true, strict: true })

    // Check if slug already exists
    const existingCategory = await db.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return errorResponse('Category with this name already exists', 409)
    }

    // Create category
    const category = await db.category.create({
      data: {
        ...data,
        slug,
      }
    })

    return successResponse(category, 'Category created successfully', 201)

  } catch (error) {
    console.error('Create category error:', error)
    return errorResponse('Failed to create category', 500)
  }
} 
