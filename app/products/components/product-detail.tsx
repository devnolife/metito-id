"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  MapPin,
  Settings,
  Shield,
  Truck,
  Calendar,
  Eye,
  Download,
  Share2
} from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price: number
  capacity?: string
  efficiency?: string
  location?: string
  application?: "Industrial" | "Municipal"
  features: string[]
  warranty?: string
  delivery?: string
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductDetailProps {
  product: Product
  onBack: () => void
  onEdit: (product: Product) => void
  onInquiry: (product: Product) => void
}

export function ProductDetail({
  product,
  onBack,
  onEdit,
  onInquiry
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Detail produk pengolahan air</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(product)}>
            Edit Produk
          </Button>
          <Button onClick={() => onInquiry(product)}>
            Minta Penawaran
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setImageModalOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informasi Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kategori</span>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aplikasi</span>
                <Badge variant={product.application === "Industrial" ? "default" : "secondary"}>
                  {product.application || "N/A"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status Stok</span>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "Tersedia" : "Habis"}
                </Badge>
              </div>

              {product.isFeatured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="default">Produk Unggulan</Badge>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Harga</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Spesifikasi Teknis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.capacity && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kapasitas</span>
                  <span className="font-medium">{product.capacity}</span>
                </div>
              )}

              {product.efficiency && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Efisiensi</span>
                  <span className="font-medium">{product.efficiency}</span>
                </div>
              )}

              {product.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lokasi</span>
                  <span className="font-medium">{product.location}</span>
                </div>
              )}

              {product.warranty && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Garansi</span>
                  <span className="font-medium">{product.warranty}</span>
                </div>
              )}

              {product.delivery && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pengiriman</span>
                  <span className="font-medium">{product.delivery}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          {product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fitur Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {product.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Dokumen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Dokumen {index + 1}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Unduh
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meta Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Dibuat:</span> {formatDate(product.createdAt)}
            </div>
            <div>
              <span className="font-medium">Diperbarui:</span> {formatDate(product.updatedAt)}
            </div>
            {product.metaTitle && (
              <div className="md:col-span-2">
                <span className="font-medium">SEO Title:</span> {product.metaTitle}
              </div>
            )}
            {product.metaDescription && (
              <div className="md:col-span-2">
                <span className="font-medium">SEO Description:</span> {product.metaDescription}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            {product.images.length > 0 && (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  className="bg-white/80 hover:bg-white"
                >
                  ‹
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  className="bg-white/80 hover:bg-white"
                >
                  ›
                </Button>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="text-center text-sm text-gray-600">
              {selectedImage + 1} dari {product.images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 
