import { Prisma } from '@prisma/client'
import type { CrmDivision, Letter, LetterStatus, LetterType } from '@prisma/client'
import { db } from '@/lib/db'
import {
  counterDivisionKey,
  formatLetterNumber,
  isIssuedByAnotherModule,
  letterCounterYear,
  usesDivision,
  type DivisionCode,
  type LetterTypeCode,
} from '@/lib/letter-number'

/** Kesalahan yang aman ditampilkan ke pengguna, lengkap dengan kode HTTP. */
export class LetterError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'LetterError'
  }
}

const PRISMA_UNIQUE_VIOLATION = 'P2002'
const MAX_ALLOCATION_ATTEMPTS = 5

type TxClient = Prisma.TransactionClient

/**
 * Mengambil satu nomor urut untuk kombinasi (tahun, jenis, divisi).
 *
 * Kenaikan dilakukan dalam satu pernyataan sehingga dua permintaan bersamaan
 * tidak mungkin memperoleh nomor yang sama.
 */
export async function allocateLetterSeq(
  tx: TxClient,
  year: number,
  type: LetterTypeCode,
  divisionKey: string
): Promise<number> {
  const counter = await tx.letterCounter.upsert({
    where: { year_type_division: { year, type: type as LetterType, division: divisionKey } },
    create: { year, type: type as LetterType, division: divisionKey, lastSeq: 1 },
    update: { lastSeq: { increment: 1 } },
    select: { lastSeq: true },
  })

  return counter.lastSeq
}

function isRetryableAllocationError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === PRISMA_UNIQUE_VIOLATION
  )
}

export interface IssueLetterInput {
  type: LetterTypeCode
  division?: DivisionCode | null
  subject: string
  recipient: string
  issuerName: string
  letterDate?: Date
  status?: LetterStatus
  notes?: string | null
  accountId?: string | null
  createdById?: string | null
}

/**
 * Menerbitkan nomor surat baru.
 *
 * Nomor diambil setelah seluruh validasi lulus, agar permintaan yang ditolak
 * tidak membakar nomor urut.
 */
export async function issueLetter(input: IssueLetterInput): Promise<Letter> {
  if (isIssuedByAnotherModule(input.type)) {
    throw new LetterError(
      'Nomor SPH diterbitkan dari modul Penawaran agar deretnya tidak bercabang. Buat penawaran, lalu terbitkan.',
      409
    )
  }

  const division = usesDivision(input.type) ? (input.division ?? null) : null

  if (usesDivision(input.type) && !division) {
    throw new LetterError('Divisi wajib dipilih untuk jenis surat ini.')
  }

  if (!input.subject.trim()) throw new LetterError('Perihal wajib diisi.')
  if (!input.recipient.trim()) throw new LetterError('Ditujukan kepada wajib diisi.')
  if (!input.issuerName.trim()) throw new LetterError('PIC penerbit wajib diisi.')

  const letterDate = input.letterDate ?? new Date()
  const year = letterCounterYear(letterDate)
  const divisionKey = counterDivisionKey(input.type, division)

  for (let attempt = 1; attempt <= MAX_ALLOCATION_ATTEMPTS; attempt += 1) {
    try {
      return await db.$transaction(async (tx) => {
        const seq = await allocateLetterSeq(tx, year, input.type, divisionKey)
        const number = formatLetterNumber({ seq, type: input.type, division, letterDate })

        return tx.letter.create({
          data: {
            number,
            seq,
            year,
            type: input.type as LetterType,
            division: (division as CrmDivision | null) ?? null,
            letterDate,
            subject: input.subject.trim(),
            recipient: input.recipient.trim(),
            issuerName: input.issuerName.trim(),
            status: input.status ?? 'DRAFT',
            notes: input.notes?.trim() || null,
            accountId: input.accountId ?? null,
            createdById: input.createdById ?? null,
          },
        })
      })
    } catch (error) {
      if (isRetryableAllocationError(error) && attempt < MAX_ALLOCATION_ATTEMPTS) {
        continue
      }
      throw error
    }
  }

  throw new LetterError(
    'Gagal mengambil nomor surat karena permintaan bersamaan. Silakan coba lagi.',
    503
  )
}

/**
 * Mencatat penawaran yang baru terbit ke register surat.
 *
 * Register harus memuat seluruh surat keluar, termasuk SPH. Nomornya tetap
 * berasal dari counter penawaran, jadi tidak ada nomor kedua yang dibuat di
 * sini; baris ini hanya cerminan agar log surat tidak berlubang.
 *
 * Kegagalan pencatatan tidak boleh membatalkan penerbitan penawaran yang sudah
 * bernomor, sehingga pemanggil menjalankannya setelah transaksi penawaran.
 */
export async function registerQuotationLetter(params: {
  quotationId: string
  number: string
  seq: number
  letterDate: Date
  subject: string
  recipient: string
  issuerName: string
  createdById?: string | null
}): Promise<void> {
  await db.letter.upsert({
    where: { quotationId: params.quotationId },
    update: {
      number: params.number,
      seq: params.seq,
      year: letterCounterYear(params.letterDate),
      letterDate: params.letterDate,
      subject: params.subject,
      recipient: params.recipient,
      issuerName: params.issuerName,
      status: 'TERKIRIM',
    },
    create: {
      quotationId: params.quotationId,
      number: params.number,
      seq: params.seq,
      year: letterCounterYear(params.letterDate),
      type: 'SPH',
      division: null,
      letterDate: params.letterDate,
      subject: params.subject,
      recipient: params.recipient,
      issuerName: params.issuerName,
      status: 'TERKIRIM',
      createdById: params.createdById ?? null,
    },
  })
}

/**
 * Nomor berikutnya untuk pratinjau di formulir, tanpa mengambil nomor.
 *
 * Angka ini bisa saja terlewati bila ada penerbitan lain di antara pratinjau
 * dan penyimpanan; nomor yang mengikat adalah yang dikembalikan issueLetter.
 */
export async function peekNextLetterNumber(
  type: LetterTypeCode,
  division: DivisionCode | null,
  letterDate: Date
): Promise<{ seq: number; number: string }> {
  const effectiveDivision = usesDivision(type) ? division : null

  if (usesDivision(type) && !effectiveDivision) {
    throw new LetterError('Divisi wajib dipilih untuk jenis surat ini.')
  }

  const year = letterCounterYear(letterDate)
  const divisionKey = counterDivisionKey(type, effectiveDivision)

  const counter = await db.letterCounter.findUnique({
    where: { year_type_division: { year, type: type as LetterType, division: divisionKey } },
    select: { lastSeq: true },
  })

  const seq = (counter?.lastSeq ?? 0) + 1

  return {
    seq,
    number: formatLetterNumber({ seq, type, division: effectiveDivision, letterDate }),
  }
}
