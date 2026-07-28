'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { terbilangRupiah } from '@/lib/terbilang'

/**
 * Form pembuat penawaran.
 *
 * Urutan isian mengikuti berkas Excel yang selama ini dipakai, sehingga sales
 * tidak perlu belajar ulang.
 *
 * Catatan perhitungan: angka di layar dihitung dengan aritmetika biasa sebagai
 * pratinjau. Nilai yang mengikat selalu dihitung ulang di server memakai
 * Decimal, jadi pratinjau tidak pernah menjadi sumber kebenaran.
 */

interface ItemRow {
  key: string
  materialCode: string
  brand: string
  type: string
  qty: string
  unit: string
  unitPrice: string
}

interface Suggestion {
  materialCode: string
  brand: string | null
  type: string | null
  unit: string
  lastUnitPrice: string
}

interface Props {
  /** Nilai awal untuk syarat & ketentuan, diambil dari penawaran terakhir. */
  defaults: {
    franco: string
    deliveryTime: string
    termsOfPayment: string
    validityDays: number
    vatRate: string
  }
}

const emptyRow = (): ItemRow => ({
  key: Math.random().toString(36).slice(2),
  materialCode: '',
  brand: '',
  type: '',
  qty: '',
  unit: '',
  unitPrice: '',
})

const isRowEmpty = (row: ItemRow) =>
  !row.materialCode.trim() && !row.qty.trim() && !row.unitPrice.trim() && !row.brand.trim()

