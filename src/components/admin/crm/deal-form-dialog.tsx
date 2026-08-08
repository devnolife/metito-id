'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Textarea } from '@/components/legacy-ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { DEAL_STAGE_LABEL } from '@/lib/crm-labels'
import { DIVISION_CODES, DIVISION_LABEL, type DivisionCode } from '@/lib/letter-number'
import { Field, Select } from './account-form-dialog'
import { toDateInputValue } from './crm-stat-card'

export interface DealFormValue {
  id: string
  accountId: string
  title: string
  division: DivisionCode | null
  estimatedValue: string
  stage: keyof typeof DEAL_STAGE_LABEL
  probability: number
  startDate: string | null
  targetCloseDate: string | null
  ownerName: string | null
  notes: string | null
}

interface AccountOption {
  id: string
  name: string
  address: string | null
  division: DivisionCode | null
}

interface Props {
  open: boolean
  deal: DealFormValue | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const emptyForm = () => ({
  accountId: '',
  title: '',
  division: '',
  estimatedValue: '',
  stage: 'PROSPEK',
  probability: '30',
  startDate: toDateInputValue(new Date()),
  targetCloseDate: '',
  ownerName: '',
  notes: '',
})

export function DealFormDialog({ open, deal, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm())
  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadAccounts = useCallback(async () => {
    try {
      const response = await fetch('/api/crm/accounts?limit=200')
      const payload = await response.json()
      if (payload.success) setAccounts(payload.data.accounts)
    } catch {
      setAccounts([])
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void loadAccounts()
    setForm(
      deal
        ? {
            accountId: deal.accountId,
            title: deal.title,
            division: deal.division ?? '',
            estimatedValue: String(Number(deal.estimatedValue ?? 0)),
            stage: deal.stage,
            probability: String(deal.probability),
            startDate: toDateInputValue(deal.startDate),
            targetCloseDate: toDateInputValue(deal.targetCloseDate),
            ownerName: deal.ownerName ?? '',
            notes: deal.notes ?? '',
          }
        : emptyForm()
    )
  }, [open, deal, loadAccounts])

  if (!open) return null

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.accountId) {
      toast({ title: 'Pelanggan wajib dipilih', variant: 'destructive' })
      return
    }
    if (!form.title.trim()) {
      toast({ title: 'Deskripsi proyek wajib diisi', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        accountId: form.accountId,
        title: form.title.trim(),
        division: form.division || null,
        estimatedValue: form.estimatedValue.trim() || '0',
        stage: form.stage,
        probability: Number(form.probability || 0),
        startDate: form.startDate || null,
        targetCloseDate: form.targetCloseDate || null,
        ownerName: form.ownerName.trim() || null,
        notes: form.notes.trim() || null,
      }

      const response = await fetch(deal ? `/api/crm/deals/${deal.id}` : '/api/crm/deals', {
        method: deal ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyimpan peluang')
      }

      toast({ title: deal ? 'Peluang diperbarui' : 'Peluang ditambahkan' })
      onSaved()
    } catch (error) {
      toast({
        title: 'Gagal menyimpan',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deal) return
    if (!window.confirm(`Hapus peluang "${deal.title}"?`)) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/crm/deals/${deal.id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghapus peluang')
      }

      toast({ title: 'Peluang dihapus' })
      onSaved()
    } catch (error) {
      toast({
        title: 'Gagal menghapus',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10">
      <div className="w-full max-w-2xl rounded-lg border border-hairline bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            {deal ? 'Ubah Peluang' : 'Tambah Peluang'}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-body-muted hover:text-white"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pelanggan" required className="sm:col-span-2">
              <Select
                value={form.accountId}
                onChange={(value) => {
                  const account = accounts.find((item) => item.id === value)
                  set({
                    accountId: value,
                    division: form.division || (account?.division ?? ''),
                  })
                }}
                options={[
                  { value: '', label: 'Pilih pelanggan...' },
                  ...accounts.map((account) => ({
                    value: account.id,
                    label: account.address
                      ? `${account.name} — ${account.address}`
                      : account.name,
                  })),
                ]}
              />
            </Field>

            <Field label="Deskripsi Proyek / Produk" required className="sm:col-span-2">
              <Input
                value={form.title}
                onChange={(event) => set({ title: event.target.value })}
                placeholder="Cable Instrument Tensens"
              />
            </Field>

            <Field label="Divisi">
              <Select
                value={form.division}
                onChange={(value) => set({ division: value })}
                options={[
                  { value: '', label: 'Tidak ditentukan' },
                  ...DIVISION_CODES.map((code) => ({
                    value: code,
                    label: `${code} — ${DIVISION_LABEL[code]}`,
                  })),
                ]}
              />
            </Field>

            <Field label="Nilai Estimasi (Rp)">
              <Input
                value={form.estimatedValue}
                onChange={(event) =>
                  set({ estimatedValue: event.target.value.replace(/[^\d.]/g, '') })
                }
                placeholder="235000000"
                inputMode="numeric"
              />
            </Field>

            <Field label="Tahap">
              <Select
                value={form.stage}
                onChange={(value) => set({ stage: value })}
                options={Object.entries(DEAL_STAGE_LABEL).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Field>

            <Field label="Probabilitas (%)" hint="Persen bulat, 0 sampai 100">
              <Input
                type="number"
                min={0}
                max={100}
                value={form.probability}
                onChange={(event) => set({ probability: event.target.value })}
              />
            </Field>

            <Field label="Tanggal Mulai">
              <Input
                type="date"
                value={form.startDate}
                onChange={(event) => set({ startDate: event.target.value })}
              />
            </Field>

            <Field label="Target Closing">
              <Input
                type="date"
                value={form.targetCloseDate}
                onChange={(event) => set({ targetCloseDate: event.target.value })}
              />
            </Field>

            <Field label="PIC Internal (METITO)" className="sm:col-span-2">
              <Input
                value={form.ownerName}
                onChange={(event) => set({ ownerName: event.target.value })}
                placeholder="Pasya Ahmad"
              />
            </Field>

            <Field label="Catatan" className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(event) => set({ notes: event.target.value })}
                rows={3}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            {deal ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleDelete()}
                disabled={deleting || saving}
                className="border-red-500/30 text-red-300 hover:bg-red-500/10"
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Hapus
              </Button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
