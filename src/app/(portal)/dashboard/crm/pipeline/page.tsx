'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Badge } from '@/components/legacy-ui/badge'
import { DEAL_STAGE_LABEL } from '@/lib/crm-labels'
import { DIVISION_LABEL, type DivisionCode } from '@/lib/letter-number'
import { CrmStatCard, formatDate, formatRupiah } from '@/components/admin/crm/crm-stat-card'
import { DealFormDialog, type DealFormValue } from '@/components/admin/crm/deal-form-dialog'

interface DealRow extends DealFormValue {
  account: { id: string; name: string; status: string } | null
  quotation: { id: string; numberBase: string | null } | null
  weightedValue: string
}

const STAGE_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'PROSPEK', label: 'Prospek' },
  { value: 'PENAWARAN', label: 'Penawaran' },
  { value: 'NEGOSIASI', label: 'Negosiasi' },
  { value: 'DEAL', label: 'Deal' },
  { value: 'KALAH', label: 'Kalah' },
]

const STAGE_STYLE: Record<string, string> = {
  PROSPEK: 'bg-surface-2 text-body-text border-hairline',
  PENAWARAN: 'bg-gold/15 text-gold border-gold/35',
  NEGOSIASI: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  DEAL: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  KALAH: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export default function PipelinePage() {
  const [rows, setRows] = useState<DealRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('')
  const [editing, setEditing] = useState<DealFormValue | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (stage) params.set('stage', stage)
      params.set('limit', '200')

      const response = await fetch(`/api/crm/deals?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal memuat pipeline')
      }

      setRows(payload.data.deals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat pipeline')
    } finally {
      setLoading(false)
    }
  }, [search, stage])

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250)
    return () => clearTimeout(timer)
  }, [load])

  const totals = useMemo(() => {
    const open = rows.filter((row) => row.stage !== 'KALAH')
    return {
      value: open.reduce((sum, row) => sum + Number(row.estimatedValue || 0), 0),
      weighted: open.reduce((sum, row) => sum + Number(row.weightedValue || 0), 0),
      won: rows
        .filter((row) => row.stage === 'DEAL')
        .reduce((sum, row) => sum + Number(row.estimatedValue || 0), 0),
    }
  }, [rows])

  const byDivision = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of rows) {
      if (row.stage === 'KALAH') continue
      const key = row.division ?? 'Tanpa divisi'
      map.set(key, (map.get(key) ?? 0) + Number(row.estimatedValue || 0))
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [rows])

  const handleSaved = () => {
    setDialogOpen(false)
    void load()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM &middot; Pipeline Penjualan</h1>
          <p className="text-sm text-body-text">
            Setiap peluang menempel pada pelanggan, jadi nama perusahaan tidak lagi diketik ulang.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Peluang
        </Button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CrmStatCard label="Peluang" value={String(rows.length)} hint="sesuai filter" />
        <CrmStatCard label="Nilai berjalan" value={formatRupiah(totals.value)} />
        <CrmStatCard
          label="Perkiraan tertimbang"
          value={formatRupiah(totals.weighted)}
          hint="nilai × probabilitas"
        />
        <CrmStatCard label="Sudah deal" value={formatRupiah(totals.won)} />
      </div>

      {byDivision.length > 0 && (
        <div className="mb-5 rounded-lg border border-hairline bg-surface p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-body-muted">
            Nilai pipeline per divisi
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {byDivision.map(([division, value]) => (
              <div key={division} className="text-body-text">
                <span className="text-white">
                  {DIVISION_LABEL[division as DivisionCode] ?? division}
                </span>
                <span className="ml-2 text-body-muted">{formatRupiah(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari proyek, pelanggan, atau PIC..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STAGE_FILTERS.map((filter) => (
            <Button
              key={filter.value || 'all'}
              size="sm"
              variant={stage === filter.value ? 'default' : 'outline'}
              onClick={() => setStage(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-body-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat pipeline...
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
          <TrendingUp className="mx-auto mb-3 h-10 w-10 text-body-muted" />
          <h2 className="text-lg font-semibold text-white">Belum ada peluang</h2>
          <p className="mt-1 text-sm text-body-text">
            Tambahkan peluang penjualan untuk mulai melacak pipeline.
          </p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep text-left text-body-text">
              <tr>
                <th className="px-4 py-3 font-medium">Proyek / Produk</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Divisi</th>
                <th className="px-4 py-3 text-right font-medium">Nilai</th>
                <th className="px-4 py-3 text-right font-medium">Prob.</th>
                <th className="px-4 py-3 font-medium">Target Closing</th>
                <th className="px-4 py-3 font-medium">PIC</th>
                <th className="px-4 py-3 font-medium">Tahap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setEditing(row)
                        setDialogOpen(true)
                      }}
                      className="text-left font-medium text-gold hover:underline"
                    >
                      {row.title}
                    </button>
                    {row.quotation?.numberBase && (
                      <div className="text-xs text-body-muted">{row.quotation.numberBase}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{row.account?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-body-text">
                    {row.division ? DIVISION_LABEL[row.division] : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-white">
                    {formatRupiah(row.estimatedValue)}
                    <div className="text-xs font-normal text-body-muted">
                      {formatRupiah(row.weightedValue)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-body-text">{row.probability}%</td>
                  <td className="px-4 py-3 text-body-text">{formatDate(row.targetCloseDate)}</td>
                  <td className="px-4 py-3 text-body-text">{row.ownerName ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={STAGE_STYLE[row.stage]}>
                      {DEAL_STAGE_LABEL[row.stage]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DealFormDialog
        open={dialogOpen}
        deal={editing}
        onOpenChange={setDialogOpen}
        onSaved={handleSaved}
      />
    </div>
  )
}
