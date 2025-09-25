import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const updateSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(50).optional(),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  authorName: z.string().min(2).optional(),
  authorEmail: z.string().email().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  tags: z.array(z.string()).optional()
})

// GET /api/blog/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await db.blogPost.findUnique({
      where: { id: params.id },
      include: { tags: { select: { id: true, name: true, slug: true, color: true } } }
    })

    if (!post) return errorResponse('Blog post not found', 404)

    return successResponse(post)
  } catch (error) {
    console.error('Get blog post error:', error)
    return errorResponse('Failed to fetch blog post', 500)
  }
}

// PUT /api/blog/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return validationErrorResponse(result.error.flatten().fieldErrors)
    }

    const { tags, title, ...data } = result.data

    // Regenerate slug if title changes
    let slug: string | undefined
    if (title) {
      slug = slugify(title, { lower: true, strict: true })
      const existing = await db.blogPost.findFirst({ where: { slug, NOT: { id: params.id } } })
      if (existing) return errorResponse('Another post with this title exists', 409)
    }

    // Tag handling
    let tagConnectOrSet: { id: string }[] | undefined
    if (tags) {
      tagConnectOrSet = []
      for (const tagName of tags) {
        const tagSlug = slugify(tagName, { lower: true, strict: true })
        const tag = await db.blogTag.upsert({
          where: { slug: tagSlug },
            update: {},
            create: { name: tagName, slug: tagSlug }
        })
        tagConnectOrSet.push({ id: tag.id })
      }
    }

    const post = await db.blogPost.update({
      where: { id: params.id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...data,
        ...(tagConnectOrSet ? { tags: { set: tagConnectOrSet } } : {})
      },
      include: { tags: { select: { id: true, name: true, slug: true, color: true } } }
    })

    return successResponse(post, 'Blog post updated successfully')
  } catch (error) {
    console.error('Update blog post error:', error)
    return errorResponse('Failed to update blog post', 500)
  }
}

// DELETE /api/blog/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    await db.blogPost.delete({ where: { id: params.id } })
    return successResponse(null, 'Blog post deleted successfully')
  } catch (error) {
    console.error('Delete blog post error:', error)
    return errorResponse('Failed to delete blog post', 500)
  }
}
