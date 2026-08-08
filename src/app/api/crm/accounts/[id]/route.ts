import { NextRequest } from 'next/server'
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
import { accountUpdateSchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const account = await db.crmAccount.findUnique({
      where: { id },
      include: {
        deals: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { occurredAt: 'desc' }, take: 20 },
        letters: { orderBy: { letterDate: 'desc' }, take: 20 },
      },
    })

    if (!account) return notFoundResponse('Pelanggan tidak ditemukan.')

    return successResponse(account)
  } catch (error) {
    console.error('GET /api/crm/accounts/[id] failed:', error)
    return serverErrorResponse('Gagal memuat pelanggan.')
  }
}

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

  const parsed = accountUpdateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  try {
    const existing = await db.crmAccount.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return notFoundResponse('Pelanggan tidak ditemukan.')

    const account = await db.crmAccount.update({ where: { id }, data: parsed.data })

    return successResponse(account, 'Pelanggan diperbarui.')
  } catch (error) {
    console.error('PATCH /api/crm/accounts/[id] failed:', error)
    return serverErrorResponse('Gagal memperbarui pelanggan.')
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const existing = await db.crmAccount.findUnique({
      where: { id },
      select: { _count: { select: { letters: true } } },
    })
    if (!existing) return notFoundResponse('Pelanggan tidak ditemukan.')

    // Surat yang sudah terbit adalah dokumen resmi; pelanggannya tidak boleh
    // ikut hilang begitu saja. Peluang dan aktivitas ikut terhapus lewat relasi
    // karena keduanya hanya bermakna bersama pelanggannya.
    if (existing._count.letters > 0) {
      return errorResponse(
        'Pelanggan ini memiliki surat terbit. Ubah statusnya menjadi Tidak Aktif alih-alih menghapus.',
        409
      )
    }

    await db.crmAccount.delete({ where: { id } })

    return successResponse({ id }, 'Pelanggan dihapus.')
  } catch (error) {
    console.error('DELETE /api/crm/accounts/[id] failed:', error)
    return serverErrorResponse('Gagal menghapus pelanggan.')
  }
}
