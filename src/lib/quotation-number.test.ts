import { describe, expect, it } from 'vitest'
import {
  counterYear,
  formatQuotationNumber,
  padSeq,
  toRomanMonth,
  withRevision,
} from './quotation-number'

describe('toRomanMonth', () => {
  it('memetakan seluruh bulan', () => {
    const expected = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    expected.forEach((roman, index) => {
      expect(toRomanMonth(index + 1)).toBe(roman)
    })
  })

  it('menolak bulan di luar rentang', () => {
    expect(() => toRomanMonth(0)).toThrow(RangeError)
    expect(() => toRomanMonth(13)).toThrow(RangeError)
    expect(() => toRomanMonth(1.5)).toThrow(RangeError)
  })
})

describe('padSeq', () => {
  it('memberi nol di depan hingga tiga digit', () => {
    expect(padSeq(1)).toBe('001')
    expect(padSeq(12)).toBe('012')
    expect(padSeq(999)).toBe('999')
  })

  // Nomor tidak boleh terpotong saat melewati 999.
  it('melebar melewati 999', () => {
    expect(padSeq(1000)).toBe('1000')
    expect(padSeq(12345)).toBe('12345')
  })

  it('menolak nomor tidak valid', () => {
    expect(() => padSeq(0)).toThrow(RangeError)
    expect(() => padSeq(-1)).toThrow(RangeError)
    expect(() => padSeq(1.5)).toThrow(RangeError)
  })
})

describe('formatQuotationNumber', () => {
  it('memakai pola baku', () => {
    expect(formatQuotationNumber({ seq: 1, issuedAt: new Date(2026, 6, 23) })).toBe(
      '001/METITO-SPH/VII/2026'
    )
  })

  it('mengambil bulan dan tahun dari tanggal terbit', () => {
    expect(formatQuotationNumber({ seq: 3, issuedAt: new Date(2026, 0, 15) })).toBe(
      '003/METITO-SPH/I/2026'
    )
    expect(formatQuotationNumber({ seq: 47, issuedAt: new Date(2027, 11, 31) })).toBe(
      '047/METITO-SPH/XII/2027'
    )
  })

  it('mengizinkan kode dokumen dan perusahaan diubah lewat setting', () => {
    expect(
      formatQuotationNumber({
        seq: 5,
        issuedAt: new Date(2026, 6, 1),
        docCode: 'INV',
        companyCode: 'MetitoGroup',
      })
    ).toBe('005/MetitoGroup-INV/VII/2026')
  })

  // Nomor yang sudah terbit dan dikirim ke pelanggan memakai METITO kapital.
  it('mempertahankan penulisan kode perusahaan', () => {
    const result = formatQuotationNumber({ seq: 1, issuedAt: new Date(2026, 6, 23) })
    expect(result).toContain('METITO-SPH')
  })
})

describe('withRevision', () => {
  const base = '001/METITO-SPH/VII/2026'

  it('tidak mengubah dokumen asli', () => {
    expect(withRevision(base, 0)).toBe(base)
  })

  it('menambahkan penanda revisi', () => {
    expect(withRevision(base, 1)).toBe('001/METITO-SPH/VII/2026 Rev.1')
    expect(withRevision(base, 2)).toBe('001/METITO-SPH/VII/2026 Rev.2')
  })

  it('menolak revisi tidak valid', () => {
    expect(() => withRevision(base, -1)).toThrow(RangeError)
    expect(() => withRevision(base, 1.5)).toThrow(RangeError)
  })
})

describe('counterYear', () => {
  // Counter di-reset tiap Januari, jadi kuncinya cukup tahun.
  it('memakai tahun dari tanggal terbit', () => {
    expect(counterYear(new Date(2026, 0, 1))).toBe(2026)
    expect(counterYear(new Date(2026, 11, 31))).toBe(2026)
    expect(counterYear(new Date(2027, 0, 1))).toBe(2027)
  })

  it('nomor urut berlanjut lintas bulan dalam tahun yang sama', () => {
    const januari = formatQuotationNumber({ seq: 1, issuedAt: new Date(2026, 0, 15) })
    const juli = formatQuotationNumber({ seq: 2, issuedAt: new Date(2026, 6, 23) })

    expect(januari).toBe('001/METITO-SPH/I/2026')
    expect(juli).toBe('002/METITO-SPH/VII/2026')
    // Bulan berbeda tidak me-reset nomor urut.
    expect(juli.startsWith('001')).toBe(false)
  })
})
