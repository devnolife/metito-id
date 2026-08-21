import { NextRequest, NextResponse } from 'next/server'
import slugify from 'slugify'

import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'

const sanitizeFeatures = (features: unknown): string[] => {
  if (!Array.isArray(features)) {
    return []
  }

  return features
    .map((feature) => {
      if (typeof feature === 'string') {
        return feature.trim()
      }

      return String(feature).trim()
    })
    .filter((feature) => feature.length > 0)
}

const normalizePricing = (pricing: unknown, fallback: unknown) => {
  if (pricing && typeof pricing === 'object') {
    return pricing as Record<string, unknown>
  }

  if (fallback && typeof fallback === 'object') {
    return fallback as Record<string, unknown>
  }

  return {}
}

export async function GET(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId } = params
    if (!serviceId) {
      return NextResponse.json({ success: false, message: 'Service id is required' }, { status: 400 })
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } })

    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Service detail API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId } = params
    if (!serviceId) {
      return NextResponse.json({ success: false, message: 'Service id is required' }, { status: 400 })
    }

    const existingService = await prisma.service.findUnique({ where: { id: serviceId } })

    if (!existingService) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Name and description are required' }, { status: 400 })
    }

    const shortDesc = typeof body.shortDesc === 'string' ? body.shortDesc.trim() : ''
    const icon = typeof body.icon === 'string' ? body.icon.trim() : ''
    const features = sanitizeFeatures(body.features)
    const pricing = normalizePricing(body.pricing, existingService.pricing)
    const isFeatured = typeof body.isFeatured === 'boolean' ? body.isFeatured : existingService.isFeatured
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : existingService.isActive

    let slug = existingService.slug
    if (name !== existingService.name) {
      const newSlug = slugify(name, { lower: true, strict: true })
      const existingSlug = await prisma.service.findUnique({ where: { slug: newSlug } })
      if (existingSlug && existingSlug.id !== serviceId) {
        return NextResponse.json({ success: false, message: 'Service with this name already exists' }, { status: 400 })
      }
      slug = newSlug
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        slug,
        description,
        shortDesc,
        icon,
        features,
        pricing,
        isFeatured,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: updatedService })
  } catch (error) {
    console.error('Service update API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId } = params
    if (!serviceId) {
      return NextResponse.json({ success: false, message: 'Service id is required' }, { status: 400 })
    }

    await prisma.service.delete({ where: { id: serviceId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Service delete API error:', error)

    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
