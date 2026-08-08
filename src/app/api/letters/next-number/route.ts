import { NextRequest } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { nextLetterNumberQuerySchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'
import { LetterError, peekNextLetterNumber } from '@/lib/letter-service'
import { isIssuedByAnotherModule } from '@/lib/letter-number'

/**
 * GET /api/letters/next-number — pratinjau nomor berikutnya untuk formulir.
 *
 * Pratinjau saja: nomor baru benar-benar diambil ketika surat disimpan, jadi
 * dua orang yang membuka formulir bersamaan tidak akan mendapat nomor kembar.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = nextLetterNumberQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { type, division, letterDate } = parsed.data

  if (isIssuedByAnotherModule(type)) {
    return errorResponse(
      'Nomor SPH diterbitkan dari modul Penawaran agar deretnya tidak bercabang.',
      409
    )
  }

  try {
    const preview = await peekNextLetterNumber(type, division ?? null, letterDate ?? new Date())
    return successResponse({ ...preview, preview: true })
  } catch (error) {
    if (error instanceof LetterError) {
      return errorResponse(error.message, error.statusCode)
    }
    console.error('GET /api/letters/next-number failed:', error)
    return serverErrorResponse('Gagal menghitung nomor berikutnya.')
  }
}
