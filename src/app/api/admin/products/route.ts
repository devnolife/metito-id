import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status') // active, inactive, all
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    if (featured && featured !== 'all') {
      where.isFeatured = featured === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          productImages: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            take: 1
          }
        }
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      capacity,
      efficiency,
      location,
      application,
      specs,
      features,
      warranty,
      delivery,
      images,
      documents,
      categoryId,
      inStock,
      isFeatured,
      isActive,
      metaTitle,
      metaDescription
    } = body

    // Validate required fields
    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: parseFloat(price) || 0,
        capacity,
        efficiency,
        location,
        application,
        specs: specs || {},
        features: features || [],
        warranty,
        delivery,
        images: images || [],
        documents: documents || [],
        categoryId,
        inStock: inStock ?? true,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        metaTitle,
        metaDescription
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newProduct
    })

  } catch (error) {
    console.error('Product Create API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
