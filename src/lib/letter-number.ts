import { padSeq, toRomanMonth } from '@/lib/quotation-number'

/**
 * Pembentukan nomor surat umum METITO.
 *
 * Menggantikan sheet "Generator Nomor Surat" pada CRM_Nomor_Surat_METITO_3.xlsx.
 *
 * Pola pada berkas asal:
 * - SPH  : {NNN}/METITO-SPH/{BULAN_ROMAWI}/{TAHUN}          (umum, tanpa divisi)
 * - lain : {NNN}/METITO-{JENIS}/{DIVISI}/{BULAN_ROMAWI}/{TAHUN}
 *
 * Nomor urut Excel dihitung dengan COUNTIFS atas baris log, sehingga menghapus
 * atau menyortir satu baris membuat surat berikutnya memakai ulang nomor yang
 * sudah terbit. Di sini nomor diambil dari tabel counter, jadi angka yang sudah
 * dipakai tidak pernah kembali.
 */

export const LETTER_COMPANY_CODE = 'METITO'

export const LETTER_TYPES = [
  'SPH',
  'SPK',
  'SJ',
  'BA',
  'MOU',
  'SK',
  'MEMO',
  'SI',
  'SL',
] as const

export type LetterTypeCode = (typeof LETTER_TYPES)[number]

export const DIVISION_CODES = ['CSC', 'ES', 'EQS', 'CSP', 'MMH'] as const

export type DivisionCode = (typeof DIVISION_CODES)[number]

export const LETTER_TYPE_LABEL: Record<LetterTypeCode, string> = {
  SPH: 'Surat Penawaran Harga',
  SPK: 'Surat Perintah Kerja',
  SJ: 'Surat Jalan',
  BA: 'Berita Acara',
  MOU: 'Memorandum of Understanding / Perjanjian Kerja Sama',
  SK: 'Surat Keterangan',
  MEMO: 'Memo Internal',
  SI: 'Surat Izin / Permohonan',
  SL: 'Surat Lainnya',
}

export const DIVISION_LABEL: Record<DivisionCode, string> = {
  CSC: 'Chemical Supply',
  ES: 'Engineering Services',
  EQS: 'Equipment Supply',
  CSP: 'Consumable & Spare Parts',
  MMH: 'Mining & Material Handling Supply',
}

/**
 * Jenis surat yang nomornya berlaku umum: satu deret per tahun untuk seluruh
 * divisi. SPH mengikuti kebijakan pada berkas asal.
 */
const GLOBAL_NUMBERING_TYPES: readonly LetterTypeCode[] = ['SPH']

/**
 * Jenis surat yang nomornya diterbitkan modul lain.
 *
 * SPH dinomori oleh modul Penawaran saat penawaran diterbitkan. Bila modul ini
 * juga boleh mengeluarkan SPH, akan ada dua deret yang saling menimpa untuk
 * nomor surat yang sama-sama mengikat pelanggan.
 */
const EXTERNALLY_ISSUED_TYPES: readonly LetterTypeCode[] = ['SPH']

/** Sentinel divisi untuk counter surat bernomor umum. */
export const GLOBAL_DIVISION_KEY = '-'

/** PIC penerbit surat, dari daftar dropdown sheet "Generator Nomor Surat". */
export const LETTER_ISSUERS = [
  'Andi Musthamu',
  'Pasya Ahmad',
  'Muhammad Khudaivi',
  'Andi Agung',
] as const

export function isLetterType(value: string): value is LetterTypeCode {
  return (LETTER_TYPES as readonly string[]).includes(value)
}

export function isDivisionCode(value: string): value is DivisionCode {
  return (DIVISION_CODES as readonly string[]).includes(value)
}

/** Benar bila kode divisi ikut masuk ke dalam nomor surat. */
export function usesDivision(type: LetterTypeCode): boolean {
  return !GLOBAL_NUMBERING_TYPES.includes(type)
}

/** Benar bila nomor jenis surat ini tidak boleh dibuat dari modul surat. */
export function isIssuedByAnotherModule(type: LetterTypeCode): boolean {
  return EXTERNALLY_ISSUED_TYPES.includes(type)
}

/**
 * Kunci divisi pada tabel counter. Surat bernomor umum memakai sentinel karena
 * kolom kunci gabungan tidak boleh null.
 */
export function counterDivisionKey(
  type: LetterTypeCode,
  division: DivisionCode | null | undefined
): string {
  if (!usesDivision(type)) return GLOBAL_DIVISION_KEY
  if (!division) {
    throw new Error(`letter-number: jenis surat ${type} wajib memiliki divisi`)
  }
  return division
}

export interface LetterNumberParts {
  /** Nomor urut dari counter, dimulai dari 1. */
  seq: number
  type: LetterTypeCode
  /** Wajib untuk jenis surat yang dipecah per divisi; diabaikan untuk SPH. */
  division?: DivisionCode | null
  /** Tanggal surat; menentukan bulan Romawi dan tahun. */
  letterDate: Date
  companyCode?: string
}

export function formatLetterNumber({
  seq,
  type,
  division,
  letterDate,
  companyCode = LETTER_COMPANY_CODE,
}: LetterNumberParts): string {
  const month = toRomanMonth(letterDate.getMonth() + 1)
  const year = letterDate.getFullYear()
  const head = `${padSeq(seq)}/${companyCode}-${type}`

  if (!usesDivision(type)) {
    return `${head}/${month}/${year}`
  }

  if (!division) {
    throw new Error(`letter-number: jenis surat ${type} wajib memiliki divisi`)
  }

  return `${head}/${division}/${month}/${year}`
}

/** Tahun kunci counter. Deret di-reset tiap Januari. */
export function letterCounterYear(letterDate: Date): number {
  return letterDate.getFullYear()
}
