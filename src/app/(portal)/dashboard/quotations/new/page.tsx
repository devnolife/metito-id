import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { getQuotationSettings } from '@/lib/quotation-settings'
import { QuotationForm } from '@/components/admin/quotations/quotation-form'

export const dynamic = 'force-dynamic'

/**
 * Nilai awal syarat & ketentuan diambil dari penawaran terakhir, karena Franco,
 * Delivery Time, dan Terms of Payment jarang berubah antar penawaran.
 * Perihal dan Attn sengaja tidak ikut disalin agar wajib diisi ulang.
 */
async function loadDefaults() {
  const settings = await getQuotationSettings()

  try {
    const last = await db.quotation.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        franco: true,
        deliveryTime: true,
        termsOfPayment: true,
        validityDays: true,
        vatRate: true,
      },
    })

    return {
      franco: last?.franco ?? settings.franco,
      deliveryTime: last?.deliveryTime ?? settings.deliveryTime,
      termsOfPayment: last?.termsOfPayment ?? settings.termsOfPayment,
      validityDays: last?.validityDays ?? settings.validityDays,
      vatRate: last?.vatRate?.toString() ?? settings.vatRate,
    }
  } catch {
    return {
      franco: settings.franco,
      deliveryTime: settings.deliveryTime,
      termsOfPayment: settings.termsOfPayment,
      validityDays: settings.validityDays,
      vatRate: settings.vatRate,
    }
  }
}

export default async function NewQuotationPage() {
  const defaults = await loadDefaults()

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard/quotations"
          className="inline-flex items-center text-sm text-body-text hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke daftar
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Buat Penawaran</h1>
        <p className="text-sm text-body-text">
          Nomor surat akan dibuat otomatis saat penawaran diterbitkan.
        </p>
      </div>

      <QuotationForm defaults={defaults} />
    </div>
  )
}
