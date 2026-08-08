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
import { letterUpdateSchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const letter = await db.letter.findUnique({
      where: { id },
      include: {
        account: { select: { id: true, name: true } },
        quotation: { select: { id: true, numberBase: true, status: true } },
        createdBy: { select: { id: true, name: true } },
      },
    })

    if (!letter) return notFoundResponse('Surat tidak ditemukan.')

    return successResponse(letter)
  } catch (error) {
    console.error('GET /api/letters/[id] failed:', error)
    return serverErrorResponse('Gagal memuat surat.')
  }
}

/**
 * PATCH /api/letters/[id] — memperbarui keterangan surat.
 *
 * Nomor, urutan, jenis, dan divisi tidak dapat diubah: mengubahnya berarti
 * membuat surat lain yang memakai identitas surat yang sudah beredar.
 */
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

  const parsed = letterUpdateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  try {
    const existing = await db.letter.findUnique({
      where: { id },
      select: { id: true, quotationId: true },
    })
    if (!existing) return notFoundResponse('Surat tidak ditemukan.')

    // Baris SPH adalah cerminan penawaran; perihal dan penerimanya mengikuti
    // dokumen aslinya agar register tidak berbeda dari surat yang dikirim.
    if (existing.quotationId) {
      const { status, notes, accountId } = parsed.data
      const letter = await db.letter.update({
        where: { id },
        data: {
          ...(status !== undefined ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(accountId !== undefined ? { accountId: accountId || null } : {}),
        },
      })
      return successResponse(letter, 'Surat diperbarui. Isi SPH mengikuti dokumen penawaran.')
    }

    const letter = await db.letter.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.accountId !== undefined
          ? { accountId: parsed.data.accountId || null }
          : {}),
      },
    })

    return successResponse(letter, 'Surat diperbarui.')
  } catch (error) {
    console.error('PATCH /api/letters/[id] failed:', error)
    return serverErrorResponse('Gagal memperbarui surat.')
  }
}
