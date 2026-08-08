import { Prisma } from '@prisma/client'

/**
 * Perhitungan uang untuk surat penawaran.
 *
 * Semua operasi memakai Prisma.Decimal, tipe yang sama dengan kolom database,
 * sehingga angka di layar, di database, dan di dokumen cetak selalu identik.
 * Pembulatan ke rupiah penuh dilakukan tepat satu kali, yaitu saat menghitung
 * PPN, agar tidak terjadi penumpukan galat pembulatan.
 */

export type DecimalInput = Prisma.Decimal | string | number

const Decimal = Prisma.Decimal
const ROUND = Prisma.Decimal.ROUND_HALF_UP

export interface QuotationLineInput {
  qty: DecimalInput
  unitPrice: DecimalInput
}

export interface QuotationTotals {
  /** Total tiap baris, sudah dibulatkan ke 2 desimal, urut sesuai input. */
  lineTotals: Prisma.Decimal[]
  /** Jumlah sebelum PPN. */
  subtotal: Prisma.Decimal
  /** Nilai PPN, dibulatkan ke rupiah penuh. */
  vatAmount: Prisma.Decimal
  /** Subtotal + PPN. */
  total: Prisma.Decimal
}

function toDecimal(value: DecimalInput, label: string): Prisma.Decimal {
  const d = value instanceof Decimal ? value : new Decimal(value)
  if (!d.isFinite()) {
    throw new TypeError(`quotation-math: ${label} bukan angka valid: ${String(value)}`)
  }
  return d
}

/** Total satu baris: qty x harga satuan, dibulatkan ke 2 desimal. */
export function lineTotal(qty: DecimalInput, unitPrice: DecimalInput): Prisma.Decimal {
  const q = toDecimal(qty, 'qty')
  const p = toDecimal(unitPrice, 'unitPrice')

  if (q.isNegative()) throw new RangeError('quotation-math: qty tidak boleh negatif')
  if (p.isNegative()) throw new RangeError('quotation-math: harga satuan tidak boleh negatif')

  return q.mul(p).toDecimalPlaces(2, ROUND)
}

/**
 * Menghitung seluruh nilai dokumen.
 *
 * PPN ditambahkan di atas subtotal (bukan termasuk di dalamnya). Berkas Excel
 * lama menulis "Price include PPN 11%" pada syarat & ketentuan padahal
 * perhitungannya menambahkan PPN; label itu diperbaiki di sisi tampilan.
 */
export function computeTotals(
  items: readonly QuotationLineInput[],
  vatRate: DecimalInput
): QuotationTotals {
  const rate = toDecimal(vatRate, 'vatRate')
  if (rate.isNegative()) throw new RangeError('quotation-math: tarif PPN tidak boleh negatif')

  const lineTotals = items.map((item) => lineTotal(item.qty, item.unitPrice))

  const subtotal = lineTotals.reduce((sum, value) => sum.add(value), new Decimal(0))

  // Satu-satunya titik pembulatan ke rupiah penuh.
  const vatAmount = subtotal.mul(rate).toDecimalPlaces(0, ROUND)

  return {
    lineTotals,
    subtotal,
    vatAmount,
    total: subtotal.add(vatAmount),
  }
}

/** Format rupiah untuk tampilan, mis. "Rp 260.850.000". */
export function formatRupiah(value: DecimalInput): string {
  const d = toDecimal(value, 'value')
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(d.toFixed(0)))}`
}
