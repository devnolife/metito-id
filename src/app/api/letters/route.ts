import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { letterCreateSchema, letterListQuerySchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'
import { LetterError, issueLetter } from '@/lib/letter-service'
import { isDbConnectionError } from '@/lib/mock-data'
import { getMockLetters, mockPagination } from '@/lib/crm-mock-data'

/** GET /api/letters — menggantikan sheet "Log Nomor Surat". */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = letterListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { search, type, division, status, year, page, limit } = parsed.data

  const and: Prisma.LetterWhereInput[] = []

  if (search) {
    and.push({
      OR: [
        { number: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { recipient: { contains: search, mode: 'insensitive' } },
        { issuerName: { contains: search, mode: 'insensitive' } },
      ],
    })
  }
  if (type) and.push({ type })
  if (division) and.push({ division })
  if (status) and.push({ status })
  if (year) and.push({ year })

  const where: Prisma.LetterWhereInput = and.length > 0 ? { AND: and } : {}

  try {
    const [rows, total] = await Promise.all([
      db.letter.findMany({
        where,
        orderBy: [{ letterDate: 'desc' }, { seq: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          quotation: { select: { id: true, numberBase: true } },
        },
      }),
      db.letter.count({ where }),
    ])

    return successResponse({
      letters: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn('[mock] Database offline – serving log nomor surat dari data seed')
      const letters = getMockLetters().filter((letter) => {
        if (type && letter.type !== type) return false
        if (division && letter.division !== division) return false
        if (status && letter.status !== status) return false
        if (year && letter.year !== year) return false
        if (search) {
          const haystack = [letter.number, letter.subject, letter.recipient, letter.issuerName]
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(search.toLowerCase())) return false
        }
        return true
      })

      return successResponse({ letters, pagination: mockPagination(letters.length) })
    }

    console.error('GET /api/letters failed:', error)
    return serverErrorResponse('Gagal memuat log nomor surat.')
  }
}

/**
 * POST /api/letters — menerbitkan nomor surat baru.
 *
 * Nomor langsung tersimpan sebagai riwayat permanen. Pada berkas Excel nomor
 * hanya muncul sebagai pratinjau dan harus disalin manual ke baris berikutnya,
 * sehingga surat yang lupa disalin membuat nomor berikutnya terpakai dua kali.
 */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success || !auth.user) return unauthorizedResponse(auth.message)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = letterCreateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    const letter = await issueLetter({
      type: input.type,
      division: input.division ?? null,
      subject: input.subject,
      recipient: input.recipient,
      issuerName: input.issuerName,
      letterDate: input.letterDate,
      status: input.status,
      notes: input.notes,
      accountId: input.accountId || null,
      createdById: auth.user.id,
    })

    return successResponse(letter, `Nomor surat ${letter.number} diterbitkan.`, 201)
  } catch (error) {
    if (error instanceof LetterError) {
      return errorResponse(error.message, error.statusCode)
    }
    console.error('POST /api/letters failed:', error)
    return serverErrorResponse('Gagal menerbitkan nomor surat.')
  }
}
