import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'

// GET /api/admin/products - List all products for admin (including inactive)
export async function GET(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdminEdge(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50') // Higher limit for admin
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const application = searchParams.get('application')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active') // Admin can filter by active/inactive

    // Build where clause (no default isActive filter for admin)
    const where: any = {}

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
    } else if (inStock === 'false') {
      where.inStock = false
    }

    if (featured === 'true') {
      where.isFeatured = true
    } else if (featured === 'false') {
      where.isFeatured = false
    }

    if (active === 'true') {
      where.isActive = true
    } else if (active === 'false') {
      where.isActive = false
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
    console.error('Get admin products error:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}
