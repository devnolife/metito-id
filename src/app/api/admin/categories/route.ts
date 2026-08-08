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
    const status = searchParams.get('status') // active, inactive, all
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch categories
    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Categories API Error:', error)
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
    const { name, slug, description, icon, color, isActive } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: newCategory
    })

  } catch (error) {
    console.error('Category Create API Error:', error)
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
