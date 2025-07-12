import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  capacity: z.string().optional(),
  efficiency: z.string().optional(),
  location: z.string().optional(),
  application: z.enum(['Industrial', 'Municipal']).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  specs: z.record(z.any()).optional(),
  features: z.array(z.string()).default([]),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  images: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  categoryId: z.string().min(1, 'Category is required'),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const application = searchParams.get('application')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const featured = searchParams.get('featured')

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (application) {
      where.application = application
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (inStock === 'true') {
      where.inStock = true
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Get products
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      db.product.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      products,
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
    console.error('Get products error:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdminEdge(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()
    console.log('Received product data:', body)

    // Validate input
    const result = createProductSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      console.error('Validation errors:', errors)
      return validationErrorResponse(errors)
    }

    const data = result.data
    console.log('Validated data:', data)

    // Generate slug
    const slug = slugify(data.name, { lower: true, strict: true })

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return errorResponse('Product with this name already exists', 409)
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    // Create product
    const product = await db.product.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    return successResponse(product, 'Product created successfully', 201)

  } catch (error) {
    console.error('Create product error:', error)
    return errorResponse('Failed to create product', 500)
  }
} 
