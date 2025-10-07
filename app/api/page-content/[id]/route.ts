import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response'

const updatePageContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/page-content/[id] - Get single page content
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageContent = await db.pageContent.findUnique({
      where: { id: params.id }
    })

    if (!pageContent) {
      return notFoundResponse('Page content not found')
    }

    return successResponse(pageContent)

  } catch (error) {
    console.error('Get page content error:', error)
    return errorResponse('Failed to fetch page content', 500)
  }
}

// PUT /api/page-content/[id] - Update page content (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await isAdminEdge(request)
    if (!isAdmin) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if page content exists
    const existing = await db.pageContent.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return notFoundResponse('Page content not found')
    }

    const body = await request.json()

    // Validate input
    const result = updatePageContentSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Update page content
    const pageContent = await db.pageContent.update({
      where: { id: params.id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        link: data.link,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
      }
    })

    return successResponse(pageContent, 'Page content updated successfully')

  } catch (error) {
    console.error('Update page content error:', error)
    return errorResponse('Failed to update page content', 500)
  }
}

// DELETE /api/page-content/[id] - Delete page content (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await isAdminEdge(request)
    if (!isAdmin) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if page content exists
    const existing = await db.pageContent.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return notFoundResponse('Page content not found')
    }

    // Delete page content
    await db.pageContent.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Page content deleted successfully')

  } catch (error) {
    console.error('Delete page content error:', error)
    return errorResponse('Failed to delete page content', 500)
  }
}
