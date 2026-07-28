import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Eye } from 'lucide-react'
import { db } from '@/lib/db'
import { getQuotationSettings } from '@/lib/quotation-settings'
import { STATUS_LABEL, displayStatus } from '@/lib/quotation-status'
import { withRevision } from '@/lib/quotation-number'
import { QuotationDocument } from '@/components/quotations/quotation-document'
import { QuotationActions } from '@/components/admin/quotations/quotation-actions'
import { Badge } from '@/components/ui/badge'

type PageProps = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

function formatDate(value: Date | null): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value)
}

function formatRupiah(value: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)}`
}

export default async function QuotationDetailPage({ params }: PageProps) {
  const { id } = await params

  const [quotation, settings] = await Promise.all([
    db.quotation.findUnique({
      where: { id },
      include: {
        items: { orderBy: { lineNo: 'asc' } },
        createdBy: { select: { name: true } },
        revisions: { select: { id: true, revision: true }, orderBy: { revision: 'asc' } },
        parent: { select: { id: true, numberBase: true, revision: true } },
      },
    }),
    getQuotationSettings(),
  ])

  if (!quotation) notFound()

  const status = displayStatus(quotation.status, quotation.validUntil)
  const numberDisplay = quotation.numberBase
    ? withRevision(quotation.numberBase, quotation.revision)
    : 'Draft (belum bernomor)'

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/quotations"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke daftar
          </Link>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold text-gray-900">
            {numberDisplay}
            <Badge variant="outline">{STATUS_LABEL[status]}</Badge>
          </h1>
          <p className="text-sm text-gray-600">
            {quotation.customerName} &middot; dibuat oleh {quotation.createdBy?.name ?? '-'}
          </p>

          {quotation.firstViewedAt && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-700">
              <Eye className="h-4 w-4" />
              Dibuka pelanggan {formatDate(quotation.firstViewedAt)} ({quotation.viewCount}x)
            </p>
          )}

          {quotation.parent && (
            <p className="mt-1 text-sm text-gray-600">
              Revisi dari{' '}
              <Link
                href={`/admin/quotations/${quotation.parent.id}`}
                className="text-blue-700 hover:underline"
              >
                {quotation.parent.numberBase}
              </Link>
            </p>
          )}

          {quotation.revisions.length > 0 && (
            <p className="mt-1 text-sm text-amber-700">
              Sudah digantikan oleh Rev.
              {quotation.revisions[quotation.revisions.length - 1].revision}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto">
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

        <aside className="space-y-4">
          <QuotationActions
            id={quotation.id}
            status={status}
            numberDisplay={numberDisplay}
            totalLabel={formatRupiah(quotation.total.toString())}
            validUntilLabel={formatDate(quotation.validUntil)}
            publicToken={quotation.publicToken}
            hasRevisions={quotation.revisions.length > 0}
          />
        </aside>
      </div>
    </div>
  )
}
