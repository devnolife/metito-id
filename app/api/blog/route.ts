import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const createBlogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  authorName: z.string().min(2, 'Author name is required'),
  authorEmail: z.string().email().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// GET /api/blog - List blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')

    // Build where clause
    const where: any = {
      isPublished: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      }
    }

    // Get blog posts
    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        include: {
          tags: {
            select: { id: true, name: true, slug: true, color: true }
          },
          _count: {
            select: { comments: true }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      db.blogPost.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      posts,
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
    console.error('Get blog posts error:', error)
    return errorResponse('Failed to fetch blog posts', 500)
  }
}

// POST /api/blog - Create new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createBlogPostSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { tags, ...data } = result.data

    // Generate slug
    const slug = slugify(data.title, { lower: true, strict: true })

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return errorResponse('Blog post with this title already exists', 409)
    }

    // Handle tags
    const tagConnections = []
    for (const tagName of tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true })

      // Create tag if it doesn't exist
      const tag = await db.blogTag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: {
          name: tagName,
          slug: tagSlug,
        }
      })

      tagConnections.push({ id: tag.id })
    }

    // Create blog post
    const post = await db.blogPost.create({
      data: {
        ...data,
        slug,
        tags: {
          connect: tagConnections
        }
      },
      include: {
        tags: {
          select: { id: true, name: true, slug: true, color: true }
        }
      }
    })

    return successResponse(post, 'Blog post created successfully', 201)

  } catch (error) {
    console.error('Create blog post error:', error)
    return errorResponse('Failed to create blog post', 500)
  }
} 
