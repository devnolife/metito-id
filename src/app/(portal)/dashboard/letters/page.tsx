'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileSignature, Loader2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Badge } from '@/components/legacy-ui/badge'
import { LETTER_STATUS_LABEL } from '@/lib/crm-labels'
import {
  DIVISION_LABEL,
  LETTER_TYPES,
  LETTER_TYPE_LABEL,
  type DivisionCode,
  type LetterTypeCode,
} from '@/lib/letter-number'
import { CrmStatCard, formatDate } from '@/components/admin/crm/crm-stat-card'
import { LetterGeneratorDialog } from '@/components/admin/crm/letter-generator-dialog'

interface LetterRow {
  id: string
  number: string
  seq: number
  year: number
  type: LetterTypeCode
  division: DivisionCode | null
  letterDate: string
  subject: string
  recipient: string
  issuerName: string
  status: keyof typeof LETTER_STATUS_LABEL
  account: { id: string; name: string } | null
  quotation: { id: string; numberBase: string | null } | null
}

const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-surface-2 text-body-text border-hairline',
  TERKIRIM: 'bg-gold/15 text-gold border-gold/35',
  DISETUJUI: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  DIBATALKAN: 'bg-red-500/15 text-red-300 border-red-500/30',
}

const TYPE_FILTERS = [
  { value: '', label: 'Semua' },
  ...LETTER_TYPES.map((type) => ({ value: type, label: type })),
]

export default function LettersPage() {
  const [rows, setRows] = useState<LetterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (type) params.set('type', type)
      params.set('limit', '200')

      const response = await fetch(`/api/letters?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Gagal memuat log nomor surat')
      }

      setRows(payload.data.letters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat log nomor surat')
    } finally {
      setLoading(false)
    }
  }, [search, type])

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250)
    return () => clearTimeout(timer)
  }, [load])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const response = await fetch(`/api/letters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error)

      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, status: status as LetterRow['status'] } : row
        )
      )
    } catch {
      void load()
    } finally {
      setUpdatingId(null)
    }
  }

  const thisYear = rows.filter((row) => row.year === new Date().getFullYear()).length
  const thisMonth = rows.filter((row) => {
    const date = new Date(row.letterDate)
    const now = new Date()
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  }).length

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Nomor Surat</h1>
          <p className="text-sm text-body-text">
            Nomor langsung tersimpan permanen saat diterbitkan &mdash; tidak ada lagi baris
            pratinjau yang harus disalin manual.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Terbitkan Nomor
        </Button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <CrmStatCard label="Total surat" value={String(rows.length)} hint="sesuai filter" />
        <CrmStatCard label="Surat tahun ini" value={String(thisYear)} />
        <CrmStatCard label="Surat bulan ini" value={String(thisMonth)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nomor, perihal, atau penerima..."
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
              title={
                filter.value ? LETTER_TYPE_LABEL[filter.value as LetterTypeCode] : 'Semua jenis'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-body-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat log nomor surat...
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
          <FileSignature className="mx-auto mb-3 h-10 w-10 text-body-muted" />
          <h2 className="text-lg font-semibold text-white">Belum ada nomor surat</h2>
          <p className="mt-1 text-sm text-body-text">
            Terbitkan nomor pertama, atau jalankan <code>npm run db:seed:crm</code> untuk mengimpor
            dari berkas Excel.
          </p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep text-left text-body-text">
              <tr>
                <th className="px-4 py-3 font-medium">Nomor Surat</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Divisi</th>
                <th className="px-4 py-3 font-medium">Perihal</th>
                <th className="px-4 py-3 font-medium">Ditujukan Kepada</th>
                <th className="px-4 py-3 font-medium">PIC</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3 font-medium text-gold">
                    {row.number}
                    {row.quotation && (
                      <div className="text-xs font-normal text-body-muted">dari penawaran</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-body-text">{formatDate(row.letterDate)}</td>
                  <td className="px-4 py-3 text-body-text" title={LETTER_TYPE_LABEL[row.type]}>
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-body-text">
                    {row.division ? DIVISION_LABEL[row.division] : '-'}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-white">{row.subject}</td>
                  <td className="px-4 py-3 text-body-text">{row.recipient}</td>
                  <td className="px-4 py-3 text-body-text">{row.issuerName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={STATUS_STYLE[row.status]}>
                        {LETTER_STATUS_LABEL[row.status]}
                      </Badge>
                      <select
                        value={row.status}
                        disabled={updatingId === row.id}
                        onChange={(event) => void updateStatus(row.id, event.target.value)}
                        className="h-7 rounded border border-hairline bg-surface-2 px-1 text-xs text-body-text"
                        aria-label={`Ubah status ${row.number}`}
                      >
                        {Object.entries(LETTER_STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value} className="bg-navy-deep">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LetterGeneratorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          setDialogOpen(false)
          void load()
        }}
      />
    </div>
  )
}
