import { NextRequest } from 'next/server'
import { QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'

/**
 * GET /api/quotations/stats?year=2026 — rekap nilai penawaran dan win rate.
 *
 * Win rate hanya dihitung dari penawaran yang sudah punya hasil (menang atau
 * kalah). Penawaran yang masih menunggu jawaban tidak ikut menurunkan angka,
 * sebab belum tentu kalah.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const yearParam = request.nextUrl.searchParams.get('year')
  const year = yearParam ? Number(yearParam) : new Date().getFullYear()

  if (!Number.isInteger(year)) {
    return serverErrorResponse('Tahun tidak valid.')
  }

  const range = {
    gte: new Date(year, 0, 1),
    lt: new Date(year + 1, 0, 1),
  }

  try {
    const [byStatus, issuedAggregate, expiringSoon] = await Promise.all([
      db.quotation.groupBy({
        by: ['status'],
        where: { quoteDate: range },
        _count: { _all: true },
        _sum: { total: true },
      }),
      db.quotation.aggregate({
        where: { quoteDate: range, status: { not: QuotationStatus.DRAFT } },
        _count: { _all: true },
        _sum: { total: true },
      }),
      db.quotation.count({
        where: {
          status: QuotationStatus.SENT,
          validUntil: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    const countOf = (status: QuotationStatus) =>
      byStatus.find((row) => row.status === status)?._count._all ?? 0

    const sumOf = (status: QuotationStatus) =>
      byStatus.find((row) => row.status === status)?._sum.total?.toFixed(0) ?? '0'

    const won = countOf(QuotationStatus.WON)
    const lost = countOf(QuotationStatus.LOST)
    const decided = won + lost

    return successResponse({
      year,
      counts: {
        draft: countOf(QuotationStatus.DRAFT),
        sent: countOf(QuotationStatus.SENT),
        won,
        lost,
        issued: issuedAggregate._count._all,
      },
      values: {
        issued: issuedAggregate._sum.total?.toFixed(0) ?? '0',
        won: sumOf(QuotationStatus.WON),
        lost: sumOf(QuotationStatus.LOST),
      },
      // null bila belum ada penawaran yang selesai, supaya tidak menampilkan 0%
      // yang menyesatkan di awal pemakaian.
      winRate: decided > 0 ? Math.round((won / decided) * 100) : null,
      expiringSoon,
    })
  } catch (error) {
    console.error('GET /api/quotations/stats failed:', error)
    return serverErrorResponse('Gagal memuat rekap penawaran.')
  }
}
