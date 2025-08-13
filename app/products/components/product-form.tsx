"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ProductFormData {
  name: string
  description: string
  shortDesc: string
  price: number
  capacity: string
  efficiency: string
  location: string
  application: "Industrial" | "Municipal" | ""
  features: string[]
  warranty: string
  delivery: string
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  categories: Category[]
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitLabel?: string
}

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Simpan Produk"
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    shortDesc: "",
    price: 0,
    capacity: "",
    efficiency: "",
    location: "",
    application: "",
    features: [],
    warranty: "",
    delivery: "",
    categoryId: "",
    inStock: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    ...initialData
  })

  const [newFeature, setNewFeature] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setUploadedImages(prev => [...prev, ...result.urls])
        toast.success('Gambar berhasil diupload')
      } else {
        toast.error('Gagal upload gambar')
      }
    } catch (error) {
      toast.error('Error saat upload gambar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Nama produk wajib diisi")
      return
    }

    if (!formData.categoryId) {
      toast.error("Kategori wajib dipilih")
      return
    }

    if (formData.price <= 0) {
      toast.error("Harga harus lebih dari 0")
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama produk"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Kategori *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleInputChange('categoryId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
            <Textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => handleInputChange('shortDesc', e.target.value)}
              placeholder="Deskripsi singkat produk"
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi Lengkap</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi lengkap produk"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Harga (Rp) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Contoh: 1000 L/h"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efisiensi</Label>
              <Input
                id="efficiency"
                value={formData.efficiency}
                onChange={(e) => handleInputChange('efficiency', e.target.value)}
                placeholder="Contoh: 95%"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Teknis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Lokasi instalasi"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="application">Aplikasi</Label>
              <Select
                value={formData.application}
                onValueChange={(value) => handleInputChange('application', value as "Industrial" | "Municipal")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih aplikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Municipal">Municipal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Fitur Produk</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Tambah fitur baru"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim() || isLoading}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-1 hover:text-red-500"
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warranty">Garansi</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => handleInputChange('warranty', e.target.value)}
                placeholder="Contoh: 1 tahun"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="delivery">Pengiriman</Label>
              <Input
                id="delivery"
                value={formData.delivery}
                onChange={(e) => handleInputChange('delivery', e.target.value)}
                placeholder="Contoh: 2-3 minggu"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambar Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="imageUpload">Upload Gambar</Label>
            <div className="mt-2">
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
              <label htmlFor="imageUpload">
                <Button type="button" variant="outline" disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih Gambar
                </Button>
              </label>
            </div>
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <Label>Gambar yang Diupload</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                id="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleInputChange('inStock', e.target.checked)}
                disabled={isLoading}
                className="rounded"
              />
              <Label htmlFor="inStock">Tersedia di Stok</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                disabled={isLoading}
                className="rounded"
              />
              <Label htmlFor="isFeatured">Produk Unggulan</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="metaTitle">SEO Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Judul untuk SEO"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="metaDescription">SEO Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Deskripsi untuk SEO"
              rows={2}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  )
} 
