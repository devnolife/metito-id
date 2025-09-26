"use client"

import { useState, useRef, useCallback, memo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Building, Phone, Mail, MapPin, Star, User, Globe } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  industry: string
  projectType: string
  testimonial: string
  rating: number
  avatar: string
  website?: string
  contactDate: string
  projectValue: string
  status: "active" | "completed" | "potential"
  isPublicTestimonial: boolean
  featured: boolean
}

interface CustomerFormData {
  name: string
  company: string
  email: string
  phone: string
  address: string
  industry: string
  projectType: string
  testimonial: string
  rating: number
  avatar: string
  website: string
  contactDate: string
  projectValue: string
  status: "active" | "completed" | "potential"
  isPublicTestimonial: boolean
  featured: boolean
}

// Normalize possibly null/undefined customer-like data into safe form values
function normalizeFormData(data: Partial<CustomerFormData>): CustomerFormData {
  return {
    name: data.name ?? '',
    company: data.company ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    industry: data.industry ?? '',
    projectType: data.projectType ?? '',
    testimonial: data.testimonial ?? '',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    avatar: data.avatar ?? '',
    website: data.website ?? '',
    contactDate: data.contactDate ? (data.contactDate.length > 10 ? data.contactDate.substring(0,10) : data.contactDate) : '',
    projectValue: data.projectValue ?? '',
    status: (data.status === 'active' || data.status === 'completed' || data.status === 'potential') ? data.status : 'potential',
    isPublicTestimonial: !!data.isPublicTestimonial,
    featured: !!data.featured
  }
}

interface CustomerFormProps {
  initialData: CustomerFormData
  industries: string[]
  uploadingAvatar: boolean
  avatarFile: File | null
  avatarPreview: string | null
  onAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAvatarUpload: () => Promise<string | null>
  clearAvatar: () => void
  onSubmit: (data: CustomerFormData) => Promise<void> | void
  submitLabel: string
}

