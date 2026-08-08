import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import { weightedValue } from '@/lib/crm-labels'
import { isDbConnectionError } from '@/lib/mock-data'
import { getMockCrmStats } from '@/lib/crm-mock-data'

/**
 * GET /api/crm/stats — menggantikan sheet "Dashboard".
 *
 * Seluruh angka dihitung ulang dari tabel setiap kali dibaca, sehingga tidak
 * bisa tertinggal seperti rumus Excel yang rentangnya berhenti di baris 1000.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.success) return unauthorizedResponse(auth.message)

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  try {
    const [
      accountsByStatus,
      accountsByDivision,
      totalAccounts,
      deals,
      dealsByStage,
      totalLetters,
      lettersThisYear,
      lettersThisMonth,
      lettersByType,
      overdueFollowUps,
      upcomingFollowUps,
    ] = await Promise.all([
      db.crmAccount.groupBy({ by: ['status'], _count: { _all: true } }),
      db.crmAccount.groupBy({ by: ['division'], _count: { _all: true } }),
      db.crmAccount.count(),
      db.crmDeal.findMany({
        select: { estimatedValue: true, probability: true, stage: true, division: true },
      }),
      db.crmDeal.groupBy({ by: ['stage'], _count: { _all: true } }),
      db.letter.count(),
      db.letter.count({ where: { letterDate: { gte: startOfYear } } }),
      db.letter.count({ where: { letterDate: { gte: startOfMonth, lt: startOfNextMonth } } }),
      db.letter.groupBy({ by: ['type'], _count: { _all: true } }),
      db.crmActivity.count({ where: { nextActionDate: { lt: now } } }),
      db.crmActivity.count({ where: { nextActionDate: { gte: now, lte: in7Days } } }),
    ])

    let pipelineValue = 0
    let pipelineWeighted = 0
    let wonValue = 0
    const valueByDivision: Record<string, number> = {}

    for (const deal of deals) {
      const value = Number(deal.estimatedValue)
      const weighted = weightedValue(value, deal.probability, deal.stage)

      if (deal.stage === 'DEAL') wonValue += value
      if (deal.stage !== 'KALAH') {
        pipelineValue += value
        pipelineWeighted += weighted
        const key = deal.division ?? 'TANPA_DIVISI'
        valueByDivision[key] = (valueByDivision[key] ?? 0) + value
      }
    }

    const countBy = <T extends string>(rows: Array<{ _count: { _all: number } }>, key: keyof any) =>
      rows.reduce<Record<string, number>>((acc, row) => {
        const value = String((row as Record<string, unknown>)[key as string] ?? 'TANPA_DIVISI')
        acc[value] = row._count._all
        return acc
      }, {}) as Record<T, number>

    return successResponse({
      accounts: {
        total: totalAccounts,
        byStatus: countBy(accountsByStatus, 'status'),
        byDivision: countBy(accountsByDivision, 'division'),
      },
      pipeline: {
        total: deals.length,
        byStage: countBy(dealsByStage, 'stage'),
        value: pipelineValue.toFixed(2),
        weightedValue: pipelineWeighted.toFixed(2),
        wonValue: wonValue.toFixed(2),
        valueByDivision: Object.fromEntries(
          Object.entries(valueByDivision).map(([key, value]) => [key, value.toFixed(2)])
        ),
      },
      letters: {
        total: totalLetters,
        thisYear: lettersThisYear,
        thisMonth: lettersThisMonth,
        byType: countBy(lettersByType, 'type'),
      },
      followUps: {
        overdue: overdueFollowUps,
        upcoming: upcomingFollowUps,
      },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn('[mock] Database offline – serving ringkasan CRM dari data seed')
      return successResponse(getMockCrmStats())
    }

    console.error('GET /api/crm/stats failed:', error)
    return serverErrorResponse('Gagal memuat ringkasan CRM.')
  }
}
