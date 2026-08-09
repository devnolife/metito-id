import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyActivityAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { activityUpdateSchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyActivityAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = activityUpdateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  try {
    const existing = await db.crmActivity.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return notFoundResponse('Aktivitas tidak ditemukan.')

    const activity = await db.crmActivity.update({
      where: { id },
      data: parsed.data,
      include: { account: { select: { id: true, name: true } } },
    })

    return successResponse(activity, 'Aktivitas diperbarui.')
  } catch (error) {
    console.error('PATCH /api/crm/activities/[id] failed:', error)
    return serverErrorResponse('Gagal memperbarui aktivitas.')
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyActivityAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const existing = await db.crmActivity.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return notFoundResponse('Aktivitas tidak ditemukan.')

    await db.crmActivity.delete({ where: { id } })

    return successResponse({ id }, 'Aktivitas dihapus.')
  } catch (error) {
    console.error('DELETE /api/crm/activities/[id] failed:', error)
    return serverErrorResponse('Gagal menghapus aktivitas.')
  }
}
