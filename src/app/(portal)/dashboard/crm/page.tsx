'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Badge } from '@/components/legacy-ui/badge'
import { ACCOUNT_STATUS_LABEL } from '@/lib/crm-labels'
import { DIVISION_LABEL, type DivisionCode } from '@/lib/letter-number'
import { AccountFormDialog } from '@/components/admin/crm/account-form-dialog'
import { CrmStatCard, formatRupiah } from '@/components/admin/crm/crm-stat-card'

interface AccountRow {
  id: string
  name: string
  industry: string | null
  division: DivisionCode | null
  address: string | null
  picName: string | null
  picTitle: string | null
  phone: string | null
  email: string | null
  leadSource: string | null
  status: keyof typeof ACCOUNT_STATUS_LABEL
  addedAt: string
  notes: string | null
  _count: { deals: number; activities: number; letters: number }
}

interface CrmStats {
  accounts: { total: number; byStatus: Record<string, number> }
  pipeline: { total: number; value: string; weightedValue: string; byStage: Record<string, number> }
  letters: { total: number; thisYear: number; thisMonth: number }
  followUps: { overdue: number; upcoming: number }
}

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'PROSPEK', label: 'Prospek' },
  { value: 'AKTIF', label: 'Aktif' },
  { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
]

const STATUS_STYLE: Record<string, string> = {
  PROSPEK: 'bg-gold/15 text-gold border-gold/35',
  AKTIF: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  TIDAK_AKTIF: 'bg-body-muted/15 text-body-muted border-body-muted/30',
}

export default function CrmAccountsPage() {
  const [rows, setRows] = useState<AccountRow[]>([])
  const [stats, setStats] = useState<CrmStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState<AccountRow | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/crm/stats')
      const payload = await response.json()
      if (payload.success) setStats(payload.data)
    } catch {
      setStats(null)
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      params.set('limit', '200')

      const response = await fetch(`/api/crm/accounts?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal memuat pelanggan')
      }

      setRows(payload.data.accounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat pelanggan')
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250)
    return () => clearTimeout(timer)
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (row: AccountRow) => {
    setEditing(row)
    setDialogOpen(true)
  }

  const handleSaved = () => {
    setDialogOpen(false)
    void load()
    void loadStats()
  }

  const activeCount = useMemo(
    () => rows.filter((row) => row.status === 'AKTIF').length,
    [rows]
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM &middot; Data Pelanggan</h1>
          <p className="text-sm text-body-text">
            Menggantikan sheet Data Pelanggan pada CRM_Nomor_Surat_METITO.xlsx.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pelanggan
        </Button>
      </div>

      {stats && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CrmStatCard
            label="Total pelanggan"
            value={String(stats.accounts.total)}
            hint={`${stats.accounts.byStatus.AKTIF ?? 0} aktif · ${stats.accounts.byStatus.PROSPEK ?? 0} prospek`}
          />
          <CrmStatCard
            label="Nilai pipeline"
            value={formatRupiah(stats.pipeline.value)}
            hint={`${stats.pipeline.total} peluang`}
          />
          <CrmStatCard
            label="Perkiraan tertimbang"
            value={formatRupiah(stats.pipeline.weightedValue)}
            hint="nilai × probabilitas"
          />
          <CrmStatCard
            label="Tindak lanjut"
            value={String(stats.followUps.overdue + stats.followUps.upcoming)}
            hint={`${stats.followUps.overdue} lewat tenggat`}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari perusahaan, PIC, atau lokasi..."
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
          {rows.length} pelanggan &middot; {activeCount} aktif
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-body-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat pelanggan...
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
          <Users className="mx-auto mb-3 h-10 w-10 text-body-muted" />
          <h2 className="text-lg font-semibold text-white">Belum ada pelanggan</h2>
          <p className="mt-1 text-sm text-body-text">
            Tambahkan pelanggan pertama, atau jalankan <code>npm run db:seed:crm</code> untuk
            mengimpor dari berkas Excel.
          </p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep text-left text-body-text">
              <tr>
                <th className="px-4 py-3 font-medium">Perusahaan</th>
                <th className="px-4 py-3 font-medium">Divisi</th>
                <th className="px-4 py-3 font-medium">PIC</th>
                <th className="px-4 py-3 font-medium">Kontak</th>
                <th className="px-4 py-3 font-medium">Sumber</th>
                <th className="px-4 py-3 text-right font-medium">Peluang</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(row)}
                      className="text-left font-medium text-gold hover:underline"
                    >
                      {row.name}
                    </button>
                    <div className="text-xs text-body-muted">
                      {[row.industry, row.address].filter(Boolean).join(' · ') || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body-text">
                    {row.division ? DIVISION_LABEL[row.division] : '-'}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {row.picName ?? '-'}
                    <div className="text-xs text-body-muted">{row.picTitle ?? ''}</div>
                  </td>
                  <td className="px-4 py-3 text-body-text">
                    {row.phone ?? '-'}
                    <div className="text-xs text-body-muted">{row.email ?? ''}</div>
                  </td>
                  <td className="px-4 py-3 text-body-text">{row.leadSource ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-body-text">
                    <Link href="/dashboard/crm/pipeline" className="hover:text-gold">
                      {row._count.deals}
                    </Link>
                    <div className="text-xs text-body-muted">{row._count.letters} surat</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={STATUS_STYLE[row.status]}>
                      {ACCOUNT_STATUS_LABEL[row.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AccountFormDialog
        open={dialogOpen}
        account={editing}
        onOpenChange={setDialogOpen}
        onSaved={handleSaved}
      />
    </div>
  )
}
