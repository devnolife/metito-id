import Image from 'next/image'
import { COMPANY, CONTACT } from '@/lib/company-profile'
import type { QuotationSettings } from '@/lib/quotation-settings'
import { formatRupiah } from '@/lib/quotation-math'
import { withRevision } from '@/lib/quotation-number'

/**
 * Tampilan dokumen surat penawaran.
 *
 * Sengaja memakai kertas putih dan teks hitam, terlepas dari tema gelap situs,
 * karena komponen ini juga yang dicetak menjadi PDF lewat print browser.
 * Susunannya mengikuti berkas Excel yang selama ini dipakai agar pelanggan
 * menerima dokumen yang bentuknya sudah dikenal.
 */

export interface QuotationDocumentItem {
  id: string
  lineNo: number
  materialCode: string
  brand: string | null
  type: string | null
  qty: string
  unit: string
  unitPrice: string
  lineTotal: string
}

export interface QuotationDocumentData {
  numberBase: string | null
  revision: number
  quoteDate: string | Date
  issuedAt: string | Date | null
  validUntil: string | Date | null
  customerName: string
  attn: string | null
  subject: string
  franco: string | null
  deliveryTime: string | null
  termsOfPayment: string | null
  priceIncludeNote: string | null
  validityDays: number
  vatRate: string
  subtotal: string
  vatAmount: string
  total: string
  amountInWords: string
  items: QuotationDocumentItem[]
}

