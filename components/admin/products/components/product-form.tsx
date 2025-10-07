"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCategories } from "../hooks/use-categories"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Upload, Save, Loader2, ImageIcon } from "lucide-react"
import { Product } from "../types/product"
import Image from "next/image"

interface ProductFormProps {
  product?: Product
  isEdit?: boolean
  onSubmit: (data: Partial<Product>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ product, isEdit = false, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [priceInputType, setPriceInputType] = useState<"number" | "text">("number")
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    shortDesc: '',
    // Price is now string and optional
    price: '',
    capacity: '',
    efficiency: '',
    location: '',
    application: undefined,
    specs: {},
    features: [],
    warranty: '',
    delivery: '',
    images: [],
    documents: [],
    categoryId: '',
    inStock: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
  })

  const [newFeature, setNewFeature] = useState('')
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { categories, loading: categoriesLoading } = useCategories()
  const { toast } = useToast()

  // Load product data if editing
  useEffect(() => {
    if (product && isEdit) {
      // Detect if price is text or number
      const priceValue = product.price || ''
      const isNumericPrice = priceValue && !isNaN(parseFloat(priceValue.replace(/[^\d.-]/g, '')))
      setPriceInputType(isNumericPrice ? "number" : "text")

      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDesc: product.shortDesc || '',
        price: product.price || '',
        capacity: product.capacity || '',
        efficiency: product.efficiency || '',
        location: product.location || '',
        application: product.application,
        specs: product.specs || {},
        features: product.features || [],
        warranty: product.warranty || '',
        delivery: product.delivery || '',
        images: product.images || [],
        documents: product.documents || [],
        categoryId: product.categoryId || '',
        inStock: product.inStock ?? true,
        isFeatured: product.isFeatured ?? false,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
      })

      // Convert specs object to array for editing
      if (product.specs) {
        const specsArray = Object.entries(product.specs).map(([key, value]) => ({
          key,
          value: String(value)
        }))
        setSpecs(specsArray)
      }
    }
  }, [product, isEdit])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required'
    }

    // Price is now optional and can be text
    // No validation needed for price

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.shortDesc?.trim()) {
      newErrors.shortDesc = 'Short description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert specs array back to object
      const specsObject = specs.reduce((acc, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          acc[spec.key.trim()] = spec.value.trim()
        }
        return acc
      }, {} as Record<string, any>)

      const submitData = {
        ...formData,
        specs: specsObject,
      }

      await onSubmit(submitData)
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  const addSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }])
  }

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    setSpecs(prev => prev.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    ))
  }

  const removeSpec = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index))
  }

  // Handle toggle between number and text input
  const handlePriceTypeToggle = (isText: boolean) => {
    setPriceInputType(isText ? "text" : "number")
    // Clear price when switching modes
    if (isText) {
      setFormData(prev => ({ ...prev, price: "" }))
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate file type and size
    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: `${file.name} bukan file gambar`,
          variant: "destructive",
        })
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `${file.name} terlalu besar (max 5MB)`,
          variant: "destructive",
        })
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    try {
      setUploading(true)
      const uploadedUrls: string[] = []

      for (const file of validFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'products')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.data.url)
        } else {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      // Add new images to existing images
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }))

      toast({
        title: "Berhasil",
        description: `${uploadedUrls.length} gambar berhasil diupload`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal upload gambar",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }))
  }

  const formatCurrency = (value?: string | number) => {
    if (!value) return 'Rp 0'

    // If already a string, return as is
    if (typeof value === 'string') {
      // Try to parse as number
      const numValue = parseFloat(value.replace(/[^\d.-]/g, ''))
      if (isNaN(numValue)) {
        // If not a number, return the string as-is
        return value
      }
      // Format as currency
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(numValue)
    }

    // If it's a number, format directly
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Produk' : 'Simpan Produk'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Info Dasar</TabsTrigger>
          <TabsTrigger value="details">Detail Teknis</TabsTrigger>
          <TabsTrigger value="features">Fitur & Spesifikasi</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Water Filtration System"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Kategori *</Label>
                  <Select
                    value={formData.categoryId || undefined}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                      <SelectValue placeholder={categoriesLoading ? 'Memuat kategori...' : 'Pilih kategori'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Deskripsi Singkat *</Label>
                <Input
                  id="shortDesc"
                  value={formData.shortDesc || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  placeholder="Deskripsi singkat untuk preview"
                  className={errors.shortDesc ? "border-red-500" : ""}
                />
                {errors.shortDesc && <p className="text-sm text-red-500">{errors.shortDesc}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Lengkap</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi detail produk..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price">Harga (IDR)</Label>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={priceInputType === "number" ? "font-semibold text-blue-600" : "text-gray-500"}>
                        Angka
                      </span>
                      <Switch
                        checked={priceInputType === "text"}
                        onCheckedChange={handlePriceTypeToggle}
                      />
                      <span className={priceInputType === "text" ? "font-semibold text-blue-600" : "text-gray-500"}>
                        Teks
                      </span>
                    </div>
                  </div>
                  <Input
                    id="price"
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData(prev => ({ ...prev, price: val }))
                    }}
                    placeholder={priceInputType === "number" ? "Contoh: 1000000" : "Contoh: Hubungi Kami"}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {formData.price && priceInputType === "number" && (
                    <p className="text-sm text-gray-500">{formatCurrency(formData.price)}</p>
                  )}
                  {priceInputType === "text" && (
                    <p className="text-xs text-gray-500">Masukkan teks seperti "Hubungi Kami", "Call for Price", dll</p>
                  )}
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application">Aplikasi</Label>
                  <Select
                    value={formData.application || undefined}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      application: value as 'Industrial' | 'Municipal'
                    }))}
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

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, inStock: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="inStock">Tersedia di Stok</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, isFeatured: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="isFeatured">Produk Unggulan</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gambar Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div className="space-y-2">
                <Label>Upload Gambar</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="productImages"
                    disabled={uploading}
                  />
                  <label htmlFor="productImages" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">Klik untuk upload</span>
                        {" "}atau drag & drop
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB (Multiple files)</p>
                    </div>
                  </label>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading gambar...
                  </div>
                )}
              </div>

              {/* Image Preview Grid */}
              {formData.images && formData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Gambar Saat Ini ({formData.images.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Utama
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Tip: Gambar pertama akan digunakan sebagai gambar utama
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Details */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Teknis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapasitas</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="Contoh: 1000 L/hour"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">Efisiensi</Label>
                  <Input
                    id="efficiency"
                    value={formData.efficiency || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, efficiency: e.target.value }))}
                    placeholder="Contoh: 95%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warranty">Garansi</Label>
                  <Input
                    id="warranty"
                    value={formData.warranty || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                    placeholder="Contoh: 2 tahun"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery">Waktu Pengiriman</Label>
                  <Input
                    id="delivery"
                    value={formData.delivery || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.value }))}
                    placeholder="Contoh: 2-3 minggu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi Pemasangan</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Contoh: Makassar, Indonesia"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features & Specifications */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fitur Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Tambah fitur baru..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spesifikasi Teknis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" onClick={addSpec} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Spesifikasi
              </Button>

              {specs.map((spec, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={spec.key}
                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    placeholder="Nama spesifikasi"
                    className="flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="Nilai spesifikasi"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSpec(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Meta */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Title untuk SEO (opsional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Deskripsi untuk SEO (opsional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
} 
