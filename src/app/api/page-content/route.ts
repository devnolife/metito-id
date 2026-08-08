import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const createPageContentSchema = z.object({
  page: z.string().min(1, 'Page is required'),
  section: z.string().min(1, 'Section is required'),
  key: z.string().min(1, 'Key is required'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/page-content - List page contents with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (page) where.page = page
    if (section) where.section = section
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const pageContents = await db.pageContent.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { order: 'asc' }
      ]
    })

    return successResponse(pageContents)

  } catch (error) {
    console.error('Get page contents error:', error)
    return errorResponse('Failed to fetch page contents', 500)
  }
}

// POST /api/page-content - Create new page content (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminEdge(request)
    if (!isAdmin) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createPageContentSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Check if combination already exists
    const existing = await db.pageContent.findUnique({
      where: {
        page_section_key: {
          page: data.page,
          section: data.section,
          key: data.key
        }
      }
    })

    if (existing) {
      return errorResponse('Page content with this combination already exists', 400)
    }

    // Create page content
    const pageContent = await db.pageContent.create({
      data: {
        page: data.page,
        section: data.section,
        key: data.key,
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

    return successResponse(pageContent, 'Page content created successfully', 201)

  } catch (error) {
    console.error('Create page content error:', error)
    return errorResponse('Failed to create page content', 500)
  }
}
