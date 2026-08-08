import { describe, expect, it } from 'vitest'
import { formatLetterNumber } from './letter-number'
import {
  SEED_ACCOUNTS,
  SEED_DEALS,
  SEED_LETTERS,
  seedCounterState,
} from './crm-seed-data'

describe('impor pelanggan dari CRM_Nomor_Surat_METITO_3.xlsx', () => {
  it('membawa keenam pelanggan', () => {
    expect(SEED_ACCOUNTS).toHaveLength(6)
  })

  it('memakai kunci yang unik agar peluang tidak salah tempel', () => {
    const keys = SEED_ACCOUNTS.map((account) => account.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  // Excel menyimpan kolom Telepon sebagai angka sehingga 085640373995 tersimpan
  // menjadi 85640373995 dan nol di depannya hilang.
  it('mempertahankan nol di depan nomor telepon', () => {
    const phones = SEED_ACCOUNTS.map((account) => account.phone).filter(
      (phone): phone is string => Boolean(phone)
    )

    for (const phone of phones) {
      expect(phone.startsWith('0') || phone.startsWith('+')).toBe(true)
    }
  })

  it('tidak menyimpan tanda hubung sebagai alamat surel', () => {
    for (const account of SEED_ACCOUNTS) {
      if (account.email === null) continue
      expect(account.email).not.toMatch(/^\s*-\s*$/)
      expect(account.email).toContain('@')
    }
  })
})

describe('impor pipeline', () => {
  it('membawa kedelapan peluang', () => {
    expect(SEED_DEALS).toHaveLength(8)
  })

  it('menautkan setiap peluang ke pelanggan yang ada', () => {
    const keys = new Set(SEED_ACCOUNTS.map((account) => account.key))
    for (const deal of SEED_DEALS) {
      expect(keys.has(deal.accountKey)).toBe(true)
    }
  })

  // Berkas asli mencampur 0,8 (80%) dan 50 (50%) pada kolom yang sama.
  it('menyeragamkan probabilitas menjadi persen bulat', () => {
    for (const deal of SEED_DEALS) {
      expect(Number.isInteger(deal.probability)).toBe(true)
      expect(deal.probability).toBeGreaterThanOrEqual(0)
      expect(deal.probability).toBeLessThanOrEqual(100)
    }
  })

  it('mempertahankan total nilai pipeline dari berkas asal', () => {
    const total = SEED_DEALS.reduce((sum, deal) => sum + deal.estimatedValue, 0)
    expect(total).toBe(672_904_109)
  })
})

describe('impor register surat', () => {
  it('membawa delapan surat terbit tanpa baris pratinjau', () => {
    expect(SEED_LETTERS).toHaveLength(8)
    // Baris kuning bernomor 009 pada Excel adalah rumus pratinjau, bukan surat.
    expect(SEED_LETTERS.some((letter) => letter.seq === 9)).toBe(false)
  })

  it('tidak memuat nomor kembar', () => {
    const numbers = SEED_LETTERS.map((letter) => letter.number)
    expect(new Set(numbers).size).toBe(numbers.length)
  })

  // Nomor 004 dan 005 tertulis bertanggal April pada berkas padahal bulan
  // Romawinya VIII; bulan pada nomor harus sama dengan bulan tanggal surat.
  it('menyelaraskan bulan Romawi dengan tanggal surat', () => {
    for (const letter of SEED_LETTERS) {
      expect(
        formatLetterNumber({
          seq: letter.seq,
          type: letter.type,
          division: letter.division,
          letterDate: letter.letterDate,
        })
      ).toBe(letter.number)
    }
  })
})

describe('seedCounterState', () => {
  it('memulai counter dari nomor tertinggi yang sudah terbit', () => {
    const state = seedCounterState()

    expect(state).toEqual([{ year: 2026, type: 'SPH', division: '-', lastSeq: 8 }])
  })

  it('membuat surat berikutnya bernomor 009, bukan mengulang 001', () => {
    const [sph] = seedCounterState()
    const next = formatLetterNumber({
      seq: sph.lastSeq + 1,
      type: 'SPH',
      letterDate: new Date(2026, 7, 20),
    })

    expect(next).toBe('009/METITO-SPH/VIII/2026')
  })
})
