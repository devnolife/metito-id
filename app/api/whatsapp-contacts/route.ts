import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email').optional().nullable(),
  role: z.string().optional().nullable(),
  color: z.string().default('bg-green-600'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

// GET /api/whatsapp-contacts - Get all active WhatsApp contacts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = includeInactive ? {} : { isActive: true }

    const contacts = await db.whatsAppContact.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return successResponse(contacts)

  } catch (error) {
    console.error('Get WhatsApp contacts error:', error)
    return errorResponse('Failed to fetch WhatsApp contacts', 500)
  }
}

// POST /api/whatsapp-contacts - Create new WhatsApp contact (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = createContactSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Create contact
    const contact = await db.whatsAppContact.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        role: data.role || null,
        color: data.color,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }
    })

    return successResponse(contact, 'WhatsApp contact created successfully', 201)

  } catch (error) {
    console.error('Create WhatsApp contact error:', error)
    return errorResponse('Failed to create WhatsApp contact', 500)
  }
}
