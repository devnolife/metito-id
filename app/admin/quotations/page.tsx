'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { STATUS_LABEL, type DisplayStatus } from '@/lib/quotation-status'

interface QuotationRow {
  id: string
  numberBase: string | null
  revision: number
  quoteDate: string
  issuedAt: string | null
  customerName: string
  subject: string
  total: string
  displayStatus: DisplayStatus
  createdBy: { id: string; name: string } | null
  _count: { items: number }
}

interface QuotationStats {
  counts: { draft: number; sent: number; won: number; lost: number; issued: number }
  values: { issued: string; won: string }
  winRate: number | null
  expiringSoon: number
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Semua' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Terkirim' },
  { value: 'WON', label: 'Menang' },
  { value: 'LOST', label: 'Kalah' },
  { value: 'EXPIRED', label: 'Kedaluwarsa' },
]

const STATUS_STYLE: Record<DisplayStatus, string> = {
  DRAFT: 'bg-surface-2 text-body-text border-hairline',
  SENT: 'bg-gold/15 text-gold border-gold/35',
  WON: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  LOST: 'bg-red-500/15 text-red-300 border-red-500/30',
  EXPIRED: 'bg-body-muted/15 text-body-muted border-body-muted/30',
}

function formatDate(value: string | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatRupiah(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)}`
}

export default function QuotationListPage() {
  const [rows, setRows] = useState<QuotationRow[]>([])
  const [stats, setStats] = useState<QuotationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  // Rekap dimuat sekali; angkanya tidak bergantung pada filter daftar.
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/quotations/stats')
        const payload = await response.json()
        if (payload.success) setStats(payload.data)
      } catch {
        setStats(null)
      }
    }
    void loadStats()
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      params.set('limit', '100')

      const response = await fetch(`/api/quotations?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal memuat penawaran')
      }

      setRows(payload.data.quotations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat penawaran')
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250)
    return () => clearTimeout(timer)
  }, [load])

  const totalValue = useMemo(
    () =>
      rows
        .filter((row) => row.displayStatus !== 'DRAFT')
        .reduce((sum, row) => sum + Number(row.total || 0), 0),
    [rows]
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Surat Penawaran</h1>
          <p className="text-sm text-body-text">
            Menggantikan Log Penomoran. Nomor diberikan otomatis saat penawaran diterbitkan.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/quotations/new">
            <Plus className="mr-2 h-4 w-4" />
            Buat Penawaran
          </Link>
        </Button>
      </div>

      {stats && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Penawaran terbit" value={String(stats.counts.issued)} />
          <StatCard label="Nilai terbit" value={formatRupiah(stats.values.issued)} />
          <StatCard
            label="Win rate"
            value={stats.winRate === null ? 'Belum ada hasil' : `${stats.winRate}%`}
            hint={`${stats.counts.won} menang / ${stats.counts.lost} kalah`}
          />
          <StatCard
            label="Akan kedaluwarsa"
            value={`${stats.expiringSoon}`}
            hint="dalam 7 hari ke depan"
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nomor, pelanggan, atau perihal..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value || 'all'}
              size="sm"
              variant={status === filter.value ? 'default' : 'outline'}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {!loading && rows.length > 0 && (
        <p className="mb-3 text-sm text-body-text">
          {rows.length} penawaran &middot; nilai terbit {formatRupiah(String(totalValue))}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-body-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat penawaran...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-300">{error}</p>
          <Button onClick={() => void load()} className="mt-3" size="sm">
            Coba lagi
          </Button>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-hairline bg-surface p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-body-muted" />
          <h2 className="text-lg font-semibold text-white">Belum ada penawaran</h2>
          <p className="mt-1 text-sm text-body-text">
            Buat penawaran pertama; nomornya akan terbentuk otomatis saat diterbitkan.
          </p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep text-left text-body-text">
              <tr>
                <th className="px-4 py-3 font-medium">Nomor</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Perihal</th>
                <th className="px-4 py-3 text-right font-medium">Nilai</th>
                <th className="px-4 py-3 font-medium">PIC</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/quotations/${row.id}`}
                      className="font-medium text-gold hover:underline"
                    >
                      {row.numberBase
                        ? `${row.numberBase}${row.revision > 0 ? ` Rev.${row.revision}` : ''}`
                        : 'Draft'}
                    </Link>
                    <div className="text-xs text-body-muted">{row._count.items} item</div>
                  </td>
                  <td className="px-4 py-3 text-body-text">
                    {formatDate(row.issuedAt ?? row.quoteDate)}
                  </td>
                  <td className="px-4 py-3 text-white">{row.customerName}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-body-text">{row.subject}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">
                    {formatRupiah(row.total)}
                  </td>
                  <td className="px-4 py-3 text-body-text">{row.createdBy?.name ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={STATUS_STYLE[row.displayStatus]}>
                      {STATUS_LABEL[row.displayStatus]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-body-muted">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-body-muted">{hint}</div>}
    </div>
  )
}