const CustomerForm = memo(function CustomerForm({ initialData, industries, uploadingAvatar, avatarFile, avatarPreview, onAvatarSelect, onAvatarUpload, clearAvatar, onSubmit, submitLabel }: CustomerFormProps) {
  const [localData, setLocalData] = useState<CustomerFormData>(normalizeFormData(initialData))
  const fileInputId = 'customer-avatar-input'

  useEffect(() => { setLocalData(normalizeFormData(initialData)) }, [initialData])

  const triggerFile = () => { (document.getElementById(fileInputId) as HTMLInputElement | null)?.click() }

  const handleSubmit = async () => { await onSubmit(localData) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Kontak</Label>
          <Input id="name" value={localData.name} onChange={(e) => setLocalData({ ...localData, name: e.target.value })} placeholder="Nama lengkap kontak" />
        </div>
        <div>
          <Label htmlFor="company">Nama Perusahaan</Label>
          <Input id="company" value={localData.company} onChange={(e) => setLocalData({ ...localData, company: e.target.value })} placeholder="Nama perusahaan" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={localData.email} onChange={(e) => setLocalData({ ...localData, email: e.target.value })} placeholder="email@perusahaan.com" />
        </div>
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" value={localData.phone} onChange={(e) => setLocalData({ ...localData, phone: e.target.value })} placeholder="+62 812-1760-3950" />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Alamat</Label>
        <Textarea id="address" value={localData.address} onChange={(e) => setLocalData({ ...localData, address: e.target.value })} rows={2} placeholder="Alamat lengkap perusahaan" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industri</Label>
          <select id="industry" value={localData.industry} onChange={(e) => setLocalData({ ...localData, industry: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" aria-label="Pilih industri">
            <option value="">Pilih industri</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="projectType">Jenis Proyek</Label>
          <Input id="projectType" value={localData.projectType} onChange={(e) => setLocalData({ ...localData, projectType: e.target.value })} placeholder="Sistem Pengolahan Air Limbah" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactDate">Tanggal Kontak</Label>
          <Input id="contactDate" type="date" value={localData.contactDate} onChange={(e) => setLocalData({ ...localData, contactDate: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="projectValue">Nilai Proyek</Label>
          <Input id="projectValue" value={localData.projectValue} onChange={(e) => setLocalData({ ...localData, projectValue: e.target.value })} placeholder="Rp 2.5 Miliar" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website (Opsional)</Label>
          <Input id="website" value={localData.website} onChange={(e) => setLocalData({ ...localData, website: e.target.value })} placeholder="https://perusahaan.com" />
        </div>
        <div>
          <Label htmlFor="avatar">Foto Profil</Label>
          {avatarPreview || localData.avatar ? (
            <div className="space-y-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border relative">
                <img src={avatarPreview || localData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                {avatarPreview && !localData.avatar && (
                  <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[10px] text-center py-0.5">Belum diupload</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={triggerFile} disabled={uploadingAvatar}>Ganti</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => { clearAvatar(); setLocalData({ ...localData, avatar: '' }); }} disabled={uploadingAvatar}>Hapus</Button>
                {avatarPreview && !localData.avatar && (
                  <Button type="button" size="sm" onClick={async () => { const url = await onAvatarUpload(); if (url) setLocalData(d => ({ ...d, avatar: url })); }} disabled={uploadingAvatar}>
                    {uploadingAvatar ? 'Mengupload...' : 'Upload'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2 border border-dashed rounded-md p-4">
              <p className="text-xs text-gray-600">Pilih foto (JPG/PNG/WEBP/GIF, max 5MB)</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={triggerFile}>Pilih File</Button>
                <Button type="button" size="sm" onClick={onAvatarUpload} disabled={!avatarFile || uploadingAvatar}>{uploadingAvatar ? 'Mengupload...' : 'Upload'}</Button>
              </div>
            </div>
          )}
          <input id={fileInputId} className="hidden" type="file" accept="image/*" onChange={onAvatarSelect} />
          <Input id="avatar" value={localData.avatar} onChange={(e) => setLocalData({ ...localData, avatar: e.target.value })} placeholder="Atau tempel URL langsung" className="mt-2" />
        </div>
      </div>
      <div>
        <Label htmlFor="testimonial">Testimoni</Label>
        <Textarea id="testimonial" value={localData.testimonial} onChange={(e) => setLocalData({ ...localData, testimonial: e.target.value })} rows={4} placeholder="Tulis testimoni pelanggan (opsional)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" type="number" min={1} max={5} value={localData.rating} onChange={(e) => setLocalData({ ...localData, rating: parseInt(e.target.value) || 5 })} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" value={localData.status} onChange={(e) => setLocalData({ ...localData, status: e.target.value as any })} className="w-full p-2 border border-gray-300 rounded-md" aria-label="Pilih status pelanggan">
            <option value="potential">Prospek</option>
            <option value="active">Aktif</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="isPublicTestimonial" className="w-4 h-4" checked={localData.isPublicTestimonial} onChange={(e) => setLocalData({ ...localData, isPublicTestimonial: e.target.checked })} />
          <Label htmlFor="isPublicTestimonial">Tampilkan testimoni di website</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="featured" className="w-4 h-4" checked={localData.featured} onChange={(e) => setLocalData({ ...localData, featured: e.target.checked })} />
          <Label htmlFor="featured">Pelanggan unggulan</Label>
        </div>
      </div>
      <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={uploadingAvatar}>{submitLabel}</Button>
    </div>
  )
})
CustomerForm.displayName = 'CustomerForm'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    projectType: "",
    testimonial: "",
    rating: 5,
    avatar: "",
    website: "",
    contactDate: "",
    projectValue: "",
    status: "potential" as "active" | "completed" | "potential",
    isPublicTestimonial: false,
    featured: false
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg','image/jpg','image/png','image/webp','image/gif'].includes(file.type)) {
      alert('Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran maksimum 5MB')
      return
    }
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const uploadAvatar = useCallback(async (): Promise<string | null> => {
    if (!avatarFile) return null
    try {
      setUploadingAvatar(true)
      const form = new FormData()
      form.append('file', avatarFile)
      form.append('category', 'customers')
      form.append('title', formData.name || avatarFile.name)
      form.append('description', formData.company || '')
      // Include credentials + bearer token so /api/upload (admin protected) can authenticate
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        const msg = res.status === 401
          ? 'Tidak terautentikasi / sesi kadaluarsa. Silakan login ulang.'
          : (json.message || 'Gagal upload avatar')
        alert(msg)
        return null
      }
      const url = json.data.filePath
      setFormData(prev => ({ ...prev, avatar: url }))
      return url
    } catch (e:any) {
      console.error(e)
      alert('Gagal upload avatar')
      return null
    }
    finally {
      setUploadingAvatar(false)
    }
  }, [avatarFile, formData.name, formData.company])

  // (Auto-upload disabled: user must click Upload explicitly)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "completed":
        return "Selesai"
      case "potential":
        return "Prospek"
      default:
        return "Unknown"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  // legacy inline form removed in favor of external memoized CustomerForm component
  // Derived data
  const industries = Array.from(new Set(customers.map(c => c.industry).filter(Boolean))).sort()

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      projectType: "",
      testimonial: "",
      rating: 5,
      avatar: "",
      website: "",
      contactDate: "",
      projectValue: "",
      status: "potential",
      isPublicTestimonial: false,
      featured: false
    })
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase()
    const matchesTerm = !term || [c.name, c.company, c.email, c.projectType].some(v => v.toLowerCase().includes(term))
    const matchesStatus = !selectedStatus || c.status === selectedStatus
    const matchesIndustry = !selectedIndustry || c.industry === selectedIndustry
    return matchesTerm && matchesStatus && matchesIndustry
  })

  const handleAddCustomer = async (data: CustomerFormData) => {
    // Basic validation
    if (!(data.name || '').trim()) {
      toast({ title: 'Nama wajib diisi', description: 'Silakan isi nama pelanggan.', variant: 'destructive' as any })
      return
    }
    if (!(data.email || '').trim()) {
      toast({ title: 'Email wajib diisi', description: 'Silakan isi email pelanggan.', variant: 'destructive' as any })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test((data.email || '').trim())) {
      toast({ title: 'Format email tidak valid', description: 'Periksa kembali alamat email.', variant: 'destructive' as any })
      return
    }
    try {
      // Pastikan avatar sudah terupload bila user memilih file tapi belum klik tombol Upload
      if (!data.avatar && avatarFile) {
        const uploaded = await uploadAvatar()
        if (uploaded) {
          data.avatar = uploaded
        }
      }
      const payload: any = {
        name: (data.name || '').trim(),
        company: (data.company || '').trim() || undefined,
        email: (data.email || '').trim(),
        phone: (data.phone || '').trim() || undefined,
        address: (data.address || '').trim() || undefined,
        industry: data.industry || undefined,
        projectType: (data.projectType || '').trim() || undefined,
        testimonial: (data.testimonial || '').trim() || undefined,
        rating: data.rating || 0,
        avatar: (data.avatar || '').trim() || undefined,
        website: (data.website || '').trim() || undefined,
        contactDate: data.contactDate ? new Date(data.contactDate).toISOString() : undefined,
        projectValue: (data.projectValue || '').trim() || undefined,
        status: data.status,
        isPublicTestimonial: data.isPublicTestimonial,
        featured: data.featured
      }
      const res = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        const msg = res.status === 401 ? 'Anda tidak terotentikasi. Silakan login ulang sebagai admin.' : (res.status === 403 ? 'Akses admin diperlukan.' : json.error || 'Terjadi kesalahan')
        toast({ title: 'Gagal menambah pelanggan', description: msg, variant: 'destructive' as any })
        return
      }
      const created: Customer = json.data
      const normalizedCreated: Customer = { ...created, contactDate: created.contactDate ? created.contactDate.substring(0,10) : '',
        company: created.company || '', email: created.email || '', phone: created.phone || '', address: created.address || '', industry: created.industry || '', projectType: created.projectType || '', testimonial: created.testimonial || '', avatar: created.avatar || '', website: created.website || '', projectValue: created.projectValue || '' }
      setCustomers(prev => [normalizedCreated, ...prev])
      setIsAddDialogOpen(false)
      toast({ title: 'Pelanggan ditambahkan', description: `${created.name} berhasil ditambahkan.` })
      resetForm()
    } catch (e:any) {
      console.error(e)
      toast({ title: 'Gagal menambah pelanggan', description: 'Kesalahan jaringan / server', variant: 'destructive' as any })
    }
  }

  const handleEditClick = (customer: Customer) => {
    const normalized: Customer = { ...customer, contactDate: customer.contactDate ? customer.contactDate.substring(0,10) : '',
      company: customer.company || '', email: customer.email || '', phone: customer.phone || '', address: customer.address || '', industry: customer.industry || '', projectType: customer.projectType || '', testimonial: customer.testimonial || '', avatar: customer.avatar || '', website: customer.website || '', projectValue: customer.projectValue || '' }
    setEditingCustomer(normalized)
    setIsEditDialogOpen(true)
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    if (!editingCustomer) return
    if (!(data.name || '').trim()) {
      toast({ title: 'Nama wajib diisi', description: 'Silakan isi nama pelanggan.', variant: 'destructive' as any })
      return
    }
    if (!(data.email || '').trim()) {
      toast({ title: 'Email wajib diisi', description: 'Silakan isi email pelanggan.', variant: 'destructive' as any })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test((data.email || '').trim())) {
      toast({ title: 'Format email tidak valid', description: 'Periksa kembali alamat email.', variant: 'destructive' as any })
      return
    }
    try {
      const payload: any = {
        name: (data.name || '').trim(),
        company: (data.company || '').trim() || undefined,
        email: (data.email || '').trim(),
        phone: (data.phone || '').trim() || undefined,
        address: (data.address || '').trim() || undefined,
        industry: data.industry || undefined,
        projectType: (data.projectType || '').trim() || undefined,
        testimonial: (data.testimonial || '').trim() || undefined,
        rating: data.rating || 0,
        avatar: (data.avatar || '').trim() || undefined,
        website: (data.website || '').trim() || undefined,
        contactDate: data.contactDate ? new Date(data.contactDate).toISOString() : null,
        projectValue: (data.projectValue || '').trim() || undefined,
        status: data.status,
        isPublicTestimonial: data.isPublicTestimonial,
        featured: data.featured
      }
      const res = await fetch(`/api/customers/${editingCustomer.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        const msg = res.status === 401 ? 'Anda tidak terotentikasi. Silakan login ulang.' : (res.status === 403 ? 'Akses admin diperlukan.' : json.error || 'Terjadi kesalahan')
        toast({ title: 'Gagal memperbarui', description: msg, variant: 'destructive' as any })
        return
      }
      const updated: Customer = json.data
      const normalizedUpdated: Customer = { ...updated, contactDate: updated.contactDate ? updated.contactDate.substring(0,10) : '',
        company: updated.company || '', email: updated.email || '', phone: updated.phone || '', address: updated.address || '', industry: updated.industry || '', projectType: updated.projectType || '', testimonial: updated.testimonial || '', avatar: updated.avatar || '', website: updated.website || '', projectValue: updated.projectValue || '' }
      setCustomers(prev => prev.map(c => c.id === normalizedUpdated.id ? normalizedUpdated : c))
      setIsEditDialogOpen(false)
      setEditingCustomer(null)
      toast({ title: 'Perubahan disimpan', description: `${updated.name} berhasil diperbarui.` })
    } catch (e:any) {
      console.error(e)
      toast({ title: 'Gagal memperbarui', description: 'Kesalahan jaringan / server', variant: 'destructive' as any })
    }
  }

  // Fetch customers on mount
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const res = await fetch('/api/customers')
        const json = await res.json()
        if (!res.ok || !json.success) {
          setLoadError(json.error || 'Gagal memuat data pelanggan')
          toast({ title: 'Gagal memuat pelanggan', description: json.error || 'Terjadi kesalahan', variant: 'destructive' as any })
          return
        }
        const list: Customer[] = json.data.customers || json.data || []
        const normalized = list.map(c => ({ ...c, contactDate: c.contactDate ? c.contactDate.substring(0,10) : '' }))
        setCustomers(normalized)
      } catch (e:any) {
        console.error(e)
        setLoadError('Kesalahan jaringan')
        toast({ title: 'Kesalahan jaringan', description: 'Tidak dapat menghubungi server', variant: 'destructive' as any })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Customer Management</h2>
              <p className="text-gray-600">Kelola data pelanggan dan testimoni</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" /> Tambah Pelanggan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                  <DialogDescription>Tambahkan data pelanggan baru beserta informasi proyek dan testimoni.</DialogDescription>
                </DialogHeader>
                <CustomerForm
                  initialData={formData}
                  industries={industries}
                  uploadingAvatar={uploadingAvatar}
                  avatarFile={avatarFile}
                  avatarPreview={avatarPreview}
                  onAvatarSelect={handleAvatarSelect}
                  onAvatarUpload={uploadAvatar}
                  clearAvatar={() => { setAvatarFile(null); setAvatarPreview(null); setFormData(p => ({ ...p, avatar: '' })) }}
                  onSubmit={handleAddCustomer}
                  submitLabel="Tambah Pelanggan"
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input className="pl-9" placeholder="Cari nama, perusahaan, email, proyek..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="p-2 border rounded-md" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="potential">Prospek</option>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
            </select>
            <select className="p-2 border rounded-md" value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}>
              <option value="">Semua Industri</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && (
              <div className="col-span-full flex justify-center py-12 text-sm text-gray-500">Memuat data pelanggan...</div>
            )}
            {!isLoading && !filteredCustomers.length && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-sm text-gray-500">
                {loadError ? (
                  <>
                    <p className="mb-2">{loadError}</p>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsLoading(true)
                      setLoadError(null)
                      fetch('/api/customers').then(r => r.json()).then(json => {
                        if (json.success) {
                          const list: Customer[] = json.data.customers || json.data || []
                          const normalized = list.map(c => ({ ...c, contactDate: c.contactDate ? c.contactDate.substring(0,10) : '' }))
                          setCustomers(normalized)
                        } else {
                          setLoadError(json.error || 'Gagal memuat data pelanggan')
                        }
                      }).catch(() => setLoadError('Kesalahan jaringan')).finally(() => setIsLoading(false))
                    }}>
                      Coba Lagi
                    </Button>
                  </>
                ) : (
                  <p>Tidak ada pelanggan</p>
                )}
              </div>
            )}
            {!isLoading && filteredCustomers.map(c => (
              <Card key={c.id} className="relative">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {c.avatar ? <img src={c.avatar.startsWith('/api/') ? c.avatar : `/api/images/${c.avatar.replace(/^\/+/, '')}`} alt={c.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{c.name}</h3>
                        {c.featured && <Badge className="bg-yellow-400 text-black">Featured</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><Building className="w-3 h-3" /> {c.company}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</p>
                      {c.website && (
                        <a
                          href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Globe className="w-3 h-3 mr-1" /> Website
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(c)}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => { setCustomerToDelete(c); setDeleteDialogOpen(true) }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" /> {c.contactDate || '—'}
                    <MapPin className="w-4 h-4" /> {c.address.split(',')[0]}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{c.projectType}</p>
                    {c.testimonial && c.isPublicTestimonial && <p className="mt-1 text-gray-600 italic line-clamp-3">“{c.testimonial}”</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(c.rating)}</div>
                    <Badge>{getStatusLabel(c.status)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>Perbarui informasi pelanggan.</DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm
              initialData={{ ...editingCustomer, website: editingCustomer.website || '' }}
              industries={industries}
              uploadingAvatar={uploadingAvatar}
              avatarFile={avatarFile}
              avatarPreview={avatarPreview}
              onAvatarSelect={handleAvatarSelect}
              onAvatarUpload={uploadAvatar}
              clearAvatar={() => { setAvatarFile(null); setAvatarPreview(null); setEditingCustomer(prev => prev ? { ...prev, avatar: '' } : prev) }}
              onSubmit={handleUpdateCustomer}
              submitLabel="Simpan Perubahan"
            />
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open && !isDeleting) { setDeleteDialogOpen(open); setCustomerToDelete(null) } else { setDeleteDialogOpen(open) } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              {customerToDelete ? (
                <>Anda yakin ingin menghapus pelanggan <strong>{customerToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.</>
              ) : 'Data pelanggan akan dihapus.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => { if (!isDeleting) { setCustomerToDelete(null) } }}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault()
                if (!customerToDelete) return
                setIsDeleting(true)
                const target = customerToDelete
                const prev = customers
                // Optimistic remove
                setCustomers(p => p.filter(c => c.id !== target.id))
                try {
                  const res = await fetch(`/api/customers/${target.id}`, { method: 'DELETE', credentials: 'include' })
                  const json = await res.json()
                  if (!res.ok || !json.success) {
                    setCustomers(prev)
                    toast({ title: 'Gagal menghapus', description: json.error || 'Terjadi kesalahan', variant: 'destructive' as any })
                  } else {
                    toast({ title: 'Pelanggan dihapus', description: `${target.name} telah dihapus.` })
                  }
                } catch (err:any) {
                  console.error(err)
                  setCustomers(prev)
                  toast({ title: 'Gagal menghapus', description: 'Kesalahan jaringan', variant: 'destructive' as any })
                } finally {
                  setIsDeleting(false)
                  setCustomerToDelete(null)
                  setDeleteDialogOpen(false)
                }
              }}
            >{isDeleting ? 'Menghapus...' : 'Hapus'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
