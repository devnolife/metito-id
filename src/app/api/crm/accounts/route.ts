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
import { accountCreateSchema, accountListQuerySchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'
import { isDbConnectionError } from '@/lib/mock-data'
import { getMockAccounts, mockPagination } from '@/lib/crm-mock-data'

/** GET /api/crm/accounts — menggantikan sheet "Data Pelanggan". */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = accountListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { search, status, division, page, limit } = parsed.data

  const and: Prisma.CrmAccountWhereInput[] = []

  if (search) {
    and.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { picName: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ],
    })
  }
  if (status) and.push({ status })
  if (division) and.push({ division })

  const where: Prisma.CrmAccountWhereInput = and.length > 0 ? { AND: and } : {}

  try {
    const [rows, total] = await Promise.all([
      db.crmAccount.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { deals: true, activities: true, letters: true } } },
      }),
      db.crmAccount.count({ where }),
    ])

    return successResponse({
      accounts: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn('[mock] Database offline – serving CRM accounts dari data seed')
      const accounts = getMockAccounts().filter((account) => {
        if (status && account.status !== status) return false
        if (division && account.division !== division) return false
        if (search) {
          const haystack = [account.name, account.picName, account.industry, account.address]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(search.toLowerCase())) return false
        }
        return true
      })

      return successResponse({ accounts, pagination: mockPagination(accounts.length) })
    }

    console.error('GET /api/crm/accounts failed:', error)
    return serverErrorResponse('Gagal memuat data pelanggan.')
  }
}

/** POST /api/crm/accounts — menambah pelanggan baru. */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = accountCreateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    const account = await db.crmAccount.create({
      data: {
        name: input.name,
        industry: input.industry ?? null,
        division: input.division ?? null,
        address: input.address ?? null,
        picName: input.picName ?? null,
        picTitle: input.picTitle ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        leadSource: input.leadSource ?? null,
        status: input.status,
        addedAt: input.addedAt ?? new Date(),
        notes: input.notes ?? null,
      },
    })

    return successResponse(account, 'Pelanggan ditambahkan.', 201)
  } catch (error) {
    console.error('POST /api/crm/accounts failed:', error)
    return serverErrorResponse('Gagal menambah pelanggan.')
  }
}
