"use client"

import { useState, useRef, useEffect, useCallback, useMemo, useDeferredValue, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Tag, Image as ImageIcon, Eye, Download, Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GalleryItemDto {
  id: string
  title: string
  description?: string | null
  image: string
  category?: string | null
  projectType: string
  location?: string | null
  completedAt?: string | null
  isFeatured: boolean
  createdAt: string
}

// Extracted form component (pure, receives all state via props) to prevent remounting on parent re-renders
interface GalleryFormProps {
  formData: {
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string
    projectType: string
    location: string
    completedAt: string
    isFeatured: boolean
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  categories: string[]
  projectTypes: string[]
  selectedFile: File | null
  uploading: boolean
  uploadImage: () => Promise<string | null>
  uploadPreview: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (finalImageUrl?: string) => void
  submitLabel: string
}

const GalleryForm = memo(function GalleryForm({ formData, setFormData, categories, projectTypes, selectedFile, uploading, uploadImage, uploadPreview, fileInputRef, handleFileSelect, onSubmit, submitLabel }: GalleryFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Judul Foto</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="Masukkan judul foto"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
          placeholder="Deskripsi foto atau dokumentasi"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Gambar</Label>
        {uploadPreview ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            <img src={uploadPreview} alt="Preview" className="object-cover w-full h-full" />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => { setFormData((p: any) => ({ ...p, imageUrl: '' })); }}>
                Ganti
              </Button>
            </div>
          </div>
        ) : formData.imageUrl ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            <img src={formData.imageUrl} alt="Current" className="object-cover w-full h-full" />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => { setFormData((p: any) => ({ ...p, imageUrl: '' })) }}>
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-md p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Pilih atau tarik gambar</p>
              <p className="text-xs text-gray-500">Format: JPG, PNG, WEBP, GIF. Max 5MB.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Pilih File</Button>
              <Button
                type="button"
                size="sm"
                onClick={async () => { const url = await uploadImage(); if (url) { /* state updated in parent */ } }}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Mengupload...</>) : 'Upload'}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            aria-label="Pilih kategori foto"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="projectType">Tipe Proyek</Label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, projectType: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            aria-label="Pilih tipe proyek"
          >
            {projectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Lokasi</Label>
        <Input id="location" value={formData.location} onChange={(e) => setFormData((prev: any) => ({ ...prev, location: e.target.value }))} placeholder="Lokasi proyek" />
      </div>

      <div>
        <Label htmlFor="completedAt">Tanggal Selesai (opsional)</Label>
        <Input type="date" id="completedAt" value={formData.completedAt} onChange={(e) => setFormData((prev: any) => ({ ...prev, completedAt: e.target.value }))} />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData((prev: any) => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4" aria-label="Foto unggulan" />
          <Label htmlFor="isFeatured">Foto unggulan</Label>
        </div>
      </div>

      <Button
        onClick={async () => {
          if (!formData.imageUrl && selectedFile) {
            const url = await uploadImage();
            if (url) {
              onSubmit(url)
            }
          } else {
            onSubmit(formData.imageUrl)
          }
        }}
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={!formData.title || (!formData.imageUrl && !selectedFile)}
      >
        {submitLabel}
      </Button>
    </div>
  )
})
GalleryForm.displayName = 'GalleryForm'

interface GalleryGridProps {
  items: GalleryItemDto[]
  loadingList: boolean
  openViewDialog: (item: GalleryItemDto) => void
  openEditDialog: (item: GalleryItemDto) => void
  handleDeleteItem: (id: string) => void
  toggleFeatured: (id: string) => void
}

