import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { allocateLetterSeq } from './letter-service'

/**
 * Uji integrasi untuk pengambilan nomor surat umum.
 *
 * Sama seperti penawaran, ini jalur yang wajib benar sepenuhnya: dua orang yang
 * menerbitkan surat bersamaan tidak boleh memperoleh nomor sama. Rumus COUNTIFS
 * pada berkas Excel gagal di titik ini karena menghitung ulang dari baris log.
 *
 * Uji ini membutuhkan database sungguhan dan dilewati bila DATABASE_URL tidak
 * dapat dijangkau, supaya `npm test` tetap hijau di mesin tanpa database.
 */

const prisma = new PrismaClient()

// Tahun jauh di depan agar tidak menyentuh data nyata.
const TEST_YEAR = 9999
const TEST_TYPE = 'SPK' as const
const TEST_DIVISION = 'CSC'

let databaseAvailable = false

const cleanup = () =>
  prisma.letterCounter.deleteMany({ where: { year: TEST_YEAR } })

beforeAll(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    databaseAvailable = true
    await cleanup()
  } catch {
    databaseAvailable = false
  }
})

afterAll(async () => {
  if (databaseAvailable) await cleanup()
  await prisma.$disconnect()
})

describe('allocateLetterSeq', () => {
  it.runIf(process.env.RUN_DB_TESTS === '1')(
    'memberi nomor berurutan mulai dari 1',
    async () => {
      if (!databaseAvailable) return

      const seqs: number[] = []
      for (let i = 0; i < 3; i += 1) {
        seqs.push(
          await prisma.$transaction((tx) =>
            allocateLetterSeq(tx, TEST_YEAR, TEST_TYPE, TEST_DIVISION)
          )
        )
      }

      expect(seqs).toEqual([1, 2, 3])
    }
  )

  it.runIf(process.env.RUN_DB_TESTS === '1')(
    'memisahkan deret antar divisi untuk jenis surat berdivisi',
    async () => {
      if (!databaseAvailable) return

      await cleanup()

      const csc = await prisma.$transaction((tx) =>
        allocateLetterSeq(tx, TEST_YEAR, TEST_TYPE, 'CSC')
      )
      const eqs = await prisma.$transaction((tx) =>
        allocateLetterSeq(tx, TEST_YEAR, TEST_TYPE, 'EQS')
      )

      // Divisi berbeda memulai deretnya sendiri.
      expect(csc).toBe(1)
      expect(eqs).toBe(1)
    }
  )

  it.runIf(process.env.RUN_DB_TESTS === '1')(
    'tidak pernah memberi nomor kembar pada permintaan bersamaan',
    async () => {
      if (!databaseAvailable) return

      await cleanup()

      const CONCURRENCY = 25
      const results = await Promise.all(
        Array.from({ length: CONCURRENCY }, () =>
          prisma.$transaction((tx) =>
            allocateLetterSeq(tx, TEST_YEAR, TEST_TYPE, TEST_DIVISION)
          )
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
