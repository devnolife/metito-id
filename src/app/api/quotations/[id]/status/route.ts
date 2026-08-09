import { NextRequest } from 'next/server'
import { QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyInternalAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { quotationStatusSchema, zodErrors } from '@/lib/quotation-schema'
import { syncQuotationDeal } from '@/lib/quotation-deal'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * PATCH /api/quotations/[id]/status — menandai hasil akhir penawaran.
 *
 * Hanya dokumen yang sudah terbit yang punya hasil. Bila penawaran memiliki
 * revisi, hasil dicatat pada revisi terakhir; versi lama bersifat arsip.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyInternalAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = quotationStatusSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  try {
    const existing = await db.quotation.findUnique({
      where: { id },
      select: { status: true, revisions: { select: { id: true }, take: 1 } },
    })

    if (!existing) return notFoundResponse('Penawaran tidak ditemukan.')

    if (existing.status === QuotationStatus.DRAFT) {
      return errorResponse('Draft belum bisa ditandai menang atau kalah.', 409)
    }

    if (existing.revisions.length > 0) {
      return errorResponse(
        'Penawaran ini sudah digantikan revisi. Tandai hasilnya pada revisi terakhir.',
        409
      )
    }

    const quotation = await db.quotation.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    // Project di pipeline mengikuti hasil penawaran (menang → DEAL, kalah →
    // KALAH). Kegagalan sinkronisasi tidak membatalkan perubahan status.
    try {
      await syncQuotationDeal(quotation.id)
    } catch (error) {
      console.error('Gagal menyelaraskan project dengan status penawaran:', error)
    }

    return successResponse(quotation, 'Status penawaran diperbarui.')
  } catch (error) {
    console.error('PATCH /api/quotations/[id]/status failed:', error)
    return serverErrorResponse('Gagal memperbarui status.')
  }
}