const GalleryGrid = memo(function GalleryGrid({ items, loadingList, openViewDialog, openEditDialog, handleDeleteItem, toggleFeatured }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loadingList && <div className="col-span-full text-center text-sm text-gray-500">Memuat...</div>}
      {!loadingList && items.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              <img src={item.image.startsWith('/api/') ? item.image : `/api/images/${item.image.replace(/^\/+/, '')}`} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                {item.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">Unggulan</Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white p-2 rounded">
                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs opacity-90 line-clamp-1">{item.description}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{item.category || '-'}</Badge>
                <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">{item.projectType}</div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openViewDialog(item)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(item.id)}
                    className={item.isFeatured ? "bg-yellow-50 border-yellow-200" : ""}
                  >
                    {item.isFeatured ? "★" : "☆"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
GalleryGrid.displayName = 'GalleryGrid'

export default function AdminGalleryPage() {
  const { toast } = useToast()
  const [galleryItems, setGalleryItems] = useState<GalleryItemDto[]>([])
  const [loadingList, setLoadingList] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItemDto | null>(null)
  const [viewingItem, setViewingItem] = useState<GalleryItemDto | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: "",
    projectType: "INDUSTRIAL",
    location: "",
    completedAt: "",
    isFeatured: false
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const categories = ["Proyek", "Teknologi", "Instalasi", "Fasilitas", "Tim", "Sertifikasi", "Event"]
  const projectTypes = ["INDUSTRIAL","MUNICIPAL","RESIDENTIAL","COMMERCIAL"]

  async function loadGallery() {
    try {
      setLoadingList(true)
      const res = await fetch('/api/gallery')
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat data')
      setGalleryItems(json.data.galleryItems)
    } catch (e: any) {
      toast({ title: 'Gagal memuat', description: e.message, variant: 'destructive' })
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => { loadGallery() }, [])

  const filteredItems = useMemo(() => {
    const term = deferredSearch.toLowerCase()
    return galleryItems.filter(
      (item) =>
        (item.title.toLowerCase().includes(term) ||
          (item.description || '').toLowerCase().includes(term)) &&
        (selectedCategory === "" || item.category === selectedCategory)
    )
  }, [galleryItems, deferredSearch, selectedCategory])

  const handleAddItem = useCallback(async (imageUrlFromSubmit?: string) => {
    try {
      if (!formData.title) {
        toast({ title: 'Judul wajib', variant: 'destructive' }); return
      }
      if (!formData.imageUrl && !imageUrlFromSubmit) {
        toast({ title: 'Gambar wajib', variant: 'destructive' }); return
      }
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        image: imageUrlFromSubmit || formData.imageUrl,
        category: formData.category || undefined,
        projectType: formData.projectType || 'INDUSTRIAL',
        location: formData.location || undefined,
        completedAt: formData.completedAt ? new Date(formData.completedAt).toISOString() : undefined,
        isFeatured: formData.isFeatured,
      }
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Gagal membuat item')
      toast({ title: 'Foto ditambahkan' })
      setIsAddDialogOpen(false)
      resetForm()
      loadGallery()
    } catch (e: any) {
      toast({ title: 'Gagal', description: e.message, variant: 'destructive' })
    }
  }, [formData, toast])

  const handleEditItem = useCallback(async (imageUrlFromSubmit?: string) => {
    if (!editingItem) return
    try {
      if (!formData.title) { toast({ title: 'Judul wajib', variant: 'destructive' }); return }
      const payload = {
        // Only fields allowed in create/update schema
        title: formData.title,
        description: formData.description || undefined,
        image: imageUrlFromSubmit || formData.imageUrl || editingItem.image,
        category: formData.category || undefined,
        projectType: formData.projectType || 'INDUSTRIAL',
        location: formData.location || undefined,
        completedAt: formData.completedAt ? new Date(formData.completedAt).toISOString() : undefined,
        isFeatured: formData.isFeatured,
      }
      const res = await fetch(`/api/gallery/${editingItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Gagal update')
      toast({ title: 'Perubahan disimpan' })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      resetForm()
      loadGallery()
    } catch (e: any) {
      toast({ title: 'Gagal', description: e.message, variant: 'destructive' })
    }
  }, [editingItem, formData, toast])

  const handleDeleteItem = useCallback(async (id: string) => {
    if (!confirm('Hapus foto ini?')) return
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Gagal hapus')
      toast({ title: 'Foto dihapus' })
      loadGallery()
    } catch (e: any) {
      toast({ title: 'Gagal hapus', description: e.message, variant: 'destructive' })
    }
  }, [toast])

  const openEditDialog = (item: GalleryItemDto) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.image,
      category: item.category || "",
      tags: "",
      projectType: item.projectType,
      location: item.location || "",
      completedAt: item.completedAt ? item.completedAt.split('T')[0] : "",
      isFeatured: item.isFeatured
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (item: GalleryItemDto) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      tags: "",
      projectType: "INDUSTRIAL",
      location: "",
      completedAt: "",
      isFeatured: false
    })
    setSelectedFile(null); setUploadPreview(null)
  }

  const toggleFeatured = useCallback((id: string) => {
    const item = galleryItems.find(g => g.id === id)
    if (!item) return
    // Optimistic toggle
    setGalleryItems(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !item.isFeatured })
    }).then(async r => {
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.message || 'Gagal update fitur')
      }
      toast({ title: item.isFeatured ? 'Dihapus dari unggulan' : 'Ditandai unggulan' })
    }).catch(err => {
      // revert
      setGalleryItems(prev => prev.map(p => p.id === id ? { ...p, isFeatured: item.isFeatured } : p))
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' })
    })
  }, [galleryItems, toast])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg','image/jpg','image/png','image/webp','image/gif'].includes(file.type)) {
      toast({ title: 'Jenis file tidak didukung', description: 'Gunakan JPG, PNG, WEBP, atau GIF', variant: 'destructive' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File terlalu besar', description: 'Maksimal 5MB', variant: 'destructive' })
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => setUploadPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [toast])

  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!selectedFile) return null
    try {
      setUploading(true)
      const form = new FormData()
      form.append('file', selectedFile)
      form.append('category', 'gallery')
      form.append('title', formData.title || selectedFile.name)
      form.append('description', formData.description || '')

      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast({ title: 'Upload gagal', description: json.message || 'Tidak dapat mengupload gambar', variant: 'destructive' })
        return null
      }
      const url = json.data.filePath
      setFormData(prev => ({ ...prev, imageUrl: url }))
      toast({ title: 'Upload berhasil', description: 'Gambar berhasil diupload' })
      return url
    } catch (err: any) {
      toast({ title: 'Kesalahan', description: err.message || 'Upload error', variant: 'destructive' })
      return null
    } finally {
      setUploading(false)
    }
  }, [selectedFile, formData, toast])

  // (Inline components removed; now using extracted memoized components above)

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Gallery Management</h2>
              <p className="text-gray-600">Kelola galeri foto dan dokumentasi proyek</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Foto ke Galeri</DialogTitle>
                  <DialogDescription>
                    Tambahkan foto baru ke galeri. Pastikan foto berkualitas tinggi dan sesuai dengan standar perusahaan.
                  </DialogDescription>
                </DialogHeader>
                <GalleryForm
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  projectTypes={projectTypes}
                  selectedFile={selectedFile}
                  uploading={uploading}
                  uploadImage={uploadImage}
                  uploadPreview={uploadPreview}
                  fileInputRef={fileInputRef}
                  handleFileSelect={handleFileSelect}
                  onSubmit={handleAddItem}
                  submitLabel="Tambah Foto"
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari foto berdasarkan judul, deskripsi, atau tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[150px]"
              aria-label="Filter berdasarkan kategori"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Gallery Grid */}
          <GalleryGrid
            items={filteredItems}
            loadingList={loadingList}
            openViewDialog={openViewDialog}
            openEditDialog={openEditDialog}
            handleDeleteItem={handleDeleteItem}
            toggleFeatured={toggleFeatured}
          />

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Foto</DialogTitle>
              </DialogHeader>
              {viewingItem && (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img src={viewingItem.image.startsWith('/api/') ? viewingItem.image : `/api/images/${viewingItem.image.replace(/^\/+/, '')}`} alt={viewingItem.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Judul</Label>
                      <p className="text-sm text-gray-600">{viewingItem.title}</p>
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <p className="text-sm text-gray-600">{viewingItem.category || '-'}</p>
                    </div>
                    <div>
                      <Label>Photographer</Label>
                      <p className="text-sm text-gray-600">-</p>
                    </div>
                    <div>
                      <Label>Lokasi</Label>
                      <p className="text-sm text-gray-600">{viewingItem.location || '-'}</p>
                    </div>
                    <div>
                      <Label>Dimensi</Label>
                      <p className="text-sm text-gray-600">-</p>
                    </div>
                    <div>
                      <Label>Ukuran File</Label>
                      <p className="text-sm text-gray-600">-</p>
                    </div>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <p className="text-sm text-gray-600">{viewingItem.description}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Foto</DialogTitle>
                <DialogDescription>
                  Ubah informasi foto. Pastikan foto berkualitas tinggi dan sesuai dengan standar perusahaan.
                </DialogDescription>
              </DialogHeader>
              <GalleryForm
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                projectTypes={projectTypes}
                selectedFile={selectedFile}
                uploading={uploading}
                uploadImage={uploadImage}
                uploadPreview={uploadPreview}
                fileInputRef={fileInputRef}
                handleFileSelect={handleFileSelect}
                onSubmit={handleEditItem}
                submitLabel="Simpan Perubahan"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