function formatDate(value: string | Date | null): string {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatQty(value: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(n)
}

function vatPercentLabel(vatRate: string): string {
  const n = Number(vatRate)
  if (!Number.isFinite(n)) return 'PPN'
  return `PPN ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(n * 100)}%`
}

interface Props {
  quotation: QuotationDocumentData
  settings: QuotationSettings
}

export function QuotationDocument({ quotation, settings }: Props) {
  const nomor = quotation.numberBase
    ? withRevision(quotation.numberBase, quotation.revision)
    : 'DRAFT — belum bernomor'

  return (
    <article className="quotation-paper mx-auto w-full max-w-[210mm] bg-white px-10 py-10 text-[13px] leading-relaxed text-slate-900 shadow-lg print:max-w-none print:px-0 print:py-0 print:shadow-none">
      {/* Kop surat */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={COMPANY.brandName} width={56} height={56} />
          <div>
            <div className="text-xl font-bold tracking-wide text-slate-900">{COMPANY.shortName}</div>
            <div className="text-[11px] text-slate-600">{COMPANY.abbreviationOf}</div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <div>{CONTACT.address.full}</div>
          <div>{CONTACT.phones.join('  |  ')}</div>
          <div>
            {CONTACT.website} | {CONTACT.email}
          </div>
        </div>
      </header>

      <h1 className="mt-6 text-center text-lg font-bold uppercase tracking-[0.2em] text-slate-900">
        Sales Quotation
      </h1>

      {/* Identitas dokumen */}
      <section className="mt-6 grid grid-cols-2 gap-x-10 gap-y-1">
        <dl className="space-y-1">
          <Row label="Date" value={formatDate(quotation.issuedAt ?? quotation.quoteDate)} />
          <Row label="Quotation No." value={nomor} strong />
        </dl>
        <dl className="space-y-1">
          <Row label="Kepada Yth" value={quotation.customerName} />
          <Row label="Attn" value={quotation.attn || '-'} />
          <Row label="Perihal" value={quotation.subject} />
        </dl>
      </section>

      {/* Tabel item */}
      <table className="mt-6 w-full border-collapse text-[12px]">
        <thead>
          <tr className="bg-slate-100">
            <Th className="w-10 text-center">No</Th>
            <Th className="w-48">Kode Material</Th>
            <Th>Description</Th>
            <Th className="w-20 text-right">Qty</Th>
            <Th className="w-16">Unit</Th>
            <Th className="w-32 text-right">Unit Price</Th>
            <Th className="w-36 text-right">Total Price</Th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((item) => (
            <tr key={item.id} className="align-top">
              <Td className="text-center">{item.lineNo}</Td>
              <Td className="font-medium">{item.materialCode}</Td>
              <Td>
                {item.brand && (
                  <div>
                    <span className="inline-block w-14 text-slate-500">Brand</span>: {item.brand}
                  </div>
                )}
                {item.type && (
                  <div>
                    <span className="inline-block w-14 text-slate-500">Type</span>: {item.type}
                  </div>
                )}
              </Td>
              <Td className="text-right">{formatQty(item.qty)}</Td>
              <Td>{item.unit}</Td>
              <Td className="text-right">{formatRupiah(item.unitPrice)}</Td>
              <Td className="text-right">{formatRupiah(item.lineTotal)}</Td>
            </tr>
          ))}

          {quotation.items.length === 0 && (
            <tr>
              <Td className="text-center text-slate-400" colSpan={7}>
                Belum ada item.
              </Td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <Td className="text-right font-semibold" colSpan={6}>
              Jumlah
            </Td>
            <Td className="text-right font-semibold">{formatRupiah(quotation.subtotal)}</Td>
          </tr>
          <tr>
            <Td className="text-right font-semibold" colSpan={6}>
              {vatPercentLabel(quotation.vatRate)}
            </Td>
            <Td className="text-right font-semibold">{formatRupiah(quotation.vatAmount)}</Td>
          </tr>
          <tr className="bg-slate-100">
            <Td className="text-right text-[13px] font-bold" colSpan={6}>
              Total
            </Td>
            <Td className="text-right text-[13px] font-bold">{formatRupiah(quotation.total)}</Td>
          </tr>
        </tfoot>
      </table>

      {/* Terbilang selalu diturunkan dari total, tidak pernah diketik manual. */}
      <p className="mt-3 text-[12px]">
        <span className="font-semibold">Terbilang</span> : <em>{quotation.amountInWords}</em>
      </p>

      {/* Syarat dan ketentuan */}
      <section className="mt-6">
        <h2 className="text-[12px] font-bold text-slate-900">
          Syarat dan Ketentuan (Commercial Terms and Conditions)
        </h2>
        <ol className="mt-2 space-y-1 text-[12px]">
          <TermRow
            index={1}
            label="Price"
            value={
              quotation.priceIncludeNote ||
              `Belum termasuk ${vatPercentLabel(quotation.vatRate)} (ditambahkan pada total)`
            }
          />
          <TermRow index={2} label="Franco" value={quotation.franco || '-'} />
          <TermRow index={3} label="Delivery Time" value={quotation.deliveryTime || '-'} />
          <TermRow index={4} label="Terms Of Payment" value={quotation.termsOfPayment || '-'} />
          <TermRow
            index={5}
            label="Quotation Validity"
            value={`${quotation.validityDays} hari${
              quotation.validUntil ? ` (s.d. ${formatDate(quotation.validUntil)})` : ''
            }`}
          />
        </ol>
      </section>

      {/* Rekening pembayaran */}
      <section className="mt-6 text-[12px]">
        <h2 className="font-bold text-slate-900">Rekening Pembayaran</h2>
        <dl className="mt-2 space-y-1">
          <Row label="Bank" value={settings.bankName} />
          <Row label="No. Rekening" value={settings.bankAccount} />
          <Row label="Cabang" value={settings.bankBranch} />
        </dl>
      </section>

      <p className="mt-6 text-justify text-[12px] text-slate-700">
        Terima kasih atas kepercayaan Anda kepada layanan dan penjualan kami. Kami berharap
        penawaran di atas sesuai dengan kebutuhan Anda. Apabila memerlukan klarifikasi lebih
        lanjut, jangan ragu untuk menghubungi kami.
      </p>

      <section className="mt-10 text-[12px]">
        <div>Hormat Kami,</div>
        <div className="mt-14 font-semibold">{settings.signerName}</div>
        <div className="text-slate-600">{settings.signerTitle}</div>
      </section>
    </article>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-slate-600">{label}</dt>
      <dd className={strong ? 'font-semibold' : undefined}>: {value}</dd>
    </div>
  )
}

function TermRow({ index, label, value }: { index: number; label: string; value: string }) {
  return (
    <li className="flex gap-2">
      <span className="w-5 shrink-0">{index}.</span>
      <span className="w-40 shrink-0">{label}</span>
      <span>: {value}</span>
    </li>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`border border-slate-300 px-2 py-1.5 text-left font-semibold ${className}`}>
      {children}
    </th>
  )
}

function Td({
  children,
  className = '',
  colSpan,
}: {
  children: React.ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td colSpan={colSpan} className={`border border-slate-300 px-2 py-1.5 ${className}`}>
      {children}
    </td>
  )
}
