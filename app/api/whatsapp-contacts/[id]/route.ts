import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const updateContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  email: z.string().email('Invalid email').optional().nullable(),
  role: z.string().optional().nullable(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

// GET /api/whatsapp-contacts/[id] - Get single WhatsApp contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contact = await db.whatsAppContact.findUnique({
      where: { id }
    })

    if (!contact) {
      return errorResponse('WhatsApp contact not found', 404)
    }

    return successResponse(contact)

  } catch (error) {
    console.error('Get WhatsApp contact error:', error)
    return errorResponse('Failed to fetch WhatsApp contact', 500)
  }
}

// PUT /api/whatsapp-contacts/[id] - Update WhatsApp contact (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = updateContactSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Check if contact exists
    const existingContact = await db.whatsAppContact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return errorResponse('WhatsApp contact not found', 404)
    }

    // Update contact
    const contact = await db.whatsAppContact.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.color && { color: data.color }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      }
    })

    return successResponse(contact, 'WhatsApp Kontak berhasil diperbarui')

  } catch (error) {
    return errorResponse('Gagal memperbarui WhatsApp Kontak', 500)
  }
}

// DELETE /api/whatsapp-contacts/[id] - Delete WhatsApp contact (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if contact exists
    const existingContact = await db.whatsAppContact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return errorResponse('WhatsApp contact not found', 404)
    }

    // Delete contact
    await db.whatsAppContact.delete({
      where: { id }
    })

    return successResponse(null, 'WhatsApp contact deleted successfully')

  } catch (error) {
    console.error('Delete WhatsApp contact error:', error)
    return errorResponse('Failed to delete WhatsApp contact', 500)
  }
}
