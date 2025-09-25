"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Award, Building, CheckCircle, XCircle, FileText } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import { CertificationForm, CertificationFormValues } from '@/components/admin/certifications/certification-form'

interface Certification {
  id: string
  name: string
  description: string
  issuingBody: string
  issueDate: string
  expirationDate: string
  certificateNumber: string
  certificateImage: string
  status: "active" | "expired" | "pending"
  credentialUrl?: string
  category: string
  level: string
}

const categories = ["Quality Management", "Environmental", "Health & Safety", "Technical", "Professional", "Industry Specific"]
const levels = ["International", "National", "Regional", "Industry"]

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch data
  useEffect(() => {
    let cancelled = false
    async function loadCerts() {
      setLoading(true)
      setLoadingError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        const res = await fetch('/api/certifications', { credentials: 'include', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat data')
        const mapped: Certification[] = (json.data || []).map((c: any) => {
          // Normalize stored path: ensure it starts with '/' and remove any accidental 'public' prefix
          let img = c.certificate || ''
          if (img.startsWith('public/')) img = img.replace(/^public\//, '/')
          if (img && !img.startsWith('/')) img = '/' + img
          return {
          id: c.id,
          name: c.name || '',
          description: c.description || '',
          issuingBody: c.issuer || '',
          issueDate: c.issuedAt ? c.issuedAt.substring(0,10) : '',
          expirationDate: c.expiresAt ? c.expiresAt.substring(0,10) : '',
          certificateNumber: c.certificateNumber || '',
          certificateImage: img || '/placeholder.svg?height=300&width=400',
          status: c.status || 'active',
          credentialUrl: c.credentialUrl || '',
          category: c.category || '',
          level: c.level || ''
        }
        })
        if (!cancelled) setCertifications(mapped)
      } catch (e:any) {
        if (!cancelled) setLoadingError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadCerts();
    return () => { cancelled = true }
  }, [])

  const filteredCertifications = certifications.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuingBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const mapFormToPayload = (v: CertificationFormValues) => ({
    name: v.name,
    description: v.description || undefined,
    issuer: v.issuingBody,
    certificate: v.certificateImage || undefined,
    issuedAt: v.issueDate ? new Date(v.issueDate).toISOString() : new Date().toISOString(),
    expiresAt: v.expirationDate ? new Date(v.expirationDate).toISOString() : undefined,
    certificateNumber: v.certificateNumber || undefined,
    credentialUrl: v.credentialUrl || undefined,
    category: v.category || undefined,
    level: v.level || undefined,
    status: v.status
  })

  const normalizeImage = (img?: string) => {
    if (!img) return ''
    let out = img
    if (out.startsWith('public/')) out = out.replace(/^public\//, '/')
    if (out && !out.startsWith('/')) out = '/' + out
    return out
  }

  const mapApiToCert = (c: any): Certification => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    issuingBody: c.issuer || '',
    issueDate: c.issuedAt ? c.issuedAt.substring(0,10) : '',
    expirationDate: c.expiresAt ? c.expiresAt.substring(0,10) : '',
    certificateNumber: c.certificateNumber || '',
    certificateImage: normalizeImage(c.certificate) || '/placeholder.svg?height=300&width=400',
    status: c.status || 'active',
    credentialUrl: c.credentialUrl || '',
    category: c.category || '',
    level: c.level || ''
  })

  const handleCreate = useCallback(async (vals: CertificationFormValues) => {
    try {
      const payload = mapFormToPayload(vals)
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const res = await fetch('/api/certifications', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, credentials: 'include' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast({ title: 'Gagal menambah', description: json.message || 'Validasi gagal', variant: 'destructive' as any })
        return
      }
      const newCert = mapApiToCert(json.data)
      setCertifications(p => [newCert, ...p])
      setIsAddDialogOpen(false)
      toast({ title: 'Sertifikasi ditambahkan', description: newCert.name })
    } catch (e:any) {
      toast({ title: 'Kesalahan jaringan', description: e.message, variant: 'destructive' as any })
    }
  }, [])

  const handleUpdate = useCallback(async (vals: CertificationFormValues) => {
    if (!editingCertification) return
    try {
      const payload: any = mapFormToPayload(vals)
      // handle clear expiration (if user empties) we want null
      if (!vals.expirationDate) payload.expiresAt = null
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const res = await fetch(`/api/certifications/${editingCertification.id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, credentials: 'include' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast({ title: 'Gagal menyimpan', description: json.message || 'Validasi gagal', variant: 'destructive' as any })
        return
      }
      const updated = mapApiToCert(json.data)
      setCertifications(p => p.map(c => c.id === updated.id ? updated : c))
      setIsEditDialogOpen(false)
      setEditingCertification(null)
      toast({ title: 'Perubahan disimpan', description: updated.name })
    } catch (e:any) {
      toast({ title: 'Kesalahan jaringan', description: e.message, variant: 'destructive' as any })
    }
  }, [editingCertification])

  const handleDeleteCertification = (id: string) => {
    setCertToDelete(certifications.find(c => c.id === id) || null)
    setDeleteDialogOpen(true)
  }

  const openEditDialog = (cert: Certification) => {
    setEditingCertification(cert)
    setIsEditDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "expired": return <XCircle className="w-4 h-4 text-red-500" />
      case "pending": return <Calendar className="w-4 h-4 text-yellow-500" />
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "expired": return "bg-red-100 text-red-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Certifications Management</h2>
              <p className="text-gray-600">Kelola sertifikasi perusahaan</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(o) => { setIsAddDialogOpen(o) }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Sertifikasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Sertifikasi Baru</DialogTitle>
                  <DialogDescription>Tambahkan sertifikasi baru (wajib: nama, penerbit, tanggal terbit).</DialogDescription>
                </DialogHeader>
                <CertificationForm mode="create" categories={categories} levels={levels} onSubmit={handleCreate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Cari sertifikasi, lembaga penerbit, atau nomor sertifikat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          {loading && <p className="text-sm text-gray-500">Memuat data...</p>}
          {loadingError && <p className="text-sm text-red-600">{loadingError}</p>}
          {!loading && !loadingError && filteredCertifications.length === 0 && <p className="text-sm text-gray-500">Belum ada sertifikasi.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                    {cert.certificateImage && !cert.certificateImage.toLowerCase().endsWith('.pdf') ? (
                      <img src={cert.certificateImage} alt={cert.name} className="w-full h-full object-cover" />
                    ) : cert.certificateImage && cert.certificateImage.toLowerCase().endsWith('.pdf') ? (
                      <div className="flex flex-col items-center text-gray-600 text-xs gap-2">
                        <FileText className="w-8 h-8" />
                        <span className="px-2 py-1 bg-white/70 rounded shadow">PDF</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 text-xs gap-1">
                        <span className="text-base">Tidak ada gambar</span>
                        <span className="opacity-70">(Upload di Edit)</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(cert.status)}>
                        {getStatusIcon(cert.status)}
                        <span className="ml-1">{cert.status === "active" ? "Aktif" : cert.status === "expired" ? "Kadaluarsa" : "Menunggu"}</span>
                      </Badge>
                      <Badge variant="outline">{cert.level}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{cert.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{cert.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{cert.issuingBody}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{cert.certificateNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{cert.issueDate} - {cert.expirationDate}</span>
                    </div>
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">{cert.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      {cert.credentialUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(cert.credentialUrl, '_blank')}>Verifikasi</Button>
                      )}
                      <div className="flex gap-1 ml-auto">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(cert)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCertification(cert.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Sertifikasi</DialogTitle>
                <DialogDescription>Ubah informasi sertifikasi.</DialogDescription>
              </DialogHeader>
              {editingCertification && (
                <CertificationForm
                  mode="edit"
                  categories={categories}
                  levels={levels}
                  initialValues={{
                    name: editingCertification.name,
                    description: editingCertification.description,
                    issuingBody: editingCertification.issuingBody,
                    issueDate: editingCertification.issueDate,
                    expirationDate: editingCertification.expirationDate,
                    certificateNumber: editingCertification.certificateNumber,
                    certificateImage: editingCertification.certificateImage,
                    status: editingCertification.status,
                    credentialUrl: editingCertification.credentialUrl || '',
                    category: editingCertification.category,
                    level: editingCertification.level
                  }}
                  certificationId={editingCertification.id}
                  onCertificateImageChange={(path) => {
                    setCertifications(p => p.map(c => c.id === editingCertification.id ? { ...c, certificateImage: path } : c))
                    setEditingCertification(e => e ? { ...e, certificateImage: path } : e)
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => { setIsEditDialogOpen(false); setEditingCertification(null) }}
                  submitLabel="Simpan Perubahan"
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={o => { if (!isDeleting) { setDeleteDialogOpen(o); if (!o) setCertToDelete(null) } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sertifikasi</AlertDialogTitle>
            <AlertDialogDescription>
              {certToDelete ? <>Yakin ingin menghapus <strong>{certToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.</> : 'Konfirmasi hapus'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => { if (!isDeleting) { setCertToDelete(null) } }}>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={async (e) => {
              e.preventDefault()
              if (!certToDelete) return
              setIsDeleting(true)
              const target = certToDelete
              const prev = certifications
              setCertifications(p => p.filter(c => c.id !== target.id))
              try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
                const res = await fetch(`/api/certifications/${target.id}`, { method: 'DELETE', credentials: 'include', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined })
                const json = await res.json()
                if (!res.ok || !json.success) {
                  setCertifications(prev)
                  toast({ title: 'Gagal menghapus', description: json.error || 'Kesalahan', variant: 'destructive' as any })
                } else {
                  toast({ title: 'Sertifikasi dihapus', description: target.name })
                }
              } catch (err:any) {
                console.error(err)
                setCertifications(prev)
                toast({ title: 'Kesalahan jaringan', variant: 'destructive' as any })
              } finally {
                setIsDeleting(false)
                setCertToDelete(null)
                setDeleteDialogOpen(false)
              }
            }}>{isDeleting ? 'Menghapus...' : 'Hapus'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
