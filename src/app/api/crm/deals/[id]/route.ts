import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { dealUpdateSchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = dealUpdateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    const existing = await db.crmDeal.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return notFoundResponse('Peluang tidak ditemukan.')

    const data: Prisma.CrmDealUpdateInput = {}
    if (input.title !== undefined) data.title = input.title
    if (input.division !== undefined) data.division = input.division ?? null
    if (input.estimatedValue !== undefined) {
      data.estimatedValue = new Prisma.Decimal(input.estimatedValue)
    }
    if (input.stage !== undefined) data.stage = input.stage
    if (input.probability !== undefined) data.probability = input.probability
    if (input.startDate !== undefined) data.startDate = input.startDate ?? null
    if (input.targetCloseDate !== undefined) data.targetCloseDate = input.targetCloseDate ?? null
    if (input.ownerName !== undefined) data.ownerName = input.ownerName ?? null
    if (input.notes !== undefined) data.notes = input.notes ?? null
    if (input.accountId !== undefined) data.account = { connect: { id: input.accountId } }
    if (input.quotationId !== undefined) {
      data.quotation = input.quotationId
        ? { connect: { id: input.quotationId } }
        : { disconnect: true }
    }

    const deal = await db.crmDeal.update({
      where: { id },
      data,
      include: { account: { select: { id: true, name: true } } },
    })

    return successResponse(deal, 'Peluang diperbarui.')
  } catch (error) {
    console.error('PATCH /api/crm/deals/[id] failed:', error)
    return serverErrorResponse('Gagal memperbarui peluang.')
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const existing = await db.crmDeal.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return notFoundResponse('Peluang tidak ditemukan.')

    await db.crmDeal.delete({ where: { id } })

    return successResponse({ id }, 'Peluang dihapus.')
  } catch (error) {
    console.error('DELETE /api/crm/deals/[id] failed:', error)
    return serverErrorResponse('Gagal menghapus peluang.')
  }
}
