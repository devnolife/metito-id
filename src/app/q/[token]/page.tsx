import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QuotationStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { COMPANY, CONTACT } from '@/lib/company-profile'
import { getQuotationSettings } from '@/lib/quotation-settings'
import { displayStatus } from '@/lib/quotation-status'
import { withRevision } from '@/lib/quotation-number'
import { QuotationDocument } from '@/components/quotations/quotation-document'
import { RecordView } from '@/components/quotations/record-view'
import { PrintButton } from '@/components/quotations/print-button'

type PageProps = { params: Promise<{ token: string }> }

// Tautan penawaran bersifat privat; jangan sampai terindeks mesin pencari.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type LoadResult =
  | { kind: 'ok'; quotation: NonNullable<Awaited<ReturnType<typeof findQuotation>>> }
  | { kind: 'missing' }
  | { kind: 'unavailable' }

function findQuotation(token: string) {
  return db.quotation.findUnique({
    where: { publicToken: token },
    include: { items: { orderBy: { lineNo: 'asc' } } },
  })
}

async function loadQuotation(token: string): Promise<LoadResult> {
  try {
    const quotation = await findQuotation(token)

    // Draft tidak pernah boleh terlihat publik, meski tokennya tertebak.
    if (!quotation || quotation.status === QuotationStatus.DRAFT) {
      return { kind: 'missing' }
    }

    return { kind: 'ok', quotation }
  } catch (error) {
    // Database tidak dapat dijangkau. Pelanggan tidak boleh melihat error
    // mentah pada tautan yang kita kirim sendiri.
    console.error('[q] gagal memuat penawaran publik:', error)
    return { kind: 'unavailable' }
  }
}

export default async function PublicQuotationPage({ params }: PageProps) {
  const { token } = await params
  const [result, settings] = await Promise.all([loadQuotation(token), getQuotationSettings()])

  if (result.kind === 'unavailable') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
          <h1 className="text-lg font-bold text-slate-900">Penawaran sedang tidak dapat dibuka</h1>
          <p className="mt-2 text-sm text-slate-600">
            Terjadi gangguan sementara pada sistem kami. Silakan coba beberapa saat lagi, atau
            hubungi {CONTACT.phones[0]} bila mendesak.
          </p>
        </div>
      </div>
    )
  }

  if (result.kind === 'missing') notFound()

  const quotation = result.quotation

  const status = displayStatus(quotation.status, quotation.validUntil)
  const nomor = quotation.numberBase
    ? withRevision(quotation.numberBase, quotation.revision)
    : '-'

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
      <RecordView token={token} />

      <div className="no-print mx-auto mb-6 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            Penawaran {nomor} &mdash; {COMPANY.brandName}
          </div>
          {status === 'EXPIRED' && (
            <div className="mt-1 text-sm font-medium text-amber-700">
              Masa berlaku penawaran ini sudah lewat. Silakan hubungi kami untuk penawaran terbaru.
            </div>
          )}
        </div>
        <PrintButton className="bg-slate-900 text-white hover:bg-slate-700" />
      </div>

      <QuotationDocument
        quotation={{
          numberBase: quotation.numberBase,
          revision: quotation.revision,
          quoteDate: quotation.quoteDate,
          issuedAt: quotation.issuedAt,
          validUntil: quotation.validUntil,
          customerName: quotation.customerName,
          attn: quotation.attn,
          subject: quotation.subject,
          franco: quotation.franco,
          deliveryTime: quotation.deliveryTime,
          termsOfPayment: quotation.termsOfPayment,
          priceIncludeNote: quotation.priceIncludeNote,
          validityDays: quotation.validityDays,
          vatRate: quotation.vatRate.toString(),
          subtotal: quotation.subtotal.toString(),
          vatAmount: quotation.vatAmount.toString(),
          total: quotation.total.toString(),
          amountInWords: quotation.amountInWords,
          items: quotation.items.map((item) => ({
            id: item.id,
            lineNo: item.lineNo,
            materialCode: item.materialCode,
            brand: item.brand,
            type: item.type,
            qty: item.qty.toString(),
            unit: item.unit,
            unitPrice: item.unitPrice.toString(),
            lineTotal: item.lineTotal.toString(),
          })),
        }}
        settings={settings}
      />
    </div>
  )
}
