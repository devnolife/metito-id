import { NextRequest } from 'next/server'
import { Prisma, QuotationStatus } from '@prisma/client'
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
import { quotationUpdateSchema, zodErrors } from '@/lib/quotation-schema'
import { computeTotals } from '@/lib/quotation-math'
import { terbilangRupiah } from '@/lib/terbilang'
import { displayStatus, isEditable } from '@/lib/quotation-status'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        items: { orderBy: { lineNo: 'asc' } },
        createdBy: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, numberBase: true, revision: true } },
        revisions: {
          select: { id: true, revision: true, status: true, issuedAt: true },
          orderBy: { revision: 'asc' },
        },
      },
    })

    if (!quotation) return notFoundResponse('Penawaran tidak ditemukan.')

    return successResponse({
      ...quotation,
      displayStatus: displayStatus(quotation.status, quotation.validUntil),
      editable: isEditable(quotation.status),
    })
  } catch (error) {
    console.error('GET /api/quotations/[id] failed:', error)
    return serverErrorResponse('Gagal memuat penawaran.')
  }
}

/**
 * PATCH — hanya draft yang boleh diubah.
 *
 * Dokumen yang sudah diterbitkan bersifat read-only agar surat yang sudah
 * berada di tangan pelanggan tidak dapat berubah diam-diam. Satu-satunya jalan
 * mengubahnya adalah membuat revisi.
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

  const parsed = quotationUpdateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    const existing = await db.quotation.findUnique({
      where: { id },
      select: { status: true, vatRate: true },
    })

    if (!existing) return notFoundResponse('Penawaran tidak ditemukan.')

    if (!isEditable(existing.status)) {
      return errorResponse(
        'Penawaran ini sudah diterbitkan dan tidak dapat diubah. Buat revisi untuk mengubahnya.',
        409
      )
    }

    const vatRate = input.vatRate ? new Prisma.Decimal(input.vatRate) : existing.vatRate

    const data: Prisma.QuotationUpdateInput = {
      ...(input.customerName !== undefined && { customerName: input.customerName }),
      ...(input.attn !== undefined && { attn: input.attn ?? null }),
      ...(input.subject !== undefined && { subject: input.subject }),
      ...(input.quoteDate !== undefined && { quoteDate: input.quoteDate }),
      ...(input.franco !== undefined && { franco: input.franco ?? null }),
      ...(input.deliveryTime !== undefined && { deliveryTime: input.deliveryTime ?? null }),
      ...(input.termsOfPayment !== undefined && { termsOfPayment: input.termsOfPayment ?? null }),
      ...(input.priceIncludeNote !== undefined && {
        priceIncludeNote: input.priceIncludeNote ?? null,
      }),
      ...(input.validityDays !== undefined && { validityDays: input.validityDays }),
      ...(input.notes !== undefined && { notes: input.notes ?? null }),
      vatRate,
    }

    // Item dikirim utuh; baris lama diganti agar penomoran baris selalu rapat.
    if (input.items) {
      const totals = computeTotals(
        input.items.map((item) => ({ qty: item.qty, unitPrice: item.unitPrice })),
        vatRate
      )

      data.subtotal = totals.subtotal
      data.vatAmount = totals.vatAmount
      data.total = totals.total
      data.amountInWords = terbilangRupiah(totals.total.toFixed(0))
      data.items = {
        deleteMany: {},
        create: input.items.map((item, index) => ({
          lineNo: index + 1,
          materialCode: item.materialCode,
          brand: item.brand ?? null,
          type: item.type ?? null,
          qty: new Prisma.Decimal(item.qty),
          unit: item.unit,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          lineTotal: totals.lineTotals[index],
        })),
      }
    }

    const quotation = await db.quotation.update({
      where: { id },
      data,
      include: { items: { orderBy: { lineNo: 'asc' } } },
    })

    return successResponse(quotation, 'Penawaran diperbarui.')
  } catch (error) {
    console.error('PATCH /api/quotations/[id] failed:', error)
    return serverErrorResponse('Gagal memperbarui penawaran.')
  }
}

/** DELETE — hanya draft. Dokumen terbit disimpan sebagai arsip. */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const { id } = await params

  try {
    const existing = await db.quotation.findUnique({
      where: { id },
      select: { status: true },
    })

    if (!existing) return notFoundResponse('Penawaran tidak ditemukan.')

    if (existing.status !== QuotationStatus.DRAFT) {
      return errorResponse(
        'Penawaran yang sudah diterbitkan tidak dapat dihapus karena nomornya sudah beredar.',
        409
      )
    }

    await db.quotation.delete({ where: { id } })
    return successResponse({ id }, 'Draft dihapus.')
  } catch (error) {
    console.error('DELETE /api/quotations/[id] failed:', error)
    return serverErrorResponse('Gagal menghapus penawaran.')
  }
}
