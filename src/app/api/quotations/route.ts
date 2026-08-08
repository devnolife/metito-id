import { NextRequest } from 'next/server'
import { Prisma, QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { quotationCreateSchema, quotationListQuerySchema, zodErrors } from '@/lib/quotation-schema'
import { computeTotals } from '@/lib/quotation-math'
import { terbilangRupiah } from '@/lib/terbilang'
import { displayStatus } from '@/lib/quotation-status'

/** GET /api/quotations — daftar penawaran, menggantikan sheet Log Penomoran. */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = quotationListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { search, status, year, page, limit } = parsed.data

  const where: Prisma.QuotationWhereInput = {}
  const and: Prisma.QuotationWhereInput[] = []

  if (search) {
    and.push({
      OR: [
        { numberBase: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ],
    })
  }

  // EXPIRED tidak disimpan di database; ia diturunkan dari validUntil, jadi
  // filternya diterjemahkan menjadi "SENT yang masa berlakunya sudah lewat".
  if (status === 'EXPIRED') {
    and.push({ status: QuotationStatus.SENT, validUntil: { lt: new Date() } })
  } else if (status === 'SENT') {
    and.push({
      status: QuotationStatus.SENT,
      OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
    })
  } else if (status) {
    and.push({ status: status as QuotationStatus })
  }

  if (year) {
    and.push({ quoteDate: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } })
  }

  if (and.length > 0) where.AND = and

  try {
    const [rows, total] = await Promise.all([
      db.quotation.findMany({
        where,
        orderBy: [{ issuedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      db.quotation.count({ where }),
    ])

    return successResponse({
      quotations: rows.map((row) => ({
        ...row,
        displayStatus: displayStatus(row.status, row.validUntil),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    console.error('GET /api/quotations failed:', error)
    return serverErrorResponse('Gagal memuat daftar penawaran.')
  }
}

/** POST /api/quotations — membuat draft baru. Draft belum memiliki nomor. */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success || !auth.user) return unauthorizedResponse(auth.message)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = quotationCreateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    // Total selalu dihitung di server; nilai kiriman klien tidak dipercaya.
    const totals = computeTotals(
      input.items.map((item) => ({ qty: item.qty, unitPrice: item.unitPrice })),
      input.vatRate
    )

    const quotation = await db.quotation.create({
      data: {
        status: QuotationStatus.DRAFT,
        customerName: input.customerName,
        attn: input.attn ?? null,
        subject: input.subject,
        quoteDate: input.quoteDate ?? new Date(),
        franco: input.franco ?? null,
        deliveryTime: input.deliveryTime ?? null,
        termsOfPayment: input.termsOfPayment ?? null,
        priceIncludeNote: input.priceIncludeNote ?? null,
        validityDays: input.validityDays,
        vatRate: new Prisma.Decimal(input.vatRate),
        notes: input.notes ?? null,
        subtotal: totals.subtotal,
        vatAmount: totals.vatAmount,
        total: totals.total,
        amountInWords: terbilangRupiah(totals.total.toFixed(0)),
        createdById: auth.user.id,
        items: {
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
        },
      },
      include: { items: { orderBy: { lineNo: 'asc' } } },
    })

    return successResponse(quotation, 'Draft penawaran dibuat.', 201)
  } catch (error) {
    console.error('POST /api/quotations failed:', error)
    return serverErrorResponse('Gagal membuat penawaran.')
  }
}
