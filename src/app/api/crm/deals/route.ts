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
import { dealCreateSchema, dealListQuerySchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'
import { weightedValue } from '@/lib/crm-labels'
import { isDbConnectionError } from '@/lib/mock-data'
import { getMockDeals, mockPagination } from '@/lib/crm-mock-data'

/** GET /api/crm/deals — menggantikan sheet "Pipeline Penjualan". */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = dealListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { search, stage, division, accountId, page, limit } = parsed.data

  const and: Prisma.CrmDealWhereInput[] = []

  if (search) {
    and.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
        { account: { name: { contains: search, mode: 'insensitive' } } },
      ],
    })
  }
  if (stage) and.push({ stage })
  if (division) and.push({ division })
  if (accountId) and.push({ accountId })

  const where: Prisma.CrmDealWhereInput = and.length > 0 ? { AND: and } : {}

  try {
    const [rows, total] = await Promise.all([
      db.crmDeal.findMany({
        where,
        orderBy: [{ targetCloseDate: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          account: { select: { id: true, name: true, status: true } },
          quotation: { select: { id: true, numberBase: true, status: true } },
        },
      }),
      db.crmDeal.count({ where }),
    ])

    return successResponse({
      deals: rows.map((row) => ({
        ...row,
        weightedValue: weightedValue(
          Number(row.estimatedValue),
          row.probability,
          row.stage
        ).toFixed(2),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn('[mock] Database offline – serving CRM pipeline dari data seed')
      const deals = getMockDeals().filter((deal) => {
        if (stage && deal.stage !== stage) return false
        if (division && deal.division !== division) return false
        if (accountId && deal.accountId !== accountId) return false
        if (search) {
          const haystack = [deal.title, deal.ownerName, deal.account?.name]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(search.toLowerCase())) return false
        }
        return true
      })

      return successResponse({ deals, pagination: mockPagination(deals.length) })
    }

    console.error('GET /api/crm/deals failed:', error)
    return serverErrorResponse('Gagal memuat pipeline.')
  }
}

/** POST /api/crm/deals — menambah peluang penjualan. */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = dealCreateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    // Peluang selalu menempel pada pelanggan yang ada. Pada berkas Excel nama
    // perusahaan diketik ulang, sehingga "PT. Safindo Utama" di pipeline tidak
    // pernah cocok dengan "PT. Safetindo Utama" di data pelanggan.
    const account = await db.crmAccount.findUnique({
      where: { id: input.accountId },
      select: { id: true, division: true },
    })
    if (!account) return errorResponse('Pelanggan tidak ditemukan.', 404)

    const deal = await db.crmDeal.create({
      data: {
        accountId: account.id,
        title: input.title,
        division: input.division ?? account.division ?? null,
        estimatedValue: new Prisma.Decimal(input.estimatedValue),
        stage: input.stage,
        probability: input.probability,
        startDate: input.startDate ?? null,
        targetCloseDate: input.targetCloseDate ?? null,
        ownerName: input.ownerName ?? null,
        notes: input.notes ?? null,
        quotationId: input.quotationId ?? null,
      },
      include: { account: { select: { id: true, name: true } } },
    })

    return successResponse(deal, 'Peluang ditambahkan.', 201)
  } catch (error) {
    console.error('POST /api/crm/deals failed:', error)
    return serverErrorResponse('Gagal menambah peluang.')
  }
}
