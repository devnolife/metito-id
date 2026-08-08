import { NextRequest } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { QuotationError, issueQuotation } from '@/lib/quotation-service'
import { getQuotationSettings } from '@/lib/quotation-settings'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * POST /api/quotations/[id]/issue
 *
 * Menerbitkan penawaran dan mengambil nomor resmi. Validasi berjalan sebelum
 * nomor diambil sehingga dokumen yang gagal terbit tidak membakar nomor urut.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const settings = await getQuotationSettings()

    const quotation = await issueQuotation(id, {
      docCode: settings.docCode,
      companyCode: settings.companyCode,
    })

    return successResponse(quotation, `Penawaran diterbitkan dengan nomor ${quotation.numberBase}.`)
  } catch (error) {
    if (error instanceof QuotationError) {
      return errorResponse(error.message, error.statusCode)
    }
    console.error('POST /api/quotations/[id]/issue failed:', error)
    return serverErrorResponse('Gagal menerbitkan penawaran.')
  }
}
