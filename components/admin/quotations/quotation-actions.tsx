'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Loader2, RefreshCw, Send, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type { DisplayStatus } from '@/lib/quotation-status'

interface Props {
  id: string
  status: DisplayStatus
  numberDisplay: string
  totalLabel: string
  validUntilLabel: string
  publicToken: string | null
  hasRevisions: boolean
}

/** Nomor WhatsApp Indonesia: 08xx -> 628xx, dan hanya digit. */
function toWaNumber(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('8')) return `62${digits}`
  return digits
}

export function QuotationActions({
  id,
  status,
  numberDisplay,
  totalLabel,
  validUntilLabel,
  publicToken,
  hasRevisions,
}: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [busy, setBusy] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [copied, setCopied] = useState(false)

  const publicUrl =
    publicToken && typeof window !== 'undefined'
      ? `${window.location.origin}/q/${publicToken}`
      : null

  const call = async (label: string, url: string, method = 'POST', body?: unknown) => {
    setBusy(label)
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Terjadi kesalahan')
      }

      toast({ title: 'Berhasil', description: payload.message })
      router.refresh()
      return payload.data
    } catch (error) {
      toast({
        title: 'Gagal',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'destructive',
      })
      return null
    } finally {
      setBusy(null)
    }
  }

  const copyLink = async () => {
    if (!publicUrl) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Gagal menyalin', description: publicUrl, variant: 'destructive' })
    }
  }

  const sendWhatsApp = () => {
    if (!publicUrl) return
    const number = toWaNumber(phone)
    if (!number) {
      toast({
        title: 'Nomor WhatsApp kosong',
        description: 'Isi nomor tujuan terlebih dahulu.',
        variant: 'destructive',
      })
      return
    }

    // wa.me hanya dapat membawa teks, bukan lampiran, sehingga yang dikirim
    // adalah tautan ke dokumen.
    const message = [
      'Selamat siang,',
      '',
      `Berikut kami sampaikan penawaran ${numberDisplay} dengan nilai ${totalLabel}.`,
      `Masa berlaku: ${validUntilLabel}.`,
      '',
      `Dokumen dapat dibuka di: ${publicUrl}`,
      '',
      'Terima kasih.',
    ].join('\n')

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const isDraft = status === 'DRAFT'

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">Aksi</h2>

      {isDraft && (
        <Button
          className="w-full"
          disabled={busy !== null}
          onClick={() => void call('issue', `/api/quotations/${id}/issue`)}
        >
          {busy === 'issue' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Terbitkan &amp; Beri Nomor
        </Button>
      )}

      {!isDraft && publicToken && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input readOnly value={publicUrl ?? ''} className="text-xs" />
            <Button variant="outline" size="icon" onClick={() => void copyLink()}>
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08xx atau 62xx"
              inputMode="tel"
            />
            <Button
              onClick={sendWhatsApp}
              className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Kirim WA
            </Button>
          </div>
        </div>
      )}

      {!isDraft && !hasRevisions && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={busy !== null || status === 'WON'}
            onClick={() =>
              void call('won', `/api/quotations/${id}/status`, 'PATCH', { status: 'WON' })
            }
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Menang
          </Button>
          <Button
            variant="outline"
            disabled={busy !== null || status === 'LOST'}
            onClick={() =>
              void call('lost', `/api/quotations/${id}/status`, 'PATCH', { status: 'LOST' })
            }
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Kalah
          </Button>
        </div>
      )}

      {!isDraft && (
        <Button
          variant="outline"
          className="w-full"
          disabled={busy !== null}
          onClick={async () => {
            const created = await call('revise', `/api/quotations/${id}/revise`)
            if (created?.id) router.push(`/admin/quotations/${created.id}`)
          }}
        >
          {busy === 'revise' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Buat Revisi
        </Button>
      )}

      {!isDraft && (
        <p className="text-xs text-gray-500">
          Dokumen yang sudah diterbitkan tidak dapat diubah. Gunakan Buat Revisi bila ada
          perubahan.
        </p>
      )}
    </div>
  )
}
