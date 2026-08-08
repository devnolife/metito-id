import { NextRequest } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { QuotationError, reviseQuotation } from '@/lib/quotation-service'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * POST /api/quotations/[id]/revise
 *
 * Membuat draft revisi dari penawaran yang sudah terbit. Revisi mewarisi nomor
 * induknya, sehingga counter tahunan tidak ikut naik.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const revision = await reviseQuotation(id)
    return successResponse(
      revision,
      `Draft revisi ke-${revision.revision} dibuat. Terbitkan bila sudah selesai.`,
      201
    )
  } catch (error) {
    if (error instanceof QuotationError) {
      return errorResponse(error.message, error.statusCode)
    }
    console.error('POST /api/quotations/[id]/revise failed:', error)
    return serverErrorResponse('Gagal membuat revisi.')
  }
}
