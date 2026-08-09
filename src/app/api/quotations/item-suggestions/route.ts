import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyInternalAuth } from '@/lib/admin-auth'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'

/**
 * GET /api/quotations/item-suggestions?q=kable
 *
 * Menggantikan master barang. Tidak ada tabel master: saran diambil dari item
 * yang pernah dipakai di penawaran sebelumnya, lengkap dengan brand, type,
 * satuan, dan harga terakhir. Dengan begitu sales tidak perlu menyiapkan data
 * apa pun sebelum mulai memakai aplikasi.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyInternalAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  try {
    const rows = await db.quotationItem.findMany({
      where: q
        ? {
            OR: [
              { materialCode: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } },
              { type: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { quotation: { createdAt: 'desc' } },
      take: 200,
      select: {
        materialCode: true,
        brand: true,
        type: true,
        unit: true,
        unitPrice: true,
        quotation: { select: { createdAt: true } },
      },
    })

    // Satu saran per kombinasi material + brand + type, memakai harga terbaru.
    const seen = new Map<string, (typeof rows)[number]>()
    for (const row of rows) {
      const key = `${row.materialCode.toLowerCase()}|${(row.brand ?? '').toLowerCase()}|${(row.type ?? '').toLowerCase()}`
      if (!seen.has(key)) seen.set(key, row)
    }

    const suggestions = Array.from(seen.values())
      .slice(0, 20)
      .map((row) => ({
        materialCode: row.materialCode,
        brand: row.brand,
        type: row.type,
        unit: row.unit,
        lastUnitPrice: row.unitPrice,
        lastUsedAt: row.quotation.createdAt,
      }))

    return successResponse(suggestions)
  } catch (error) {
    console.error('GET /api/quotations/item-suggestions failed:', error)
    return serverErrorResponse('Gagal memuat saran item.')
  }
}
