'use client'

import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Textarea } from '@/components/legacy-ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ACCOUNT_STATUS_LABEL } from '@/lib/crm-labels'
import { DIVISION_CODES, DIVISION_LABEL, type DivisionCode } from '@/lib/letter-number'
import { toDateInputValue } from './crm-stat-card'

export interface AccountFormValue {
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
}

interface Props {
  open: boolean
  account: AccountFormValue | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const LEAD_SOURCES = ['Referensi', 'Website', 'WA Grup', 'Pameran', 'Telepon Masuk', 'Lainnya']

const emptyForm = () => ({
  name: '',
  industry: '',
  division: '',
  address: '',
  picName: '',
  picTitle: '',
  phone: '',
  email: '',
  leadSource: '',
  status: 'PROSPEK',
  addedAt: toDateInputValue(new Date()),
  notes: '',
})

export function AccountFormDialog({ open, account, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      account
        ? {
            name: account.name,
            industry: account.industry ?? '',
            division: account.division ?? '',
            address: account.address ?? '',
            picName: account.picName ?? '',
            picTitle: account.picTitle ?? '',
            phone: account.phone ?? '',
            email: account.email ?? '',
            leadSource: account.leadSource ?? '',
            status: account.status,
            addedAt: toDateInputValue(account.addedAt),
            notes: account.notes ?? '',
          }
        : emptyForm()
    )
  }, [open, account])

  if (!open) return null

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast({ title: 'Nama perusahaan wajib diisi', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        industry: form.industry.trim() || null,
        division: form.division || null,
        address: form.address.trim() || null,
        picName: form.picName.trim() || null,
        picTitle: form.picTitle.trim() || null,
        // Nomor telepon dikirim sebagai teks agar nol di depannya tidak hilang
        // seperti pada kolom Telepon berkas Excel.
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        leadSource: form.leadSource.trim() || null,
        status: form.status,
        addedAt: form.addedAt || undefined,
        notes: form.notes.trim() || null,
      }

      const response = await fetch(
        account ? `/api/crm/accounts/${account.id}` : '/api/crm/accounts',
        {
          method: account ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyimpan pelanggan')
      }

      toast({ title: account ? 'Pelanggan diperbarui' : 'Pelanggan ditambahkan' })
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
    if (!account) return
    if (!window.confirm(`Hapus ${account.name}? Peluang dan aktivitasnya ikut terhapus.`)) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/crm/accounts/${account.id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghapus pelanggan')
      }

      toast({ title: 'Pelanggan dihapus' })
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
            {account ? 'Ubah Pelanggan' : 'Tambah Pelanggan'}
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
            <Field label="Nama Perusahaan" required className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(event) => set({ name: event.target.value })}
                placeholder="PT. PLN Nusantara Power"
              />
            </Field>

            <Field label="Industri">
              <Input
                value={form.industry}
                onChange={(event) => set({ industry: event.target.value })}
                placeholder="Power Plant"
              />
            </Field>

            <Field label="Divisi Terkait">
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

            <Field label="Alamat / Lokasi" className="sm:col-span-2">
              <Input
                value={form.address}
                onChange={(event) => set({ address: event.target.value })}
                placeholder="PLTU Punagaya"
              />
            </Field>

            <Field label="PIC Utama">
              <Input
                value={form.picName}
                onChange={(event) => set({ picName: event.target.value })}
                placeholder="Hendro"
              />
            </Field>

            <Field label="Jabatan PIC">
              <Input
                value={form.picTitle}
                onChange={(event) => set({ picTitle: event.target.value })}
                placeholder="SPV Logistic"
              />
            </Field>

            <Field label="Telepon" hint="Ditulis apa adanya, nol di depan tidak hilang">
              <Input
                value={form.phone}
                onChange={(event) => set({ phone: event.target.value })}
                placeholder="085640373995"
                inputMode="tel"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => set({ email: event.target.value })}
                placeholder="nama@perusahaan.co.id"
              />
            </Field>

            <Field label="Sumber Lead">
              <Select
                value={form.leadSource}
                onChange={(value) => set({ leadSource: value })}
                options={[
                  { value: '', label: 'Tidak ditentukan' },
                  ...LEAD_SOURCES.map((source) => ({ value: source, label: source })),
                ]}
              />
            </Field>

            <Field label="Status">
              <Select
                value={form.status}
                onChange={(value) => set({ status: value })}
                options={Object.entries(ACCOUNT_STATUS_LABEL).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Field>

            <Field label="Tanggal Ditambahkan">
              <Input
                type="date"
                value={form.addedAt}
                onChange={(event) => set({ addedAt: event.target.value })}
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
            {account ? (
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

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-body-muted">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-body-muted">{hint}</p>}
    </div>
  )
}

export function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-10 w-full rounded-md border border-hairline bg-surface-2 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-navy-deep">
          {option.label}
        </option>
      ))}
    </select>
  )
}
