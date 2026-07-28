/**
 * Pembentukan nomor surat penawaran.
 *
 * Pola: {NNN}/{KODE_DOK}-{KODE_PERUSAHAAN}/{BULAN_ROMAWI}/{TAHUN}
 * Contoh: 001/SPH-Metito/VII/2026
 *
 * Berkas Excel lama memakai tiga konvensi berbeda (QUO-METITO, SPH-METITO, dan
 * contoh METITO-SPH pada sheet Pengaturan). Modul ini menetapkan satu bentuk
 * baku dan menaruh komponen kodenya di Setting agar dapat diubah tanpa
 * mengubah kode.
 */

export const DEFAULT_DOC_CODE = 'SPH'
export const DEFAULT_COMPANY_CODE = 'Metito'

/** Lebar minimum nomor urut; melebar sendiri bila melewati 999. */
export const SEQ_MIN_WIDTH = 3

const ROMAN_MONTHS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
] as const

export interface QuotationNumberParts {
  /** Nomor urut dari counter tahunan, dimulai dari 1. */
  seq: number
  /** Tanggal terbit; menentukan bulan Romawi dan tahun. */
  issuedAt: Date
  docCode?: string
  companyCode?: string
}

/** Mengubah bulan 1..12 menjadi angka Romawi. */
export function toRomanMonth(month: number): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`quotation-number: bulan harus 1..12, diterima ${month}`)
  }
  return ROMAN_MONTHS[month - 1]
}

/** Memberi nol di depan hingga lebar minimum, tanpa memotong angka besar. */
export function padSeq(seq: number): string {
  if (!Number.isInteger(seq) || seq < 1) {
    throw new RangeError(`quotation-number: nomor urut harus bilangan bulat >= 1, diterima ${seq}`)
  }
  return String(seq).padStart(SEQ_MIN_WIDTH, '0')
}

/** Membentuk nomor dasar, belum termasuk penanda revisi. */
export function formatQuotationNumber({
  seq,
  issuedAt,
  docCode = DEFAULT_DOC_CODE,
  companyCode = DEFAULT_COMPANY_CODE,
}: QuotationNumberParts): string {
  const month = toRomanMonth(issuedAt.getMonth() + 1)
  const year = issuedAt.getFullYear()
  return `${padSeq(seq)}/${docCode}-${companyCode}/${month}/${year}`
}

/**
 * Menambahkan penanda revisi. Revisi 0 adalah dokumen asli dan tidak diberi
 * penanda, sehingga nomor yang sudah beredar tidak berubah bentuk.
 */
export function withRevision(numberBase: string, revision: number): string {
  if (!Number.isInteger(revision) || revision < 0) {
    throw new RangeError(`quotation-number: revisi harus bilangan bulat >= 0, diterima ${revision}`)
  }
  return revision === 0 ? numberBase : `${numberBase} Rev.${revision}`
}

/** Tahun yang dipakai sebagai kunci counter. Counter di-reset tiap Januari. */
export function counterYear(issuedAt: Date): number {
  return issuedAt.getFullYear()
}
