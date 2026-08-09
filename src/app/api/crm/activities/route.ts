import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { verifyActivityAuth } from '@/lib/admin-auth'
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { activityCreateSchema, activityListQuerySchema } from '@/lib/crm-schema'
import { zodErrors } from '@/lib/quotation-schema'
import { isDbConnectionError } from '@/lib/mock-data'
import { getMockActivities, mockPagination } from '@/lib/crm-mock-data'

/** GET /api/crm/activities — menggantikan sheet "Log Aktivitas". */
export async function GET(request: NextRequest) {
  const auth = await verifyActivityAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const parsed = activityListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const { search, type, accountId, dealId, pendingFollowUp, page, limit } = parsed.data

  const and: Prisma.CrmActivityWhereInput[] = []

  if (search) {
    and.push({
      OR: [
        { description: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { nextAction: { contains: search, mode: 'insensitive' } },
        { account: { name: { contains: search, mode: 'insensitive' } } },
      ],
    })
  }
  if (type) and.push({ type })
  if (accountId) and.push({ accountId })
  if (dealId) and.push({ dealId })
  if (pendingFollowUp) and.push({ nextActionDate: { not: null } })

  const where: Prisma.CrmActivityWhereInput = and.length > 0 ? { AND: and } : {}

  try {
    const [rows, total] = await Promise.all([
      db.crmActivity.findMany({
        where,
        orderBy: [{ occurredAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          deal: { select: { id: true, title: true } },
        },
      }),
      db.crmActivity.count({ where }),
    ])

    return successResponse({
      activities: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn('[mock] Database offline – serving log aktivitas dari data seed')
      const activities = getMockActivities()
      return successResponse({ activities, pagination: mockPagination(activities.length) })
    }

    console.error('GET /api/crm/activities failed:', error)
    return serverErrorResponse('Gagal memuat log aktivitas.')
  }
}

/** POST /api/crm/activities — mencatat interaksi dengan pelanggan. */
export async function POST(request: NextRequest) {
  const auth = await verifyActivityAuth(request)
  if (!auth.success || !auth.user) return unauthorizedResponse(auth.message)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body permintaan bukan JSON yang valid.')
  }

  const parsed = activityCreateSchema.safeParse(body)
  if (!parsed.success) return validationErrorResponse(zodErrors(parsed.error))

  const input = parsed.data

  try {
    const activity = await db.crmActivity.create({
      data: {
        accountId: input.accountId ?? null,
        dealId: input.dealId ?? null,
        occurredAt: input.occurredAt ?? new Date(),
        contactName: input.contactName ?? null,
        type: input.type,
        description: input.description,
        nextAction: input.nextAction ?? null,
        nextActionDate: input.nextActionDate ?? null,
        ownerName: input.ownerName ?? auth.user.name ?? null,
        createdById: auth.user.id,
      },
      include: { account: { select: { id: true, name: true } } },
    })

    return successResponse(activity, 'Aktivitas dicatat.', 201)
  } catch (error) {
    console.error('POST /api/crm/activities failed:', error)
    return serverErrorResponse('Gagal mencatat aktivitas.')
  }
}
