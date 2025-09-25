import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import slugify from 'slugify'

// GET single service (optional helper for future use)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Service GET error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// PUT update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
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

    // Basic validation
    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: 'Name and description are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    let slug = existing.slug
    if (name !== existing.name) {
      slug = slugify(name, { lower: true, strict: true })
      const slugConflict = await prisma.service.findUnique({ where: { slug } })
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json({ success: false, message: 'Service name already in use' }, { status: 409 })
      }
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDesc,
        icon,
        features: Array.isArray(features) ? features : existing.features,
        pricing: pricing || {},
        isFeatured: isFeatured ?? existing.isFeatured,
        isActive: isActive ?? existing.isActive,
      }
    })

    return NextResponse.json({ success: true, data: updated, message: 'Service updated' })
  } catch (error) {
    console.error('Service PUT error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Service deleted' })
  } catch (error) {
    console.error('Service DELETE error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
