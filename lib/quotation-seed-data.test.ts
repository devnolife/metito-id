import { describe, expect, it } from 'vitest'
import { orderedSeedQuotations, SEED_VAT_RATE } from './quotation-seed-data'
import { computeTotals } from './quotation-math'
import { terbilangRupiah } from './terbilang'
import { formatQuotationNumber } from './quotation-number'

/**
 * Memeriksa hasil impor sebelum menyentuh database.
 *
 * Seed hanya menulis apa yang dihitung di sini, jadi bila nomor, total, dan
 * terbilang di bawah benar, isi database setelah impor juga benar.
 */

function buildImported() {
  return orderedSeedQuotations().map((source, index) => {
    const seq = index + 1
    const totals = computeTotals(
      source.items.map((item) => ({ qty: item.qty, unitPrice: item.unitPrice })),
      SEED_VAT_RATE
    )

    return {
      numberBase: formatQuotationNumber({ seq, issuedAt: source.issuedAt }),
      subject: source.subject,
      subtotal: totals.subtotal.toFixed(0),
      vatAmount: totals.vatAmount.toFixed(0),
      total: totals.total.toFixed(0),
      amountInWords: terbilangRupiah(totals.total.toFixed(0)),
    }
  })
}

describe('impor penawaran dari Quotation 2026.xlsx', () => {
  it('memberi nomor berurutan tanpa duplikat', () => {
    const numbers = buildImported().map((row) => row.numberBase)

    expect(numbers).toEqual([
      '001/SPH-Metito/VII/2026',
      '002/SPH-Metito/VII/2026',
      '003/SPH-Metito/VII/2026',
    ])
    // Berkas asli memakai 001/QUO-METITO/VII/2026 pada dua sheet sekaligus.
    expect(new Set(numbers).size).toBe(numbers.length)
  })

  it('mempertahankan nilai setiap penawaran', () => {
    const rows = buildImported()

    expect(rows.map((row) => row.total)).toEqual(['260850000', '179265000', '327450000'])
    expect(rows.map((row) => row.subtotal)).toEqual(['235000000', '161500000', '295000000'])
    expect(rows.map((row) => row.vatAmount)).toEqual(['25850000', '17765000', '32450000'])
  })

  // Cacat asli: sheet kimia bertotal 179.265.000 tetapi terbilangnya tersalin
  // dari sheet kabel (260.850.000).
  it('memperbaiki terbilang yang tertukar pada sheet bahan kimia', () => {
    const kimia = buildImported().find((row) => row.subject === 'Pengadaan Bahan Kimia')

    expect(kimia).toBeDefined()
    expect(kimia!.total).toBe('179265000')
    expect(kimia!.amountInWords).toBe(
      'Seratus Tujuh Puluh Sembilan Juta Dua Ratus Enam Puluh Lima Ribu Rupiah'
    )
    expect(kimia!.amountInWords).not.toContain('Dua Ratus Enam Puluh Juta')
  })

  // Cacat asli: perihal sheet kimia tertinggal "Pengadaan Cable Instrument".
  it('memperbaiki perihal sheet bahan kimia', () => {
    const subjects = buildImported().map((row) => row.subject)
    expect(subjects).toContain('Pengadaan Bahan Kimia')
    expect(subjects.filter((s) => s === 'Pengadaan Cable Instrument')).toHaveLength(2)
  })

  it('setiap terbilang sesuai totalnya sendiri', () => {
    for (const row of buildImported()) {
      expect(row.amountInWords).toBe(terbilangRupiah(row.total))
    }
  })
})
