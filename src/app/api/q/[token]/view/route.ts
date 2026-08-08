import { NextRequest } from 'next/server'
import { QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { successResponse } from '@/lib/api-response'

type RouteContext = { params: Promise<{ token: string }> }

/**
 * POST /api/q/[token]/view — mencatat bahwa pelanggan membuka penawaran.
 *
 * Route publik tanpa autentikasi, dipanggil sekali dari halaman publik.
 * Sengaja tidak dilakukan saat render halaman agar tidak ada mutasi di dalam
 * proses render, dan agar prefetch tidak menghitung kunjungan palsu.
 *
 * Selalu membalas sukses: kegagalan mencatat kunjungan tidak boleh membuat
 * pelanggan gagal membaca penawarannya.
 */
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { token } = await params

  try {
    const quotation = await db.quotation.findUnique({
      where: { publicToken: token },
      select: { id: true, status: true, firstViewedAt: true },
    })

    if (!quotation || quotation.status === QuotationStatus.DRAFT) {
      return successResponse({ recorded: false })
    }

    await db.quotation.update({
      where: { id: quotation.id },
      data: {
        viewCount: { increment: 1 },
        ...(quotation.firstViewedAt ? {} : { firstViewedAt: new Date() }),
      },
    })

    return successResponse({ recorded: true })
  } catch (error) {
    // Kegagalan mencatat kunjungan tidak boleh terlihat oleh pelanggan, dan
    // tidak boleh menghalangi mereka membaca penawarannya.
    console.error('POST /api/q/[token]/view failed:', error)
    return successResponse({ recorded: false })
  }
}
