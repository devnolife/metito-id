/**
 * Data CRM tiruan untuk dipakai saat database tidak dapat dijangkau.
 *
 * Mengikuti pola lib/mock-data.ts yang sudah dipakai halaman publik, sehingga
 * panel admin tetap dapat ditelusuri sebelum PostgreSQL tersedia.
 *
 * Isinya diturunkan dari lib/crm-seed-data.ts, yaitu data asli
 * CRM_Nomor_Surat_METITO_3.xlsx. Dengan begitu tampilan tanpa database sama
 * dengan tampilan setelah `npm run db:seed:crm` dijalankan, dan tidak ada data
 * karangan yang bisa disangka nyata.
 *
 * Hanya untuk operasi baca. Menyimpan tetap memerlukan database sungguhan;
 * kegagalannya sengaja tidak disamarkan agar tidak ada perubahan yang dikira
 * tersimpan padahal hilang.
 */

import {
  SEED_ACCOUNTS,
  SEED_ACTIVITIES,
  SEED_DEALS,
  SEED_LETTERS,
} from './crm-seed-data'
import { weightedValue } from './crm-labels'

const now = new Date()

function accountId(key: string): string {
  return `mock-account-${key}`
}

export function getMockAccounts() {
  return SEED_ACCOUNTS.map((account) => ({
    id: accountId(account.key),
    name: account.name,
    industry: account.industry,
    division: account.division,
    address: account.address,
    picName: account.picName,
    picTitle: account.picTitle,
    phone: account.phone,
    email: account.email,
    leadSource: account.leadSource,
    status: account.status,
    addedAt: account.addedAt ?? now,
    notes: null,
    createdAt: now,
    updatedAt: now,
    _count: {
      deals: SEED_DEALS.filter((deal) => deal.accountKey === account.key).length,
      activities: SEED_ACTIVITIES.filter((a) => a.accountKey === account.key).length,
      letters: SEED_LETTERS.filter((letter) =>
        normalize(letter.recipient).includes(normalize(account.name).split(' ')[0] ?? '')
      ).length,
    },
  }))
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(pt|cv|persero|tbk)\b\.?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getMockDeals() {
  return SEED_DEALS.map((deal, index) => {
    const account = SEED_ACCOUNTS.find((item) => item.key === deal.accountKey)

    return {
      id: `mock-deal-${index + 1}`,
      accountId: accountId(deal.accountKey),
      title: deal.title,
      division: deal.division,
      estimatedValue: deal.estimatedValue.toFixed(2),
      stage: deal.stage,
      probability: deal.probability,
      startDate: deal.startDate,
      targetCloseDate: deal.targetCloseDate,
      ownerName: deal.ownerName,
      notes: null,
      quotationId: null,
      createdAt: now,
      updatedAt: now,
      account: account
        ? { id: accountId(account.key), name: account.name, status: account.status }
        : null,
      quotation: null,
      weightedValue: weightedValue(
        deal.estimatedValue,
        deal.probability,
        deal.stage
      ).toFixed(2),
    }
  })
}

export function getMockActivities() {
  return SEED_ACTIVITIES.map((activity, index) => ({
    id: `mock-activity-${index + 1}`,
    accountId: activity.accountKey ? accountId(activity.accountKey) : null,
    dealId: null,
    occurredAt: activity.occurredAt,
    contactName: activity.contactName,
    type: activity.type,
    description: activity.description,
    nextAction: activity.nextAction,
    nextActionDate: activity.nextActionDate,
    ownerName: activity.ownerName,
    createdById: null,
    createdAt: now,
    updatedAt: now,
    account: null,
    deal: null,
  }))
}

export function getMockLetters() {
  return SEED_LETTERS.map((letter, index) => ({
    id: `mock-letter-${index + 1}`,
    number: letter.number,
    seq: letter.seq,
    year: letter.letterDate.getFullYear(),
    type: letter.type,
    division: letter.division,
    letterDate: letter.letterDate,
    subject: letter.subject,
    recipient: letter.recipient,
    issuerName: letter.issuerName,
    status: letter.status,
    notes: null,
    accountId: null,
    quotationId: null,
    createdById: null,
    createdAt: now,
    updatedAt: now,
    account: null,
    quotation: null,
  })).sort((a, b) => b.letterDate.getTime() - a.letterDate.getTime())
}

/** Bentuk paginasi yang sama dengan jalur database, tanpa memotong data. */
export function mockPagination(total: number) {
  return { page: 1, limit: total, total, totalPages: 1 }
}

export function getMockCrmStats() {
  const deals = getMockDeals()
  const letters = getMockLetters()
  const currentYear = now.getFullYear()

  const byStatus: Record<string, number> = {}
  const byDivision: Record<string, number> = {}
  for (const account of SEED_ACCOUNTS) {
    byStatus[account.status] = (byStatus[account.status] ?? 0) + 1
    const division = account.division ?? 'TANPA_DIVISI'
    byDivision[division] = (byDivision[division] ?? 0) + 1
  }

  const byStage: Record<string, number> = {}
  const valueByDivision: Record<string, number> = {}
  let pipelineValue = 0
  let pipelineWeighted = 0
  let wonValue = 0

  for (const deal of deals) {
    byStage[deal.stage] = (byStage[deal.stage] ?? 0) + 1
    const value = Number(deal.estimatedValue)

    if (deal.stage === 'DEAL') wonValue += value
    if (deal.stage !== 'KALAH') {
      pipelineValue += value
      pipelineWeighted += Number(deal.weightedValue)
      const key = deal.division ?? 'TANPA_DIVISI'
      valueByDivision[key] = (valueByDivision[key] ?? 0) + value
    }
  }

  const byType: Record<string, number> = {}
  for (const letter of letters) {
    byType[letter.type] = (byType[letter.type] ?? 0) + 1
  }

  return {
    accounts: { total: SEED_ACCOUNTS.length, byStatus, byDivision },
    pipeline: {
      total: deals.length,
      byStage,
      value: pipelineValue.toFixed(2),
      weightedValue: pipelineWeighted.toFixed(2),
      wonValue: wonValue.toFixed(2),
      valueByDivision: Object.fromEntries(
        Object.entries(valueByDivision).map(([key, value]) => [key, value.toFixed(2)])
      ),
    },
    letters: {
      total: letters.length,
      thisYear: letters.filter((letter) => letter.year === currentYear).length,
      thisMonth: letters.filter(
        (letter) =>
          letter.letterDate.getFullYear() === currentYear &&
          letter.letterDate.getMonth() === now.getMonth()
      ).length,
      byType,
    },
    followUps: { overdue: 0, upcoming: 0 },
  }
}
