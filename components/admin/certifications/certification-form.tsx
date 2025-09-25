"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export type CertificationFormValues = {
  name: string
  description: string
  issuingBody: string
  issueDate: string
  expirationDate: string
  certificateNumber: string
  certificateImage: string
  status: 'active' | 'expired' | 'pending'
  credentialUrl: string
  category: string
  level: string
}

export interface CertificationFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<CertificationFormValues>
  categories: string[]
  levels: string[]
  onSubmit: (values: CertificationFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  certificationId?: string // only for edit mode
  onCertificateImageChange?: (path: string) => void // notify parent after successful persist
}

const emptyValues: CertificationFormValues = {
  name: '',
  description: '',
  issuingBody: '',
  issueDate: '',
  expirationDate: '',
  certificateNumber: '',
  certificateImage: '',
  status: 'active',
  credentialUrl: '',
  category: '',
  level: ''
}

export const CertificationForm: React.FC<CertificationFormProps> = React.memo(({ mode, initialValues, categories, levels, onSubmit, onCancel, submitLabel, certificationId, onCertificateImageChange }) => {
  const [values, setValues] = useState<CertificationFormValues>({ ...emptyValues, ...initialValues })
  const [certFile, setCertFile] = useState<File | null>(null)
  const [certPreview, setCertPreview] = useState<string | null>(null)
  const [uploadingCert, setUploadingCert] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // When initialValues change (switch between edit records) update state
  useEffect(() => {
    setValues(v => ({ ...emptyValues, ...initialValues }))
    setCertFile(null)
    setCertPreview(null)
  }, [initialValues])

  const setField = useCallback(<K extends keyof CertificationFormValues>(key: K, val: CertificationFormValues[K]) => {
    setValues(v => ({ ...v, [key]: val }))
  }, [])

  const handleFileChoose = useCallback((file: File) => {
    if (file.size > 5*1024*1024) { toast({ title: 'Maks 5MB', variant: 'destructive' as any }); return }
    // Selecting a new file implies user wants to replace existing uploaded image
    setCertFile(file)
    setValues(v => ({ ...v, certificateImage: '' }))
    const reader = new FileReader(); reader.onload = () => setCertPreview(reader.result as string); reader.readAsDataURL(file)
  }, [])

  const handleUpload = useCallback(async (): Promise<string | null> => {
    if (!certFile) return null
    try {
      setUploadingCert(true)
      const fd = new FormData()
      // NOTE: we intentionally send 'certifications'; API normalizes to 'certificates'
      fd.append('file', certFile)
      fd.append('category', 'certifications')
      fd.append('title', values.name || certFile.name)
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast({ title: 'Upload gagal', description: json.message || 'Tidak dapat upload', variant: 'destructive' as any })
        return null
      } else {
        setValues(v => ({ ...v, certificateImage: json.data.filePath }))
        toast({ title: 'Upload berhasil', description: 'File disimpan' })
        // Auto-persist to certification if in edit mode
        if (mode === 'edit' && certificationId) {
          try {
            const payload = { certificate: json.data.filePath }
            const token2 = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
            const res2 = await fetch(`/api/certifications/${certificationId}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json', ...(token2 ? { 'Authorization': `Bearer ${token2}` } : {}) }, credentials: 'include' })
            const upd = await res2.json()
            if (res2.ok && upd.success) {
              onCertificateImageChange?.(json.data.filePath)
              toast({ title: 'Gambar disimpan', description: 'Sertifikasi diperbarui' })
            } else {
              toast({ title: 'Gagal update sertifikasi', description: upd.message || 'Tidak dapat menyimpan field certificate', variant: 'destructive' as any })
            }
          } catch (e:any) {
            toast({ title: 'Gagal update sertifikasi', description: 'Kesalahan jaringan', variant: 'destructive' as any })
          }
        }
        return json.data.filePath as string
      }
    } catch (e:any) {
      toast({ title: 'Upload gagal', description: 'Kesalahan jaringan', variant: 'destructive' as any })
      return null
    } finally { setUploadingCert(false) }
  }, [certFile, values.name])

  const internalSubmit = async () => {
    if (uploadingCert) {
      toast({ title: 'Tunggu upload selesai', description: 'Sedang mengupload file', variant: 'destructive' as any })
      return
    }
    if (submitting) return
    // Auto-upload if user selected a file but hasn't uploaded yet
    let localValues = { ...values }
    if (certFile && !localValues.certificateImage) {
      const uploaded = await handleUpload()
      if (!uploaded) {
        return
      }
      localValues.certificateImage = uploaded
    }
    setSubmitting(true)
    try {
      console.log('[CertificationForm] Submitting values:', localValues)
      await onSubmit(localValues)
      if (mode === 'create') {
        setValues(emptyValues)
        setCertFile(null)
        setCertPreview(null)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nama Sertifikasi</Label>
        <Input id="name" value={values.name} onChange={e => setField('name', e.target.value)} placeholder="Masukkan nama sertifikasi" />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" value={values.description} onChange={e => setField('description', e.target.value)} rows={3} placeholder="Deskripsi singkat tentang sertifikasi" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issuingBody">Lembaga Penerbit</Label>
          <Input id="issuingBody" value={values.issuingBody} onChange={e => setField('issuingBody', e.target.value)} placeholder="Nama lembaga penerbit" />
        </div>
        <div>
          <Label htmlFor="certificateNumber">Nomor Sertifikat</Label>
          <Input id="certificateNumber" value={values.certificateNumber} onChange={e => setField('certificateNumber', e.target.value)} placeholder="Nomor sertifikat" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Tanggal Terbit</Label>
          <Input id="issueDate" type="date" value={values.issueDate} onChange={e => setField('issueDate', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="expirationDate">Tanggal Kadaluarsa</Label>
          <Input id="expirationDate" type="date" value={values.expirationDate} onChange={e => setField('expirationDate', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select id="category" value={values.category} onChange={e => setField('category', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Pilih kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <select id="level" value={values.level} onChange={e => setField('level', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Pilih level</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="certificateImage">Gambar Sertifikat</Label>
        {(certPreview || values.certificateImage) && (
          <div className="mb-2 w-40 h-28 border rounded overflow-hidden relative">
            <img src={certPreview || values.certificateImage} className="w-full h-full object-cover" alt="Preview" />
            {certPreview && !values.certificateImage && (
              <span className="absolute bottom-0 left-0 right-0 bg-amber-500 text-[10px] text-white text-center py-0.5">Belum diupload</span>
            )}
          </div>
        )}
        {!certPreview && !values.certificateImage && (
          <p className="text-xs text-gray-500 mb-2">Belum ada file dipilih.</p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('cert-file-input')?.click()}>Pilih File</Button>
          {certPreview && !values.certificateImage && (
            <Button type="button" size="sm" onClick={handleUpload} disabled={uploadingCert}>{uploadingCert ? 'Mengupload...' : 'Upload'}</Button>
          )}
          {(certPreview || values.certificateImage) && (
            <Button type="button" variant="secondary" size="sm" onClick={() => { setCertFile(null); setCertPreview(null); setValues(v => ({ ...v, certificateImage: '' })) }}>Hapus</Button>
          )}
        </div>
        <input id="cert-file-input" type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileChoose(file) }} />
        <Input id="certificateImage" value={values.certificateImage} onChange={e => setField('certificateImage', e.target.value)} placeholder="Atau tempel URL langsung" className="mt-2" />
        {values.certificateImage && (
          <p className="text-[11px] text-green-600 mt-1 break-all">Path tersimpan: {values.certificateImage}</p>
        )}
      </div>
      <div>
        <Label htmlFor="credentialUrl">URL Verifikasi (Opsional)</Label>
        <Input id="credentialUrl" value={values.credentialUrl} onChange={e => setField('credentialUrl', e.target.value)} placeholder="URL untuk verifikasi sertifikat" />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select id="status" value={values.status} onChange={e => setField('status', e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="active">Aktif</option>
          <option value="expired">Kadaluarsa</option>
          <option value="pending">Menunggu</option>
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={internalSubmit} disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700">{submitting ? 'Menyimpan...' : (submitLabel || (mode === 'create' ? 'Tambah Sertifikasi' : 'Simpan Perubahan'))}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>}
      </div>
    </div>
  )
})

CertificationForm.displayName = 'CertificationForm'
