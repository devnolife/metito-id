import { CrmAccountStatus, CrmDealStage, QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'

/**
 * Penawaran → project (deal pipeline).
 *
 * Setiap penawaran yang terbit langsung menjadi satu peluang di pipeline agar
 * tim sales tidak perlu mencatat ulang pekerjaannya di CRM. Kaitannya lewat
 * `CrmDeal.quotationId` yang unik, sehingga penerbitan ulang atau revisi
 * memperbarui project yang sama alih-alih menggandakannya.
 *
 * Pelanggan pada penawaran hanya berupa teks bebas (`Quotation.customerName`),
 * sedangkan deal wajib menunjuk `CrmAccount`. Karena itu akun dicari
 * berdasarkan nama tanpa membedakan huruf besar/kecil, lalu dibuat bila belum
 * ada. Akun hasil pembuatan otomatis berstatus PROSPEK dan dapat dilengkapi
 * admin di modul CRM.
 */

/** Mencari akun CRM berdasarkan nama; membuatnya bila belum ada. */
async function findOrCreateAccount(customerName: string): Promise<string> {
  const name = customerName.trim()

  const existing = await db.crmAccount.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
    select: { id: true },
  })
  if (existing) return existing.id

  const created = await db.crmAccount.create({
    data: {
      name,
      status: CrmAccountStatus.PROSPEK,
      leadSource: 'Penawaran',
      notes: 'Dibuat otomatis dari penawaran.',
    },
    select: { id: true },
  })
  return created.id
}

/** Tahap pipeline yang mencerminkan status penawaran saat ini. */
export function stageForQuotationStatus(status: QuotationStatus): CrmDealStage {
  switch (status) {
    case QuotationStatus.WON:
      return CrmDealStage.DEAL
    case QuotationStatus.LOST:
      return CrmDealStage.KALAH
    default:
      return CrmDealStage.PENAWARAN
  }
}

/** Perkiraan peluang menang per tahap, dipakai untuk bobot pipeline. */
function probabilityForStage(stage: CrmDealStage): number {
  switch (stage) {
    case CrmDealStage.DEAL:
      return 100
    case CrmDealStage.KALAH:
      return 0
    default:
      return 50
  }
}

/**
 * Membuat atau memperbarui project milik sebuah penawaran.
 *
 * Dipanggil setelah penawaran terbit. Aman dipanggil berulang: satu penawaran
 * hanya pernah memiliki satu project.
 */
export async function syncQuotationDeal(quotationId: string): Promise<void> {
  const quotation = await db.quotation.findUnique({
    where: { id: quotationId },
    select: {
      id: true,
      status: true,
      subject: true,
      customerName: true,
      total: true,
      issuedAt: true,
      validUntil: true,
      createdBy: { select: { name: true } },
    },
  })

  if (!quotation || !quotation.customerName.trim()) return

  const stage = stageForQuotationStatus(quotation.status)
  const ownerName = quotation.createdBy?.name ?? null
  const existing = await db.crmDeal.findUnique({
    where: { quotationId: quotation.id },
    select: { id: true },
  })

  if (existing) {
    await db.crmDeal.update({
      where: { id: existing.id },
      data: {
        title: quotation.subject,
        estimatedValue: quotation.total,
        stage,
        probability: probabilityForStage(stage),
        targetCloseDate: quotation.validUntil,
        ownerName,
      },
    })
    return
  }

  const accountId = await findOrCreateAccount(quotation.customerName)

  await db.crmDeal.create({
    data: {
      accountId,
      quotationId: quotation.id,
      title: quotation.subject,
      estimatedValue: quotation.total,
      stage,
      probability: probabilityForStage(stage),
      startDate: quotation.issuedAt,
      targetCloseDate: quotation.validUntil,
      ownerName,
      notes: 'Dibuat otomatis dari penawaran.',
    },
  })
}
