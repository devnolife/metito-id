"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Tag, Image as ImageIcon, Eye, Download } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  tags: string[]
  uploadDate: string
  photographer?: string
  location?: string
  dimensions: string
  fileSize: string
  isPublic: boolean
  featured: boolean
}

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Sistem Pengolahan Air Limbah Industri",
      description: "Instalasi sistem pengolahan air limbah untuk industri manufaktur dengan kapasitas 1000 m³/hari",
      imageUrl: "/images/gallery/water-treatment-plant-1.jpg",
      category: "Proyek",
      tags: ["pengolahan air", "industri", "limbah"],
      uploadDate: "2024-01-15",
      photographer: "Tim Dokumentasi",
      location: "Makassar, Indonesia",
      dimensions: "1920x1080",
      fileSize: "2.3 MB",
      isPublic: true,
      featured: true
    },
    {
      id: 2,
      title: "Reverse Osmosis System",
      description: "Sistem reverse osmosis untuk produksi air bersih dengan teknologi membrane terbaru",
      imageUrl: "/images/gallery/reverse-osmosis-system.jpg",
      category: "Teknologi",
      tags: ["reverse osmosis", "teknologi", "air bersih"],
      uploadDate: "2024-01-10",
      photographer: "Ahli Teknik",
      location: "Surabaya, Indonesia",
      dimensions: "1920x1280",
      fileSize: "3.1 MB",
      isPublic: true,
      featured: false
    },
    {
      id: 3,
      title: "Proses Instalasi Pipa Distribusi",
      description: "Dokumentasi proses instalasi sistem pipa distribusi air bersih untuk perumahan",
      imageUrl: "/images/gallery/pipe-installation.jpg",
      category: "Instalasi",
      tags: ["pipa", "distribusi", "instalasi"],
      uploadDate: "2024-01-08",
      photographer: "Supervisor Lapangan",
      location: "Bandung, Indonesia",
      dimensions: "1600x1200",
      fileSize: "1.8 MB",
      isPublic: true,
      featured: false
    },
    {
      id: 4,
      title: "Laboratorium Quality Control",
      description: "Fasilitas laboratorium untuk pengujian kualitas air dan kontrol mutu produk",
      imageUrl: "/images/gallery/quality-control-lab.jpg",
      category: "Fasilitas",
      tags: ["laboratorium", "quality control", "testing"],
      uploadDate: "2024-01-05",
      photographer: "Kepala Lab",
      location: "Metito Indonesia HQ",
      dimensions: "1920x1080",
      fileSize: "2.7 MB",
      isPublic: false,
      featured: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: "",
    photographer: "",
    location: "",
    dimensions: "",
    fileSize: "",
    isPublic: true,
    featured: false
  })

  const categories = ["Proyek", "Teknologi", "Instalasi", "Fasilitas", "Tim", "Sertifikasi", "Event"]

  const filteredItems = galleryItems.filter(
    (item) =>
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedCategory === "" || item.category === selectedCategory)
  )

  const handleAddItem = () => {
    const newItem: GalleryItem = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      uploadDate: new Date().toISOString().split("T")[0],
      photographer: formData.photographer,
      location: formData.location,
      dimensions: formData.dimensions,
      fileSize: formData.fileSize,
      isPublic: formData.isPublic,
      featured: formData.featured
    }
    setGalleryItems([...galleryItems, newItem])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditItem = () => {
    if (!editingItem) return

    const updatedItem: GalleryItem = {
      ...editingItem,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      photographer: formData.photographer,
      location: formData.location,
      dimensions: formData.dimensions,
      fileSize: formData.fileSize,
      isPublic: formData.isPublic,
      featured: formData.featured
    }

    setGalleryItems(galleryItems.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    setIsEditDialogOpen(false)
    setEditingItem(null)
    resetForm()
  }

  const handleDeleteItem = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus item galeri ini?")) {
      setGalleryItems(galleryItems.filter((item) => item.id !== id))
    }
  }

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      tags: item.tags.join(", "),
      photographer: item.photographer || "",
      location: item.location || "",
      dimensions: item.dimensions,
      fileSize: item.fileSize,
      isPublic: item.isPublic,
      featured: item.featured
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (item: GalleryItem) => {
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
      photographer: "",
      location: "",
      dimensions: "",
      fileSize: "",
      isPublic: true,
      featured: false
    })
  }

  const toggleFeatured = (id: number) => {
    setGalleryItems(galleryItems.map(item =>
      item.id === id ? { ...item, featured: !item.featured } : item
    ))
  }

  const togglePublic = (id: number) => {
    setGalleryItems(galleryItems.map(item =>
      item.id === id ? { ...item, isPublic: !item.isPublic } : item
    ))
  }

  const GalleryForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Judul Foto</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Masukkan judul foto"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi foto atau dokumentasi"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="URL gambar atau upload gambar"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          <Label htmlFor="photographer">Photographer</Label>
          <Input
            id="photographer"
            value={formData.photographer}
            onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
            placeholder="Nama photographer"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="instalasi, proyek, teknologi"
        />
      </div>

      <div>
        <Label htmlFor="location">Lokasi</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Lokasi pengambilan foto"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dimensions">Dimensi (WxH)</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="1920x1080"
          />
        </div>

        <div>
          <Label htmlFor="fileSize">Ukuran File</Label>
          <Input
            id="fileSize"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
            placeholder="2.3 MB"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="w-4 h-4"
            aria-label="Tampilkan di website"
          />
          <Label htmlFor="isPublic">Tampilkan di website</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
            aria-label="Foto unggulan"
          />
          <Label htmlFor="featured">Foto unggulan</Label>
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
        {submitLabel}
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Manajemen Galeri</h1>
        <p className="text-gray-600">Kelola galeri foto dan dokumentasi</p>
      </div>

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
                <GalleryForm onSubmit={handleAddItem} submitLabel="Tambah Foto" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          Unggulan
                        </Badge>
                      )}
                      {!item.isPublic && (
                        <Badge variant="secondary">
                          Privat
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
                      <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs opacity-90 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-xs text-gray-500">{item.dimensions}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{item.uploadDate}</span>
                    </div>

                    {item.photographer && (
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{item.photographer}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(item.id)}
                          className={item.featured ? "bg-yellow-50 border-yellow-200" : ""}
                        >
                          {item.featured ? "★" : "☆"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublic(item.id)}
                          className={item.isPublic ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
                        >
                          {item.isPublic ? "👁" : "🔒"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Foto</DialogTitle>
              </DialogHeader>
              {viewingItem && (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={viewingItem.imageUrl}
                      alt={viewingItem.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Judul</Label>
                      <p className="text-sm text-gray-600">{viewingItem.title}</p>
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <p className="text-sm text-gray-600">{viewingItem.category}</p>
                    </div>
                    <div>
                      <Label>Photographer</Label>
                      <p className="text-sm text-gray-600">{viewingItem.photographer || "-"}</p>
                    </div>
                    <div>
                      <Label>Lokasi</Label>
                      <p className="text-sm text-gray-600">{viewingItem.location || "-"}</p>
                    </div>
                    <div>
                      <Label>Dimensi</Label>
                      <p className="text-sm text-gray-600">{viewingItem.dimensions}</p>
                    </div>
                    <div>
                      <Label>Ukuran File</Label>
                      <p className="text-sm text-gray-600">{viewingItem.fileSize}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <p className="text-sm text-gray-600">{viewingItem.description}</p>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {viewingItem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
              <GalleryForm onSubmit={handleEditItem} submitLabel="Simpan Perubahan" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
