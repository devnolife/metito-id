"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Upload, X, Eye } from "lucide-react"
import { toast } from "sonner"
import { LoadingButton } from "../ui/loading-state"

interface ProductImage {
  id: string
  url: string
  fileName: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface ProductFormData {
  name: string
  categoryId: string
  price: string
  application: string
  capacity: string
  efficiency: string
  location: string
  specs: string
  description: string
  shortDesc: string
  features: string
  warranty: string
  delivery: string
  inStock: boolean
  isFeatured: boolean
}

interface ProductFormProps {
  formData: ProductFormData
  setFormData: (data: ProductFormData | ((prev: ProductFormData) => ProductFormData)) => void
  categories: Category[]
  productImages: ProductImage[]
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete: () => void
  handleImageClick: (image: ProductImage) => void
  isUploading: boolean
  isSubmitting: boolean
  onSubmit: () => void
  submitLabel: string
}

export function ProductForm({
  formData,
  setFormData,
  categories,
  productImages,
  handleFileUpload,
  handleImageDelete,
  handleImageClick,
  isUploading,
  isSubmitting,
  onSubmit,
  submitLabel
}: ProductFormProps) {
  // Stable callback references to prevent re-renders - removed generic handlers to prevent re-renders

  // Memoized handlers for each field to prevent re-creation
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
  }, [setFormData])

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, price: e.target.value }))
  }, [setFormData])

  const handleCapacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, capacity: e.target.value }))
  }, [setFormData])

  const handleEfficiencyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, efficiency: e.target.value }))
  }, [setFormData])

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, location: e.target.value }))
  }, [setFormData])

  const handleSpecsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, specs: e.target.value }))
  }, [setFormData])

  const handleFeaturesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, features: e.target.value }))
  }, [setFormData])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }))
  }, [setFormData])

  const handleShortDescChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, shortDesc: e.target.value }))
  }, [setFormData])

  const handleWarrantyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, warranty: e.target.value }))
  }, [setFormData])

  const handleDeliveryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, delivery: e.target.value }))
  }, [setFormData])

  const handleCategoryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }))
  }, [setFormData])

  const handleApplicationChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, application: value }))
  }, [setFormData])

  const handleInStockChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }))
  }, [setFormData])

  const handleIsFeaturedChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, isFeatured: checked }))
  }, [setFormData])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Produk</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Masukkan nama produk"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="categoryId">Kategori</Label>
          <Select
            value={formData.categoryId}
            onValueChange={handleCategoryChange}
            disabled={isSubmitting}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Harga (USD)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={handlePriceChange}
            placeholder="0"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="application">Aplikasi</Label>
          <Select
            value={formData.application}
            onValueChange={handleApplicationChange}
            disabled={isSubmitting}
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={handleCapacityChange}
            placeholder="contoh: 1000 GPD"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="efficiency">Efisiensi</Label>
          <Input
            id="efficiency"
            value={formData.efficiency}
            onChange={handleEfficiencyChange}
            placeholder="contoh: 99.5%"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="contoh: USA"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Image Upload Area */}
      <div>
        <Label>Gambar Produk</Label>
        <div className="mt-2 flex justify-center">
          {productImages.length > 0 ? (
            <div className="relative group">
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={productImages[0].url}
                  alt={productImages[0].fileName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleImageClick(productImages[0])}
                  disabled={isSubmitting}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleImageDelete}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              {isUploading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Mengupload...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Klik untuk upload gambar
                    <br />
                    <span className="text-xs">PNG, JPG, JPEG hingga 5MB</span>
                  </p>
                </>
              )}
            </label>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload product image"
            disabled={isSubmitting || isUploading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specs">Specifications (JSON format)</Label>
        <Input
          id="specs"
          value={formData.specs}
          onChange={handleSpecsChange}
          placeholder='{"pressure": "1000 PSI", "temperature": "50°C"}'
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
        <Input
          id="features"
          value={formData.features}
          onChange={handleFeaturesChange}
          placeholder="Tekanan Tinggi, Pemulihan Energi, Auto Flush"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Masukkan deskripsi produk"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
        <Textarea
          id="shortDesc"
          value={formData.shortDesc}
          onChange={handleShortDescChange}
          placeholder="Masukkan deskripsi singkat"
          rows={2}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="warranty">Garansi</Label>
          <Input
            id="warranty"
            value={formData.warranty}
            onChange={handleWarrantyChange}
            placeholder="contoh: 2 tahun"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="delivery">Pengiriman</Label>
          <Input
            id="delivery"
            value={formData.delivery}
            onChange={handleDeliveryChange}
            placeholder="contoh: 2-4 minggu"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Product Status Controls */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={handleInStockChange}
            disabled={isSubmitting}
          />
          <Label htmlFor="inStock">Stok Tersedia</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={handleIsFeaturedChange}
            disabled={isSubmitting}
          />
          <Label htmlFor="isFeatured">Produk Unggulan</Label>
        </div>
      </div>

      <LoadingButton
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()

          if (!formData.name?.trim()) {
            toast.error("Nama produk wajib diisi")
            return
          }
          if (!formData.categoryId) {
            toast.error("Kategori wajib dipilih")
            return
          }
          if (!formData.price?.toString().trim()) {
            toast.error("Harga wajib diisi")
            return
          }

          onSubmit()
        }}
        className="w-full"
        variant="primary"
        type="button"
        disabled={isUploading}
        loading={isSubmitting || isUploading}
      >
        {isUploading ? "Sedang mengupload..." : submitLabel}
      </LoadingButton>
    </div>
  )
}

export default React.memo(ProductForm)
