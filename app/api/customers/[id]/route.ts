import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional().nullable(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  projectType: z.string().optional().nullable(),
  testimonial: z.string().optional().nullable(),
  rating: z.number().int().min(0).max(5).optional(),
  avatar: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  contactDate: z.string().datetime().optional().nullable(),
  projectValue: z.string().optional().nullable(),
  status: z.enum(['potential','active','completed']).optional(),
  isPublicTestimonial: z.boolean().optional(),
  featured: z.boolean().optional()
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await db.customer.findUnique({ where: { id: params.id } })
    if (!customer) return notFoundResponse('Customer not found')
    return successResponse(customer)
  } catch (e) {
    console.error('Get customer error', e)
    return errorResponse('Failed to fetch customer', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)
    const existing = await db.customer.findUnique({ where: { id: params.id } })
    if (!existing) return notFoundResponse('Customer not found')

    const data = parsed.data
    const updated = await db.customer.update({
      where: { id: params.id },
      data: {
        ...('name' in data ? { name: data.name! } : {}),
        ...('company' in data ? { company: data.company } : {}),
        ...('email' in data ? { email: data.email! } : {}),
        ...('phone' in data ? { phone: data.phone } : {}),
        ...('address' in data ? { address: data.address } : {}),
        ...('industry' in data ? { industry: data.industry } : {}),
        ...('projectType' in data ? { projectType: data.projectType } : {}),
        ...('testimonial' in data ? { testimonial: data.testimonial } : {}),
        ...('rating' in data ? { rating: data.rating! } : {}),
        ...('avatar' in data ? { avatar: data.avatar } : {}),
        ...('website' in data ? { website: data.website } : {}),
        ...('contactDate' in data ? { contactDate: data.contactDate ? new Date(data.contactDate) : null } : {}),
        ...('projectValue' in data ? { projectValue: data.projectValue } : {}),
        ...('status' in data ? { status: data.status! } : {}),
        ...('isPublicTestimonial' in data ? { isPublicTestimonial: data.isPublicTestimonial! } : {}),
        ...('featured' in data ? { featured: data.featured! } : {}),
      }
    })
    return successResponse(updated, 'Customer updated')
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return errorResponse('Email already exists', 409)
    }
    console.error('Update customer error', e)
    return errorResponse('Failed to update customer', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin(request))) return unauthorizedResponse('Admin access required')
    const existing = await db.customer.findUnique({ where: { id: params.id } })
    if (!existing) return notFoundResponse('Customer not found')
    await db.customer.delete({ where: { id: params.id } })
    return successResponse({}, 'Customer deleted')
  } catch (e) {
    console.error('Delete customer error', e)
    return errorResponse('Failed to delete customer', 500)
  }
}
