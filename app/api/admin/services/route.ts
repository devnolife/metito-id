import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import slugify from 'slugify'

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
    const status = searchParams.get('status') // active, inactive, all
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

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

    // Fetch services with pagination
    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        services,
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
    console.error('Services API Error:', error)
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
      description,
      shortDesc,
      icon,
      features,
      pricing,
      isFeatured,
      isActive
    } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true })

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    })

    if (existingService) {
      return NextResponse.json(
        { success: false, message: 'Service with this name already exists' },
        { status: 400 }
      )
    }

    // Create new service
    const newService = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        icon,
        features: features || [],
        pricing: pricing || {},
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: newService
    })

  } catch (error) {
    console.error('Service Create API Error:', error)
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
