import { describe, expect, it } from 'vitest'
import { formatQuotationNumber } from './quotation-number'
import {
  GLOBAL_DIVISION_KEY,
  counterDivisionKey,
  formatLetterNumber,
  isDivisionCode,
  isIssuedByAnotherModule,
  isLetterType,
  letterCounterYear,
  usesDivision,
} from './letter-number'

describe('formatLetterNumber', () => {
  it('membentuk nomor SPH tanpa divisi persis seperti berkas Excel', () => {
    expect(
      formatLetterNumber({ seq: 9, type: 'SPH', letterDate: new Date(2026, 7, 7) })
    ).toBe('009/METITO-SPH/VIII/2026')
  })

  it('mengabaikan divisi untuk jenis surat bernomor umum', () => {
    expect(
      formatLetterNumber({
        seq: 1,
        type: 'SPH',
        division: 'CSC',
        letterDate: new Date(2026, 6, 26),
      })
    ).toBe('001/METITO-SPH/VII/2026')
  })

  it('menyisipkan kode divisi untuk jenis surat selain SPH', () => {
    expect(
      formatLetterNumber({
        seq: 3,
        type: 'SPK',
        division: 'EQS',
        letterDate: new Date(2026, 0, 15),
      })
    ).toBe('003/METITO-SPK/EQS/I/2026')
  })

  it('menolak surat berdivisi yang tidak menyertakan divisi', () => {
    expect(() =>
      formatLetterNumber({ seq: 1, type: 'BA', letterDate: new Date(2026, 0, 1) })
    ).toThrow(/wajib memiliki divisi/)
  })

  it('melebarkan nomor urut di atas 999 tanpa memotong angka', () => {
    expect(
      formatLetterNumber({ seq: 1234, type: 'SPH', letterDate: new Date(2026, 11, 31) })
    ).toBe('1234/METITO-SPH/XII/2026')
  })
})

describe('counterDivisionKey', () => {
  it('memakai sentinel untuk jenis surat bernomor umum', () => {
    expect(counterDivisionKey('SPH', 'CSC')).toBe(GLOBAL_DIVISION_KEY)
  })

  it('memakai kode divisi untuk jenis surat lain', () => {
    expect(counterDivisionKey('SJ', 'MMH')).toBe('MMH')
  })

  it('menolak jenis surat berdivisi tanpa divisi', () => {
    expect(() => counterDivisionKey('SJ', null)).toThrow(/wajib memiliki divisi/)
  })
})

describe('klasifikasi jenis surat', () => {
  it('hanya SPH yang bernomor umum', () => {
    expect(usesDivision('SPH')).toBe(false)
    expect(usesDivision('MEMO')).toBe(true)
  })

  it('SPH diterbitkan modul penawaran, bukan modul surat', () => {
    expect(isIssuedByAnotherModule('SPH')).toBe(true)
    expect(isIssuedByAnotherModule('SPK')).toBe(false)
  })

  it('mengenali kode yang sah', () => {
    expect(isLetterType('MOU')).toBe(true)
    expect(isLetterType('XYZ')).toBe(false)
    expect(isDivisionCode('CSP')).toBe(true)
    expect(isDivisionCode('CS')).toBe(false)
  })
})

describe('letterCounterYear', () => {
  it('mengikuti tahun tanggal surat', () => {
    expect(letterCounterYear(new Date(2027, 0, 1))).toBe(2027)
  })
})

/**
 * SPH dinomori oleh modul Penawaran tetapi tercatat di register surat. Bila
 * kedua pembentuk nomor menghasilkan teks berbeda, register akan memuat dua
 * bentuk untuk surat yang sama dan nomor 001 bisa terbit dua kali dalam
 * setahun. Pengujian ini mengunci keduanya agar tidak dapat bercabang.
 */
describe('kesamaan nomor SPH dengan modul penawaran', () => {
  const dates = [new Date(2026, 6, 26), new Date(2026, 7, 7), new Date(2027, 0, 3)]

  it('menghasilkan teks yang sama untuk setiap nomor urut dan tanggal', () => {
    for (const date of dates) {
      for (const seq of [1, 9, 128]) {
        expect(formatLetterNumber({ seq, type: 'SPH', letterDate: date })).toBe(
          formatQuotationNumber({ seq, issuedAt: date })
        )
      }
    }
  })
})