function toNumber(value: string): number {
  const n = Number(value.replace(/\s/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatRupiah(value: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(value))}`
}

export function QuotationForm({ defaults }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const [customerName, setCustomerName] = useState('')
  const [attn, setAttn] = useState('')
  const [subject, setSubject] = useState('')
  const [quoteDate, setQuoteDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [franco, setFranco] = useState(defaults.franco)
  const [deliveryTime, setDeliveryTime] = useState(defaults.deliveryTime)
  const [termsOfPayment, setTermsOfPayment] = useState(defaults.termsOfPayment)
  const [validityDays, setValidityDays] = useState(String(defaults.validityDays))
  const [vatRate, setVatRate] = useState(defaults.vatRate)
  const [notes, setNotes] = useState('')
  const [rows, setRows] = useState<ItemRow[]>([emptyRow()])
  const [saving, setSaving] = useState(false)

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const suggestionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Baris kosong terakhir selalu tersedia, jadi tidak perlu klik "Tambah".
  useEffect(() => {
    const last = rows[rows.length - 1]
    if (last && !isRowEmpty(last)) {
      setRows((current) => [...current, emptyRow()])
    }
  }, [rows])

  const fetchSuggestions = useCallback((query: string) => {
    if (suggestionTimer.current) clearTimeout(suggestionTimer.current)
    suggestionTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/quotations/item-suggestions?q=${encodeURIComponent(query)}`
        )
        const payload = await response.json()
        if (payload.success) setSuggestions(payload.data)
      } catch {
        setSuggestions([])
      }
    }, 200)
  }, [])

  const updateRow = (key: string, patch: Partial<ItemRow>) => {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  const removeRow = (key: string) => {
    setRows((current) => {
      const next = current.filter((row) => row.key !== key)
      return next.length > 0 ? next : [emptyRow()]
    })
  }

  const applySuggestion = (key: string, suggestion: Suggestion) => {
    updateRow(key, {
      materialCode: suggestion.materialCode,
      brand: suggestion.brand ?? '',
      type: suggestion.type ?? '',
      unit: suggestion.unit,
      unitPrice: String(Number(suggestion.lastUnitPrice)),
    })
    setActiveRow(null)
  }

  const filledRows = useMemo(() => rows.filter((row) => !isRowEmpty(row)), [rows])

  const totals = useMemo(() => {
    const lineTotals = filledRows.map((row) => toNumber(row.qty) * toNumber(row.unitPrice))
    const subtotal = lineTotals.reduce((sum, value) => sum + value, 0)
    const vat = Math.round(subtotal * toNumber(vatRate))
    return { lineTotals, subtotal, vat, total: subtotal + vat }
  }, [filledRows, vatRate])

  const buildPayload = () => ({
    customerName: customerName.trim(),
    attn: attn.trim() || null,
    subject: subject.trim(),
    quoteDate,
    franco: franco.trim() || null,
    deliveryTime: deliveryTime.trim() || null,
    termsOfPayment: termsOfPayment.trim() || null,
    validityDays: Number(validityDays) || 30,
    vatRate: vatRate || '0.11',
    notes: notes.trim() || null,
    items: filledRows.map((row) => ({
      materialCode: row.materialCode.trim(),
      brand: row.brand.trim() || null,
      type: row.type.trim() || null,
      qty: String(toNumber(row.qty)),
      unit: row.unit.trim() || 'unit',
      unitPrice: String(toNumber(row.unitPrice)),
    })),
  })

  const validate = (): string | null => {
    if (!customerName.trim()) return 'Nama pelanggan wajib diisi.'
    if (!subject.trim()) return 'Perihal wajib diisi.'
    if (filledRows.length === 0) return 'Tambahkan minimal satu item.'
    for (const [index, row] of filledRows.entries()) {
      if (!row.materialCode.trim()) return `Baris ${index + 1}: kode material wajib diisi.`
      if (toNumber(row.qty) <= 0) return `Baris ${index + 1}: qty harus lebih dari nol.`
    }
    return null
  }

  const submit = async (issue: boolean) => {
    const problem = validate()
    if (problem) {
      toast({ title: 'Belum bisa disimpan', description: problem, variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal menyimpan penawaran')
      }

      const id: string = payload.data.id

      if (!issue) {
        toast({ title: 'Draft tersimpan', description: 'Penawaran belum bernomor.' })
        router.push(`/admin/quotations/${id}`)
        return
      }

      const issued = await fetch(`/api/quotations/${id}/issue`, { method: 'POST' })
      const issuedPayload = await issued.json()

      if (!issued.ok || !issuedPayload.success) {
        toast({
          title: 'Draft tersimpan, tapi gagal diterbitkan',
          description: issuedPayload.error || 'Coba terbitkan lagi dari halaman detail.',
          variant: 'destructive',
        })
        router.push(`/admin/quotations/${id}`)
        return
      }

      toast({
        title: 'Penawaran diterbitkan',
        description: `Nomor ${issuedPayload.data.numberBase}`,
      })
      router.push(`/admin/quotations/${id}`)
    } catch (error) {
      toast({
        title: 'Gagal menyimpan',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Identitas dokumen */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Identitas Penawaran</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tanggal">
            <Input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} />
          </Field>
          <Field label="Kepada Yth *">
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="PT. PLN Nusantara Power"
            />
          </Field>
          <Field label="Attn">
            <Input value={attn} onChange={(e) => setAttn(e.target.value)} placeholder="Hendro" />
          </Field>
          <Field label="Perihal *">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Pengadaan Cable Instrument"
            />
          </Field>
        </div>
      </section>

      {/* Item */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 font-semibold text-gray-900">Item Penawaran</h2>
        <p className="mb-4 text-sm text-gray-600">
          Ketik kode material untuk melihat brand, type, dan harga terakhir dari penawaran
          sebelumnya. Baris baru muncul sendiri.
        </p>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="relative grid grid-cols-1 gap-2 rounded-md border border-gray-200 p-3 md:grid-cols-12"
            >
              <div className="md:col-span-1">
                <span className="text-sm font-medium text-gray-500">{index + 1}</span>
              </div>

              <div className="relative md:col-span-3">
                <Input
                  value={row.materialCode}
                  placeholder="Kode material"
                  onChange={(e) => {
                    updateRow(row.key, { materialCode: e.target.value })
                    setActiveRow(row.key)
                    fetchSuggestions(e.target.value)
                  }}
                  onFocus={() => {
                    setActiveRow(row.key)
                    fetchSuggestions(row.materialCode)
                  }}
                  onBlur={() => setTimeout(() => setActiveRow(null), 150)}
                />
                {activeRow === row.key && suggestions.length > 0 && (
                  <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {suggestions.map((suggestion, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            applySuggestion(row.key, suggestion)
                          }}
                        >
                          <span className="font-medium">{suggestion.materialCode}</span>
                          <span className="text-gray-500">
                            {suggestion.brand ? ` · ${suggestion.brand}` : ''}
                            {` · ${formatRupiah(Number(suggestion.lastUnitPrice))}/${suggestion.unit}`}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-2">
                <Input
                  value={row.brand}
                  placeholder="Brand"
                  onChange={(e) => updateRow(row.key, { brand: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  value={row.type}
                  placeholder="Type"
                  onChange={(e) => updateRow(row.key, { type: e.target.value })}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  value={row.qty}
                  placeholder="Qty"
                  inputMode="decimal"
                  onChange={(e) => updateRow(row.key, { qty: e.target.value })}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  value={row.unit}
                  placeholder="Unit"
                  onChange={(e) => updateRow(row.key, { unit: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <Input
                  value={row.unitPrice}
                  placeholder="Harga satuan"
                  inputMode="numeric"
                  onChange={(e) => updateRow(row.key, { unitPrice: e.target.value })}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeRow(row.key)}
                  aria-label={`Hapus baris ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              {!isRowEmpty(row) && (
                <div className="md:col-span-12 text-right text-sm text-gray-600">
                  Total baris: {formatRupiah(toNumber(row.qty) * toNumber(row.unitPrice))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setRows((current) => [...current, emptyRow()])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah baris
        </Button>
      </section>

      {/* Ringkasan */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Ringkasan</h2>
        <div className="space-y-2 text-sm">
          <SummaryRow label="Jumlah" value={formatRupiah(totals.subtotal)} />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">PPN</span>
              <Input
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="h-8 w-24"
                inputMode="decimal"
              />
              <span className="text-xs text-gray-500">
                ({(toNumber(vatRate) * 100).toFixed(0)}%)
              </span>
            </div>
            <span className="font-medium">{formatRupiah(totals.vat)}</span>
          </div>
          <SummaryRow label="Total" value={formatRupiah(totals.total)} strong />
        </div>

        {/* Terbilang selalu diturunkan dari total; tidak dapat diketik manual. */}
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Terbilang</div>
          <div className="mt-1 text-sm italic text-gray-800">
            {terbilangRupiah(Math.round(totals.total))}
          </div>
        </div>
      </section>

      {/* Syarat & ketentuan */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-1 font-semibold text-gray-900">Syarat &amp; Ketentuan</h2>
        <p className="mb-4 text-sm text-gray-600">Terisi dari penawaran terakhir Anda.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Franco">
            <Input value={franco} onChange={(e) => setFranco(e.target.value)} />
          </Field>
          <Field label="Delivery Time">
            <Input value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
          </Field>
          <Field label="Terms of Payment">
            <Input value={termsOfPayment} onChange={(e) => setTermsOfPayment(e.target.value)} />
          </Field>
          <Field label="Masa berlaku (hari)">
            <Input
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              inputMode="numeric"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Catatan internal">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={saving} onClick={() => void submit(false)}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Simpan Draft
        </Button>
        <Button disabled={saving} onClick={() => void submit(true)}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Simpan &amp; Terbitkan
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? 'text-base font-bold text-gray-900' : 'font-medium'}>{value}</span>
    </div>
  )
}
