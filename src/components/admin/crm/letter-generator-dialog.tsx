'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/legacy-ui/button'
import { Input } from '@/components/legacy-ui/input'
import { Textarea } from '@/components/legacy-ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { LETTER_STATUS_LABEL } from '@/lib/crm-labels'
import {
  DIVISION_CODES,
  DIVISION_LABEL,
  LETTER_ISSUERS,
  LETTER_TYPES,
  LETTER_TYPE_LABEL,
  isIssuedByAnotherModule,
  usesDivision,
  type LetterTypeCode,
} from '@/lib/letter-number'
import { Field, Select } from './account-form-dialog'
import { toDateInputValue } from './crm-stat-card'

interface AccountOption {
  id: string
  name: string
  address: string | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const emptyForm = () => ({
  type: 'SPK' as LetterTypeCode,
  division: 'CSC',
  subject: '',
  recipient: '',
  accountId: '',
  issuerName: LETTER_ISSUERS[0] as string,
  letterDate: toDateInputValue(new Date()),
  status: 'DRAFT',
  notes: '',
})

/**
 * Generator nomor surat.
 *
 * Pratinjau nomor hanya perkiraan; nomor yang mengikat diambil server saat
 * disimpan, sehingga dua orang yang membuka form bersamaan tidak mendapat
 * nomor kembar seperti pada rumus COUNTIFS di Excel.
 */
export function LetterGeneratorDialog({ open, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState(emptyForm())
  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const needsDivision = usesDivision(form.type)
  const handledByQuotations = isIssuedByAnotherModule(form.type)

  useEffect(() => {
    if (!open) return
    setForm(emptyForm())
    setPreview(null)
    setPreviewError(null)

    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/crm/accounts?limit=200')
        const payload = await response.json()
        if (payload.success) setAccounts(payload.data.accounts)
      } catch {
        setAccounts([])
      }
    }
    void loadAccounts()
  }, [open])

  const loadPreview = useCallback(async () => {
    if (handledByQuotations) {
      setPreview(null)
      setPreviewError(null)
      return
    }

    try {
      const params = new URLSearchParams({ type: form.type })
      if (needsDivision && form.division) params.set('division', form.division)
      if (form.letterDate) params.set('letterDate', form.letterDate)

      const response = await fetch(`/api/letters/next-number?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        setPreview(null)
        setPreviewError(payload.error || 'Gagal menghitung nomor')
        return
      }

      setPreview(payload.data.number)
      setPreviewError(null)
    } catch {
      setPreview(null)
      setPreviewError('Gagal menghitung nomor')
    }
  }, [form.type, form.division, form.letterDate, needsDivision, handledByQuotations])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => void loadPreview(), 200)
    return () => clearTimeout(timer)
  }, [open, loadPreview])

  if (!open) return null

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((current) => ({ ...current, ...patch }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (handledByQuotations) {
      toast({
        title: 'Gunakan modul Penawaran',
        description: 'Nomor SPH terbit otomatis saat penawaran diterbitkan.',
        variant: 'destructive',
      })
      return
    }
    if (!form.subject.trim()) {
      toast({ title: 'Perihal wajib diisi', variant: 'destructive' })
      return
    }
    if (!form.recipient.trim()) {
      toast({ title: 'Ditujukan kepada wajib diisi', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        type: form.type,
        division: needsDivision ? form.division : null,
        subject: form.subject.trim(),
        recipient: form.recipient.trim(),
        issuerName: form.issuerName,
        letterDate: form.letterDate || undefined,
        status: form.status,
        notes: form.notes.trim() || null,
        accountId: form.accountId || null,
      }

      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menerbitkan nomor surat')
      }

      toast({
        title: 'Nomor surat diterbitkan',
        description: result.data.number,
      })
      onSaved()
    } catch (error) {
      toast({
        title: 'Gagal menerbitkan',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10">
      <div className="w-full max-w-2xl rounded-lg border border-hairline bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Terbitkan Nomor Surat</h2>
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
          <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-body-muted">
              Nomor surat
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-gold">
              {handledByQuotations
                ? '— diterbitkan dari modul Penawaran —'
                : (preview ?? previewError ?? 'Menghitung...')}
            </div>
            {!handledByQuotations && preview && (
              <p className="mt-1 text-xs text-body-muted">
                Pratinjau. Nomor pasti diambil saat disimpan.
              </p>
            )}
          </div>

          {handledByQuotations && (
            <div className="rounded-lg border border-hairline bg-surface-2 p-4 text-sm text-body-text">
              <p>
                Nomor {LETTER_TYPE_LABEL[form.type]} terbit otomatis dari modul Penawaran agar
                deretnya tidak bercabang, lalu tercatat sendiri di log ini.
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-3"
                onClick={() => router.push('/dashboard/quotations/new')}
              >
                Buat Penawaran
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Jenis Surat" required>
              <Select
                value={form.type}
                onChange={(value) => set({ type: value as LetterTypeCode })}
                options={LETTER_TYPES.map((type) => ({
                  value: type,
                  label: `${type} — ${LETTER_TYPE_LABEL[type]}`,
                }))}
              />
            </Field>

            <Field
              label="Divisi"
              required={needsDivision}
              hint={needsDivision ? undefined : 'Tidak dipakai untuk jenis surat ini'}
            >
              <Select
                value={needsDivision ? form.division : ''}
                disabled={!needsDivision}
                onChange={(value) => set({ division: value })}
                options={
                  needsDivision
                    ? DIVISION_CODES.map((code) => ({
                        value: code,
                        label: `${code} — ${DIVISION_LABEL[code]}`,
                      }))
                    : [{ value: '', label: 'Nomor umum (tanpa divisi)' }]
                }
              />
            </Field>

            <Field label="Perihal" required className="sm:col-span-2">
              <Input
                value={form.subject}
                onChange={(event) => set({ subject: event.target.value })}
                placeholder="Pengadaan Chemical WTP"
                disabled={handledByQuotations}
              />
            </Field>

            <Field label="Pelanggan (opsional)">
              <Select
                value={form.accountId}
                onChange={(value) => {
                  const account = accounts.find((item) => item.id === value)
                  set({
                    accountId: value,
                    recipient: account?.name ?? form.recipient,
                  })
                }}
                options={[
                  { value: '', label: 'Ketik manual' },
                  ...accounts.map((account) => ({
                    value: account.id,
                    label: account.address
                      ? `${account.name} — ${account.address}`
                      : account.name,
                  })),
                ]}
              />
            </Field>

            <Field label="Ditujukan Kepada" required>
              <Input
                value={form.recipient}
                onChange={(event) => set({ recipient: event.target.value })}
                placeholder="PT. PLN Nusantara Power"
                disabled={handledByQuotations}
              />
            </Field>

            <Field label="PIC Penerbit" required>
              <Select
                value={form.issuerName}
                onChange={(value) => set({ issuerName: value })}
                options={LETTER_ISSUERS.map((name) => ({ value: name, label: name }))}
              />
            </Field>

            <Field label="Tanggal Surat" hint="Menentukan bulan Romawi pada nomor">
              <Input
                type="date"
                value={form.letterDate}
                onChange={(event) => set({ letterDate: event.target.value })}
              />
            </Field>

            <Field label="Status">
              <Select
                value={form.status}
                onChange={(value) => set({ status: value })}
                options={Object.entries(LETTER_STATUS_LABEL).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Field>

            <Field label="Catatan" className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(event) => set({ notes: event.target.value })}
                rows={2}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-hairline pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={saving || handledByQuotations}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Terbitkan Nomor
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
