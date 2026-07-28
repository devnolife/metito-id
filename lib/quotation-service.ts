import { randomBytes } from 'crypto'
import { Prisma, QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { computeTotals } from '@/lib/quotation-math'
import { terbilangRupiah } from '@/lib/terbilang'
import {
  DEFAULT_COMPANY_CODE,
  DEFAULT_DOC_CODE,
  counterYear,
  formatQuotationNumber,
} from '@/lib/quotation-number'

/** Kesalahan yang aman ditampilkan ke pengguna, lengkap dengan kode HTTP. */
export class QuotationError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'QuotationError'
  }
}

const PRISMA_UNIQUE_VIOLATION = 'P2002'
const MAX_ALLOCATION_ATTEMPTS = 5

type TxClient = Prisma.TransactionClient

/**
 * Mengambil satu nomor urut untuk tahun tertentu.
 *
 * Menaikkan `lastSeq` di dalam satu pernyataan, sehingga dua permintaan yang
 * bersamaan tidak mungkin memperoleh nomor sama. Jalur `create` dapat bertabrakan
 * saat dua pengguna menerbitkan dokumen pertama pada tahun yang sama, dan hal itu
 * ditangani oleh percobaan ulang di `issueQuotation`.
 */
export async function allocateSeq(tx: TxClient, year: number): Promise<number> {
  const counter = await tx.quotationCounter.upsert({
    where: { year },
    create: { year, lastSeq: 1 },
    update: { lastSeq: { increment: 1 } },
    select: { lastSeq: true },
  })

  return counter.lastSeq
}

/** Token tautan publik. Acak kriptografis agar tidak dapat ditebak. */
export function generatePublicToken(): string {
  return randomBytes(24).toString('base64url')
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function isRetryableAllocationError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === PRISMA_UNIQUE_VIOLATION
  )
}

export interface IssueOptions {
  docCode?: string
  companyCode?: string
  /** Dapat diisi untuk pengujian; secara baku memakai waktu sekarang. */
  issuedAt?: Date
}

/**
 * Menerbitkan penawaran: memvalidasi, menghitung ulang seluruh nilai, lalu
 * mengambil nomor resmi.
 *
 * Validasi sengaja dijalankan sebelum nomor diambil agar dokumen yang gagal
 * terbit tidak membakar nomor urut.
 */
