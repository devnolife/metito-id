'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Textarea } from '@/components/legacy-ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ACTIVITY_TYPE_LABEL } from '@/lib/crm-labels'
import { Field, Select } from './account-form-dialog'
import { toDateInputValue } from './crm-stat-card'

export interface ActivityFormValue {
  id: string
  accountId: string | null
  dealId: string | null
  occurredAt: string
  contactName: string | null
  type: keyof typeof ACTIVITY_TYPE_LABEL
  description: string
  nextAction: string | null
  nextActionDate: string | null
  ownerName: string | null
}

interface AccountOption {
  id: string
  name: string
  address: string | null
  picName: string | null
}

interface DealOption {
  id: string
  title: string
  accountId: string
}

interface Props {
  open: boolean
  activity: ActivityFormValue | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const emptyForm = () => ({
  accountId: '',
  dealId: '',
  occurredAt: toDateInputValue(new Date()),
  contactName: '',
  type: 'TELEPON',
  description: '',
  nextAction: '',
  nextActionDate: '',
  ownerName: '',
})

export function ActivityFormDialog({ open, activity, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm())
  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [deals, setDeals] = useState<DealOption[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadOptions = useCallback(async () => {
    try {
      const [accountsRes, dealsRes] = await Promise.all([
        fetch('/api/crm/accounts?limit=200'),
        fetch('/api/crm/deals?limit=200'),
      ])
      const [accountsPayload, dealsPayload] = await Promise.all([
        accountsRes.json(),
        dealsRes.json(),
      ])
      if (accountsPayload.success) setAccounts(accountsPayload.data.accounts)
      if (dealsPayload.success) setDeals(dealsPayload.data.deals)
    } catch {
      setAccounts([])
      setDeals([])
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void loadOptions()
    setForm(
      activity
        ? {
            accountId: activity.accountId ?? '',
            dealId: activity.dealId ?? '',
            occurredAt: toDateInputValue(activity.occurredAt),
            contactName: activity.contactName ?? '',
            type: activity.type,
            description: activity.description,
            nextAction: activity.nextAction ?? '',
            nextActionDate: toDateInputValue(activity.nextActionDate),
            ownerName: activity.ownerName ?? '',
          }
        : emptyForm()
    )
  }, [open, activity, loadOptions])

  if (!open) return null

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((current) => ({ ...current, ...patch }))

  // Peluang yang ditawarkan dibatasi pada pelanggan terpilih agar aktivitas
  // tidak tercatat pada peluang milik perusahaan lain.
  const dealOptions = form.accountId
    ? deals.filter((deal) => deal.accountId === form.accountId)
    : deals

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.description.trim()) {
      toast({ title: 'Deskripsi wajib diisi', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        accountId: form.accountId || null,
        dealId: form.dealId || null,
        occurredAt: form.occurredAt || undefined,
        contactName: form.contactName.trim() || null,
        type: form.type,
        description: form.description.trim(),
        nextAction: form.nextAction.trim() || null,
        nextActionDate: form.nextActionDate || null,
        ownerName: form.ownerName.trim() || null,
      }

      const response = await fetch(
        activity ? `/api/crm/activities/${activity.id}` : '/api/crm/activities',
        {
          method: activity ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyimpan aktivitas')
      }

      toast({ title: activity ? 'Aktivitas diperbarui' : 'Aktivitas dicatat' })
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
    if (!activity) return
    if (!window.confirm('Hapus catatan aktivitas ini?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/crm/activities/${activity.id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghapus aktivitas')
      }

      toast({ title: 'Aktivitas dihapus' })
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
            {activity ? 'Ubah Aktivitas' : 'Catat Aktivitas'}
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
            <Field label="Tanggal">
              <Input
                type="date"
                value={form.occurredAt}
                onChange={(event) => set({ occurredAt: event.target.value })}
              />
            </Field>

            <Field label="Jenis Aktivitas">
              <Select
                value={form.type}
                onChange={(value) => set({ type: value })}
                options={Object.entries(ACTIVITY_TYPE_LABEL).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Field>

            <Field label="Perusahaan">
              <Select
                value={form.accountId}
                onChange={(value) => {
                  const account = accounts.find((item) => item.id === value)
                  set({
                    accountId: value,
                    dealId: '',
                    contactName: form.contactName || (account?.picName ?? ''),
                  })
                }}
                options={[
                  { value: '', label: 'Tidak ditentukan' },
                  ...accounts.map((account) => ({
                    value: account.id,
                    label: account.address
                      ? `${account.name} — ${account.address}`
                      : account.name,
                  })),
                ]}
              />
            </Field>

            <Field label="Peluang Terkait">
              <Select
                value={form.dealId}
                onChange={(value) => set({ dealId: value })}
                options={[
                  { value: '', label: 'Tidak ditentukan' },
                  ...dealOptions.map((deal) => ({ value: deal.id, label: deal.title })),
                ]}
              />
            </Field>

            <Field label="Nama Kontak">
              <Input
                value={form.contactName}
                onChange={(event) => set({ contactName: event.target.value })}
                placeholder="Hendro"
              />
            </Field>

            <Field label="PIC METITO">
              <Input
                value={form.ownerName}
                onChange={(event) => set({ ownerName: event.target.value })}
                placeholder="Andi Musthamu"
              />
            </Field>

            <Field label="Deskripsi" required className="sm:col-span-2">
              <Textarea
                value={form.description}
                onChange={(event) => set({ description: event.target.value })}
                rows={3}
                placeholder="Follow-up penawaran, klien minta revisi harga"
              />
            </Field>

            <Field label="Tindak Lanjut Berikutnya">
              <Input
                value={form.nextAction}
                onChange={(event) => set({ nextAction: event.target.value })}
                placeholder="Kirim ulang penawaran revisi"
              />
            </Field>

            <Field label="Tanggal Tindak Lanjut">
              <Input
                type="date"
                value={form.nextActionDate}
                onChange={(event) => set({ nextActionDate: event.target.value })}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            {activity ? (
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
