'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarClock, Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Badge } from '@/components/legacy-ui/badge'
import { ACTIVITY_TYPE_LABEL } from '@/lib/crm-labels'
import { CrmStatCard, formatDate } from '@/components/admin/crm/crm-stat-card'
import {
  ActivityFormDialog,
  type ActivityFormValue,
} from '@/components/admin/crm/activity-form-dialog'

interface ActivityRow extends ActivityFormValue {
  account: { id: string; name: string } | null
  deal: { id: string; title: string } | null
}

const TYPE_FILTERS = [
  { value: '', label: 'Semua' },
  ...Object.entries(ACTIVITY_TYPE_LABEL).map(([value, label]) => ({ value, label })),
]

export default function ActivitiesPage() {
  const [rows, setRows] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [editing, setEditing] = useState<ActivityFormValue | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (type) params.set('type', type)
      params.set('limit', '200')

      const response = await fetch(`/api/crm/activities?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal memuat aktivitas')
      }

      setRows(payload.data.activities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat aktivitas')
    } finally {
      setLoading(false)
    }
  }, [search, type])

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250)
    return () => clearTimeout(timer)
  }, [load])

  const followUps = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let overdue = 0
    let upcoming = 0

    for (const row of rows) {
      if (!row.nextActionDate) continue
      const due = new Date(row.nextActionDate)
      if (Number.isNaN(due.getTime())) continue
      if (due < today) overdue += 1
      else upcoming += 1
    }

    return { overdue, upcoming }
  }, [rows])

  const isOverdue = (value: string | null) => {
    if (!value) return false
    const due = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return !Number.isNaN(due.getTime()) && due < today
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM &middot; Log Aktivitas</h1>
          <p className="text-sm text-body-text">
            Catat setiap telepon, email, meeting, dan kunjungan agar tindak lanjut tidak terlewat.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Catat Aktivitas
        </Button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <CrmStatCard label="Aktivitas tercatat" value={String(rows.length)} hint="sesuai filter" />
        <CrmStatCard
          label="Tindak lanjut lewat tenggat"
          value={String(followUps.overdue)}
          hint="perlu dikerjakan hari ini"
        />
        <CrmStatCard label="Tindak lanjut mendatang" value={String(followUps.upcoming)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari deskripsi, kontak, atau perusahaan..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {TYPE_FILTERS.map((filter) => (
            <Button
              key={filter.value || 'all'}
              size="sm"
              variant={type === filter.value ? 'default' : 'outline'}
              onClick={() => setType(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-body-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat aktivitas...
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
          <CalendarClock className="mx-auto mb-3 h-10 w-10 text-body-muted" />
          <h2 className="text-lg font-semibold text-white">Belum ada aktivitas</h2>
          <p className="mt-1 text-sm text-body-text">
            Catat interaksi pertama dengan pelanggan.
          </p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep text-left text-body-text">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Perusahaan</th>
                <th className="px-4 py-3 font-medium">Kontak</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 font-medium">Tindak Lanjut</th>
                <th className="px-4 py-3 font-medium">PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3 text-body-text">
                    <button
                      onClick={() => {
                        setEditing(row)
                        setDialogOpen(true)
                      }}
                      className="font-medium text-gold hover:underline"
                    >
                      {formatDate(row.occurredAt)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white">{row.account?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-body-text">{row.contactName ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-hairline bg-surface-2 text-body-text">
                      {ACTIVITY_TYPE_LABEL[row.type]}
                    </Badge>
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-body-text">{row.description}</td>
                  <td className="px-4 py-3 text-body-text">
                    {row.nextAction ?? '-'}
                    {row.nextActionDate && (
                      <div
                        className={
                          isOverdue(row.nextActionDate)
                            ? 'text-xs font-medium text-red-300'
                            : 'text-xs text-body-muted'
                        }
                      >
                        {formatDate(row.nextActionDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-body-text">{row.ownerName ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ActivityFormDialog
        open={dialogOpen}
        activity={editing}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          setDialogOpen(false)
          void load()
        }}
      />
    </div>
  )
}
