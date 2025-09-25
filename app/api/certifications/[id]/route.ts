import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  issuer: z.string().min(2).optional(),
  certificate: z.string().optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  certificateNumber: z.string().optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional().or(z.literal('')),
  category: z.string().optional(),
  level: z.string().optional(),
  status: z.enum(['active','expired','pending']).optional(),
  isActive: z.boolean().optional()
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cert = await db.certification.findUnique({ where: { id: params.id } })
    if (!cert) return notFoundResponse('Certification not found')
    return successResponse(cert)
  } catch (e) {
    console.error('Get certification error', e)
    return errorResponse('Failed to fetch certification', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)

    const { issuedAt, expiresAt, status, ...rest } = parsed.data

    // derive status when not explicitly provided
    let finalStatus = status
    if (!finalStatus) {
      if (expiresAt) {
        const expDate = new Date(expiresAt)
        finalStatus = expDate < new Date() ? 'expired' : 'active'
      } else if (expiresAt === null) {
        finalStatus = 'active'
      }
    }
    const updated = await db.certification.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(finalStatus ? { status: finalStatus } : {}),
        ...(issuedAt ? { issuedAt: new Date(issuedAt) } : {}),
        ...(expiresAt === null ? { expiresAt: null } : (expiresAt ? { expiresAt: new Date(expiresAt) } : {}))
      }
    })
    return successResponse(updated, 'Certification updated')
  } catch (e: any) {
    if (e.code === 'P2025') return notFoundResponse('Certification not found')
    console.error('Update certification error', e)
    return errorResponse('Failed to update certification', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    await db.certification.delete({ where: { id: params.id } })
    return successResponse({ id: params.id }, 'Certification deleted')
  } catch (e: any) {
    if (e.code === 'P2025') return notFoundResponse('Certification not found')
    console.error('Delete certification error', e)
    return errorResponse('Failed to delete certification', 500)
  }
}
