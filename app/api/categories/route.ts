import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const categories = await db.category.findMany({
      where: { isActive: true },
      include: includeProducts ? {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isFeatured: true,
          }
        }
      } : undefined,
      orderBy: { name: 'asc' }
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
    console.log('POST /api/categories - Starting')
    
    // Check admin permission
    const adminCheck = await isAdmin(request)
    console.log('Admin check result:', adminCheck)
    
    if (!adminCheck) {
      console.log('Admin access denied')
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()
    console.log('Request body:', body)

    // Validate input
    const result = createCategorySchema.safeParse(body)
    console.log('Validation result:', result)
    
    if (!result.success) {
      console.log('Validation failed:', result.error)
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { name, description, icon, color } = result.data
    console.log('Validated data:', { name, description, icon, color })

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true })
    console.log('Generated slug:', slug)

    // Check if category already exists
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })
    console.log('Existing category check:', existingCategory)

    if (existingCategory) {
      console.log('Category already exists')
      return errorResponse('Category with this name already exists', 409)
    }

    // Create category
    const categoryData = {
      name,
      slug,
      description: description || null,
      icon: icon || null,
      color: color || null,
    }
    console.log('Creating category with data:', categoryData)
    
    const category = await db.category.create({
      data: categoryData
    })
    console.log('Created category:', category)

    return successResponse(category, 'Category created successfully', 201)

  } catch (error) {
    console.error('Create category error:', error)
    return errorResponse('Failed to create category', 500)
  }
} 