export async function issueQuotation(quotationId: string, options: IssueOptions = {}) {
  const quotation = await db.quotation.findUnique({
    where: { id: quotationId },
    include: { items: { orderBy: { lineNo: 'asc' } } },
  })

  if (!quotation) {
    throw new QuotationError('Penawaran tidak ditemukan.', 404)
  }

  if (quotation.status !== QuotationStatus.DRAFT) {
    throw new QuotationError('Penawaran ini sudah diterbitkan. Buat revisi untuk mengubahnya.', 409)
  }

  if (quotation.items.length === 0) {
    throw new QuotationError('Penawaran harus memiliki minimal satu item.')
  }

  if (!quotation.customerName.trim()) {
    throw new QuotationError('Nama pelanggan wajib diisi.')
  }

  if (!quotation.subject.trim()) {
    throw new QuotationError('Perihal wajib diisi.')
  }

  for (const item of quotation.items) {
    if (!item.materialCode.trim()) {
      throw new QuotationError(`Item baris ${item.lineNo} belum memiliki kode material.`)
    }
    if (item.qty.lessThanOrEqualTo(0)) {
      throw new QuotationError(`Qty item baris ${item.lineNo} harus lebih dari nol.`)
    }
  }

  // Nilai dihitung ulang dari item, tidak pernah mempercayai kiriman klien.
  const totals = computeTotals(
    quotation.items.map((item) => ({ qty: item.qty, unitPrice: item.unitPrice })),
    quotation.vatRate
  )

  const issuedAt = options.issuedAt ?? new Date()
  const year = counterYear(issuedAt)
  const docCode = options.docCode ?? DEFAULT_DOC_CODE
  const companyCode = options.companyCode ?? DEFAULT_COMPANY_CODE

  const buildData = (seq: number, numberBase: string) =>
    ({
      status: QuotationStatus.SENT,
      seq,
      numberBase,
      issuedAt,
      validUntil: addDays(issuedAt, quotation.validityDays),
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      total: totals.total,
      amountInWords: terbilangRupiah(totals.total.toFixed(0)),
      publicToken: quotation.publicToken ?? generatePublicToken(),
      items: {
        update: quotation.items.map((item, index) => ({
          where: { id: item.id },
          data: { lineTotal: totals.lineTotals[index] },
        })),
      },
    }) satisfies Prisma.QuotationUpdateInput

  // Revisi mewarisi nomor induknya. Counter tahunan tidak boleh naik, sebab
  // Rev.1 bukan penawaran baru melainkan versi lain dari surat yang sama.
  if (quotation.revision > 0 && quotation.parentId) {
    const parent = await db.quotation.findUnique({
      where: { id: quotation.parentId },
      select: { seq: true, numberBase: true },
    })

    if (!parent?.numberBase || parent.seq === null) {
      throw new QuotationError('Penawaran induk belum memiliki nomor resmi.', 409)
    }

    return db.quotation.update({
      where: { id: quotationId },
      data: buildData(parent.seq, parent.numberBase),
      include: { items: { orderBy: { lineNo: 'asc' } } },
    })
  }

  for (let attempt = 1; attempt <= MAX_ALLOCATION_ATTEMPTS; attempt += 1) {
    try {
      return await db.$transaction(async (tx) => {
        const seq = await allocateSeq(tx, year)
        const numberBase = formatQuotationNumber({ seq, issuedAt, docCode, companyCode })

        return tx.quotation.update({
          where: { id: quotationId },
          data: buildData(seq, numberBase),
          include: { items: { orderBy: { lineNo: 'asc' } } },
        })
      })
    } catch (error) {
      if (isRetryableAllocationError(error) && attempt < MAX_ALLOCATION_ATTEMPTS) {
        continue
      }
      throw error
    }
  }

  throw new QuotationError(
    'Gagal mengambil nomor surat karena permintaan bersamaan. Silakan coba lagi.',
    503
  )
}

/**
 * Membuat revisi dari penawaran yang sudah terbit.
 *
 * Revisi mewarisi nomor dasar induknya dan hanya menaikkan penanda revisi,
 * sehingga counter tahunan tidak ikut naik. Token publik induk dimatikan agar
 * pelanggan tidak membuka versi yang sudah usang.
 */
export async function reviseQuotation(quotationId: string) {
  const source = await db.quotation.findUnique({
    where: { id: quotationId },
    include: { items: { orderBy: { lineNo: 'asc' } } },
  })

  if (!source) {
    throw new QuotationError('Penawaran tidak ditemukan.', 404)
  }

  if (source.status === QuotationStatus.DRAFT || !source.numberBase) {
    throw new QuotationError('Hanya penawaran yang sudah diterbitkan yang dapat direvisi.', 409)
  }

  const rootId = source.parentId ?? source.id

  const latestRevision = await db.quotation.findFirst({
    where: { OR: [{ id: rootId }, { parentId: rootId }] },
    orderBy: { revision: 'desc' },
    select: { revision: true },
  })

  const nextRevision = (latestRevision?.revision ?? source.revision) + 1

  return db.$transaction(async (tx) => {
    // Tautan lama dimatikan supaya pelanggan tidak melihat versi usang.
    await tx.quotation.update({
      where: { id: source.id },
      data: { publicToken: null },
    })

    return tx.quotation.create({
      data: {
        status: QuotationStatus.DRAFT,
        seq: source.seq,
        numberBase: null, // diisi saat revisi diterbitkan
        revision: nextRevision,
        parentId: rootId,
        quoteDate: new Date(),
        customerName: source.customerName,
        attn: source.attn,
        subject: source.subject,
        franco: source.franco,
        deliveryTime: source.deliveryTime,
        termsOfPayment: source.termsOfPayment,
        priceIncludeNote: source.priceIncludeNote,
        validityDays: source.validityDays,
        vatRate: source.vatRate,
        notes: source.notes,
        createdById: source.createdById,
        items: {
          create: source.items.map((item) => ({
            lineNo: item.lineNo,
            materialCode: item.materialCode,
            brand: item.brand,
            type: item.type,
            qty: item.qty,
            unit: item.unit,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: { items: { orderBy: { lineNo: 'asc' } } },
    })
  })
}
