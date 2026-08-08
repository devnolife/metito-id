import { Prisma, PrismaClient } from '@prisma/client'
import type { CrmDivision, LetterType } from '@prisma/client'
import {
  SEED_ACCOUNTS,
  SEED_ACTIVITIES,
  SEED_DEALS,
  SEED_LETTERS,
  seedCounterState,
} from '../src/lib/crm-seed-data'

const prisma = new PrismaClient()

/**
 * Seed modul CRM & penomoran surat.
 *
 * Memindahkan isi CRM_Nomor_Surat_METITO_3.xlsx ke database: data pelanggan,
 * pipeline penjualan, log aktivitas, dan register nomor surat.
 *
 * Skrip ini aman dijalankan berulang: bila tabelnya sudah berisi data, impor
 * dilewati agar perubahan yang dibuat lewat aplikasi tidak tertimpa.
 */

async function seedAccountsAndDeals() {
  const existing = await prisma.crmAccount.count()
  if (existing > 0) {
    console.log(`ℹ️  Sudah ada ${existing} pelanggan CRM; impor dilewati agar data tidak tertimpa.`)
    return new Map<string, string>()
  }

  const idByKey = new Map<string, string>()

  for (const account of SEED_ACCOUNTS) {
    const created = await prisma.crmAccount.create({
      data: {
        name: account.name,
        industry: account.industry,
        division: account.division as CrmDivision | null,
        address: account.address,
        picName: account.picName,
        picTitle: account.picTitle,
        phone: account.phone,
        email: account.email,
        leadSource: account.leadSource,
        status: account.status,
        addedAt: account.addedAt ?? new Date(),
      },
      select: { id: true },
    })

    idByKey.set(account.key, created.id)
  }

  console.log(`✅ ${SEED_ACCOUNTS.length} pelanggan CRM diimpor`)

  for (const deal of SEED_DEALS) {
    const accountId = idByKey.get(deal.accountKey)
    if (!accountId) {
      console.warn(`⚠️  Peluang "${deal.title}" dilewati: pelanggan ${deal.accountKey} tidak ada.`)
      continue
    }

    await prisma.crmDeal.create({
      data: {
        accountId,
        title: deal.title,
        division: deal.division as CrmDivision | null,
        estimatedValue: new Prisma.Decimal(deal.estimatedValue),
        stage: deal.stage,
        probability: deal.probability,
        startDate: deal.startDate,
        targetCloseDate: deal.targetCloseDate,
        ownerName: deal.ownerName,
      },
    })
  }

  console.log(`✅ ${SEED_DEALS.length} peluang penjualan diimpor`)

  for (const activity of SEED_ACTIVITIES) {
    await prisma.crmActivity.create({
      data: {
        accountId: activity.accountKey ? (idByKey.get(activity.accountKey) ?? null) : null,
        occurredAt: activity.occurredAt,
        contactName: activity.contactName,
        type: activity.type,
        description: activity.description,
        nextAction: activity.nextAction,
        nextActionDate: activity.nextActionDate,
        ownerName: activity.ownerName,
      },
    })
  }

  if (SEED_ACTIVITIES.length > 0) {
    console.log(`✅ ${SEED_ACTIVITIES.length} aktivitas diimpor`)
  } else {
    console.log('ℹ️  Log Aktivitas hanya berisi baris contoh; tidak ada yang diimpor.')
  }

  return idByKey
}

/**
 * Mencocokkan penerima surat dengan pelanggan yang sudah diimpor.
 *
 * Pencocokan longgar karena nama pada Log Nomor Surat diketik terpisah dari
 * Data Pelanggan ("PT. Indonesia Power" vs "PT. PLN Indonesia Power"). Bila
 * tidak ada yang cocok, surat tetap tersimpan tanpa tautan pelanggan: nomor
 * surat adalah dokumen resmi dan tidak boleh hilang hanya karena namanya beda.
 */
function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(pt|cv|persero|tbk)\b\.?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function seedLetters() {
  const existing = await prisma.letter.count()
  if (existing > 0) {
    console.log(`ℹ️  Sudah ada ${existing} surat; impor register dilewati.`)
    return
  }

  const accounts = await prisma.crmAccount.findMany({ select: { id: true, name: true } })
  const byNormalizedName = new Map(accounts.map((a) => [normalizeName(a.name), a.id]))

  let linked = 0

  for (const letter of SEED_LETTERS) {
    const key = normalizeName(letter.recipient)
    const accountId =
      byNormalizedName.get(key) ??
      [...byNormalizedName.entries()].find(
        ([name]) => name.includes(key) || key.includes(name)
      )?.[1] ??
      null

    if (accountId) linked += 1

    await prisma.letter.create({
      data: {
        number: letter.number,
        seq: letter.seq,
        year: letter.letterDate.getFullYear(),
        type: letter.type as LetterType,
        division: letter.division as CrmDivision | null,
        letterDate: letter.letterDate,
        subject: letter.subject,
        recipient: letter.recipient,
        issuerName: letter.issuerName,
        status: letter.status,
        accountId,
      },
    })
  }

  console.log(`✅ ${SEED_LETTERS.length} nomor surat diimpor (${linked} tertaut ke pelanggan)`)
}

/**
 * Menyetel counter ke nomor tertinggi yang sudah terbit.
 *
 * Tanpa langkah ini, surat berikutnya akan terbit bernomor 001 padahal 001
 * sampai 008 sudah dikirim ke pelanggan.
 */
async function seedCounters() {
  const states = seedCounterState()

  for (const state of states) {
    const where = {
      year_type_division: {
        year: state.year,
        type: state.type as LetterType,
        division: state.division,
      },
    }

    const current = await prisma.letterCounter.findUnique({
      where,
      select: { lastSeq: true },
    })

    if (!current) {
      await prisma.letterCounter.create({
        data: {
          year: state.year,
          type: state.type as LetterType,
          division: state.division,
          lastSeq: state.lastSeq,
        },
      })
    } else if (current.lastSeq < state.lastSeq) {
      // Counter yang sudah lebih tinggi tidak diturunkan: menurunkannya berarti
      // menerbitkan ulang nomor yang sudah dipakai.
      await prisma.letterCounter.update({ where, data: { lastSeq: state.lastSeq } })
    }

    console.log(
      `✅ Counter ${state.type}/${state.division}/${state.year} minimal ${state.lastSeq}`
    )
  }

  // Counter penawaran memakai deret yang sama dengan SPH pada register surat,
  // jadi keduanya harus dimulai dari angka yang sama.
  const sph = states.find((state) => state.type === 'SPH')
  if (sph) {
    const counter = await prisma.quotationCounter.findUnique({
      where: { year: sph.year },
      select: { lastSeq: true },
    })

    if (!counter) {
      await prisma.quotationCounter.create({ data: { year: sph.year, lastSeq: sph.lastSeq } })
      console.log(`✅ Counter penawaran ${sph.year} disetel ke ${sph.lastSeq}`)
    } else if (counter.lastSeq < sph.lastSeq) {
      await prisma.quotationCounter.update({
        where: { year: sph.year },
        data: { lastSeq: sph.lastSeq },
      })
      console.log(
        `✅ Counter penawaran ${sph.year} dinaikkan dari ${counter.lastSeq} ke ${sph.lastSeq}`
      )
    }
  }
}

async function main() {
  console.log('🌱 Mengimpor CRM_Nomor_Surat_METITO_3.xlsx...\n')

  await seedAccountsAndDeals()
  await seedLetters()
  await seedCounters()

  console.log('\n🎉 Impor CRM selesai.')
}

main()
  .catch((error) => {
    console.error('❌ Impor CRM gagal:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
