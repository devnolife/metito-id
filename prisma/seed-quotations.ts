import { Prisma, PrismaClient, QuotationStatus } from '@prisma/client'
import { computeTotals } from '../src/lib/quotation-math'
import { terbilangRupiah } from '../src/lib/terbilang'
import { formatQuotationNumber } from '../src/lib/quotation-number'
import {
  QUOTATION_SETTING_DEFAULTS,
  QUOTATION_SETTING_KEYS,
} from '../src/lib/quotation-settings'
import { SEED_VAT_RATE, orderedSeedQuotations } from '../src/lib/quotation-seed-data'

const prisma = new PrismaClient()

/**
 * Seed modul penawaran.
 *
 * Memindahkan isi Quotation 2026.xlsx ke database dan menyimpan nilai kop,
 * rekening, serta penanda tangan sebagai Setting.
 *
 * Baris contoh pada Log_Penomoran_Surat_Penawaran_METITO.xlsx sengaja tidak
 * ikut diimpor karena berlabel "Contoh - silakan hapus/ganti".
 */

async function seedSettings() {
  const entries: Array<[string, string, string]> = [
    [QUOTATION_SETTING_KEYS.docCode, QUOTATION_SETTING_DEFAULTS.docCode, 'Kode dokumen penawaran'],
    [QUOTATION_SETTING_KEYS.companyCode, QUOTATION_SETTING_DEFAULTS.companyCode, 'Kode perusahaan pada nomor surat'],
    [QUOTATION_SETTING_KEYS.vatRate, QUOTATION_SETTING_DEFAULTS.vatRate, 'Tarif PPN (desimal, mis. 0.11)'],
    [QUOTATION_SETTING_KEYS.bankName, QUOTATION_SETTING_DEFAULTS.bankName, 'Nama bank'],
    [QUOTATION_SETTING_KEYS.bankAccount, QUOTATION_SETTING_DEFAULTS.bankAccount, 'Nomor rekening'],
    [QUOTATION_SETTING_KEYS.bankBranch, QUOTATION_SETTING_DEFAULTS.bankBranch, 'Cabang bank'],
    [QUOTATION_SETTING_KEYS.signerName, QUOTATION_SETTING_DEFAULTS.signerName, 'Nama penanda tangan'],
    [QUOTATION_SETTING_KEYS.signerTitle, QUOTATION_SETTING_DEFAULTS.signerTitle, 'Jabatan penanda tangan'],
    [QUOTATION_SETTING_KEYS.termsOfPayment, QUOTATION_SETTING_DEFAULTS.termsOfPayment, 'Terms of payment baku'],
    [QUOTATION_SETTING_KEYS.validityDays, String(QUOTATION_SETTING_DEFAULTS.validityDays), 'Masa berlaku baku (hari)'],
  ]

  for (const [key, value, label] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { label, category: 'quotation' },
      create: { key, value, label, category: 'quotation', type: 'string' },
    })
  }

  console.log(`✅ ${entries.length} setting penawaran disiapkan`)
}

async function seedQuotations() {
  const admin =
    (await prisma.user.findFirst({ where: { role: 'ADMIN' } })) ??
    (await prisma.user.findFirst())

  if (!admin) {
    console.warn('⚠️  Tidak ada user di database; impor penawaran dilewati.')
    return
  }

  const existing = await prisma.quotation.count()
  if (existing > 0) {
    console.log(`ℹ️  Sudah ada ${existing} penawaran; impor dilewati agar tidak menimpa data.`)
    return
  }

  // Diurutkan berdasarkan tanggal supaya nomor urut mencerminkan urutan terbit.
  const ordered = orderedSeedQuotations()

  let seq = 0

  for (const source of ordered) {
    seq += 1

    const totals = computeTotals(
      source.items.map((item) => ({ qty: item.qty, unitPrice: item.unitPrice })),
      SEED_VAT_RATE
    )

    const numberBase = formatQuotationNumber({ seq, issuedAt: source.issuedAt })
    const validUntil = new Date(source.issuedAt)
    validUntil.setDate(validUntil.getDate() + QUOTATION_SETTING_DEFAULTS.validityDays)

    const notes = [
      `Diimpor dari Quotation 2026.xlsx. Nomor asli: ${source.originalNumber}.`,
      source.subjectNote,
    ]
      .filter(Boolean)
      .join(' ')

    await prisma.quotation.create({
      data: {
        status: QuotationStatus.SENT,
        seq,
        numberBase,
        issuedAt: source.issuedAt,
        quoteDate: source.issuedAt,
        validUntil,
        customerName: source.customerName,
        attn: source.attn,
        subject: source.subject,
        franco: source.franco,
        deliveryTime: source.deliveryTime,
        termsOfPayment: source.termsOfPayment,
        validityDays: QUOTATION_SETTING_DEFAULTS.validityDays,
        vatRate: new Prisma.Decimal(SEED_VAT_RATE),
        subtotal: totals.subtotal,
        vatAmount: totals.vatAmount,
        total: totals.total,
        // Terbilang dihitung ulang, sehingga sheet kimia yang tadinya tertulis
        // "Dua Ratus Enam Puluh Juta ..." kini sesuai totalnya sendiri.
        amountInWords: terbilangRupiah(totals.total.toFixed(0)),
        notes,
        createdById: admin.id,
        items: {
          create: source.items.map((item, index) => ({
            lineNo: index + 1,
            materialCode: item.materialCode,
            brand: item.brand,
            type: item.type,
            qty: new Prisma.Decimal(item.qty),
            unit: item.unit,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            lineTotal: totals.lineTotals[index],
          })),
        },
      },
    })

    console.log(`   ${numberBase} — ${source.subject} — ${totals.total.toFixed(0)}`)
  }

  await prisma.quotationCounter.upsert({
    where: { year: ordered[0].issuedAt.getFullYear() },
    update: { lastSeq: seq },
    create: { year: ordered[0].issuedAt.getFullYear(), lastSeq: seq },
  })

  console.log(`✅ ${seq} penawaran diimpor, counter tahun disetel ke ${seq}`)
}

async function main() {
  console.log('🌱 Seeding modul penawaran...')
  await seedSettings()
  await seedQuotations()
}

main()
  .catch((error) => {
    console.error('❌ Gagal seeding penawaran:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
