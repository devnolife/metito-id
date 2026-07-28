import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { allocateSeq } from './quotation-service'

/**
 * Uji integrasi untuk pengambilan nomor surat.
 *
 * Ini satu-satunya jalur yang wajib benar sepenuhnya: dua pengguna yang
 * menerbitkan penawaran pada saat bersamaan tidak boleh memperoleh nomor sama.
 * Berkas Excel lama gagal di titik ini, terbukti dari nomor 001/QUO-METITO/VII/2026
 * yang terpakai pada dua sheet berbeda.
 *
 * Uji ini membutuhkan database sungguhan dan akan dilewati bila DATABASE_URL
 * tidak dapat dijangkau, supaya `npm test` tetap hijau di mesin tanpa database.
 */

const prisma = new PrismaClient()

// Tahun jauh di depan agar tidak menyentuh data nyata.
const TEST_YEAR = 9999

let databaseAvailable = false

beforeAll(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    databaseAvailable = true
    await prisma.quotationCounter.deleteMany({ where: { year: TEST_YEAR } })
  } catch {
    databaseAvailable = false
  }
})

afterAll(async () => {
  if (databaseAvailable) {
    await prisma.quotationCounter.deleteMany({ where: { year: TEST_YEAR } })
  }
  await prisma.$disconnect()
})

describe('allocateSeq', () => {
  it.runIf(process.env.RUN_DB_TESTS === '1')(
    'memberi nomor berurutan mulai dari 1',
    async () => {
      if (!databaseAvailable) return

      const first = await prisma.$transaction((tx) => allocateSeq(tx, TEST_YEAR))
      const second = await prisma.$transaction((tx) => allocateSeq(tx, TEST_YEAR))
      const third = await prisma.$transaction((tx) => allocateSeq(tx, TEST_YEAR))

      expect(first).toBe(1)
      expect(second).toBe(2)
      expect(third).toBe(3)
    }
  )

  it.runIf(process.env.RUN_DB_TESTS === '1')(
    'tidak pernah memberi nomor kembar pada permintaan bersamaan',
    async () => {
      if (!databaseAvailable) return

      await prisma.quotationCounter.deleteMany({ where: { year: TEST_YEAR } })

      const CONCURRENCY = 25
      const results = await Promise.all(
        Array.from({ length: CONCURRENCY }, () =>
          prisma.$transaction((tx) => allocateSeq(tx, TEST_YEAR))
        )
      )

      const unique = new Set(results)
      expect(unique.size).toBe(CONCURRENCY)

      // Tidak boleh ada nomor yang bolong.
      expect([...unique].sort((a, b) => a - b)).toEqual(
        Array.from({ length: CONCURRENCY }, (_, index) => index + 1)
      )
    },
    30_000
  )
})
