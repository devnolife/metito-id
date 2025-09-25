import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'
import { join } from 'path'
import { existsSync } from 'fs'

// Ensure Node runtime for fs operations
export const runtime = 'nodejs'

// Reuse schema (mirip create) untuk update. Field opsional.
const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().min(1).optional(),
  category: z.string().optional(),
  projectType: z.enum(['INDUSTRIAL','MUNICIPAL','RESIDENTIAL','COMMERCIAL']).optional(),
  location: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  isFeatured: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await db.galleryItem.findUnique({ where: { id: params.id } })
    if (!item) return notFoundResponse('Gallery item not found')
    return successResponse(item)
  } catch (e) {
    console.error('GET gallery item error', e)
    return errorResponse('Failed to fetch gallery item', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    const body = await request.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return validationErrorResponse(result.error.flatten().fieldErrors)
    }
    const data = result.data
    const existing = await db.galleryItem.findUnique({ where: { id: params.id } })
    if (!existing) return notFoundResponse('Gallery item not found')
    const updated = await db.galleryItem.update({
      where: { id: params.id },
      data: {
        ...('title' in data ? { title: data.title } : {}),
        ...('description' in data ? { description: data.description } : {}),
        ...('image' in data ? { image: data.image } : {}),
        ...('category' in data ? { category: data.category } : {}),
        ...('projectType' in data ? { projectType: data.projectType } : {}),
        ...('location' in data ? { location: data.location } : {}),
        ...('completedAt' in data ? { completedAt: data.completedAt ? new Date(data.completedAt) : null } : {}),
        ...('isFeatured' in data ? { isFeatured: data.isFeatured } : {}),
      }
    })
    return successResponse(updated, 'Gallery item updated')
  } catch (e) {
    console.error('Update gallery item error', e)
    return errorResponse('Failed to update gallery item', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    const existing = await db.galleryItem.findUnique({ where: { id: params.id } })
    if (!existing) return notFoundResponse('Gallery item not found')

    const imagePath = existing.image // e.g. /images/gallery/xxxx.jpg

    await db.galleryItem.delete({ where: { id: params.id } })

    // Only attempt file removal if:
    // 1. Path starts with /images/gallery/
    // 2. No other gallery items reference the same image path
    if (imagePath && imagePath.startsWith('/images/gallery/')) {
      const countSame = await db.galleryItem.count({ where: { image: imagePath } })
      if (countSame === 0) {
        try {
          const fullPath = join(process.cwd(), 'public', imagePath.replace(/^\//, ''))
          if (existsSync(fullPath)) {
            const { unlink } = await import('fs/promises')
            await unlink(fullPath)
          }
        } catch (fileErr) {
          // Log but don't fail the request; record already gone
          console.warn('Failed to delete gallery image file', { imagePath, fileErr })
        }
      }
    }

    return successResponse({}, 'Gallery item deleted')
  } catch (e) {
    console.error('Delete gallery item error', e)
    return errorResponse('Failed to delete gallery item', 500)
  }
}
