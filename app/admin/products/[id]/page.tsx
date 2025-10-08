"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProducts } from '@/components/admin/products/hooks/use-products'
import { Product } from '@/components/admin/products/types/product'
import { LoadingOverlay } from '@/components/admin/ui/loading-overlay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, Package, Tag, MapPin, Zap, Calendar, CheckCircle, XCircle, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { getProduct } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getProduct(id)
        if (isMounted) setProduct(data)
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Gagal memuat produk')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (id) fetchData()
    return () => { isMounted = false }
  }, [id, getProduct])

  if (loading) {
    return <LoadingOverlay message="Memuat produk..." submessage="Mohon tunggu" type="default" />
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8 space-y-4">
            <h1 className="text-xl font-semibold">Produk tidak ditemukan</h1>
            <p className="text-gray-600">{error || 'Data produk tidak tersedia.'}</p>
            <Button asChild>
              <Link href="/admin/products">Kembali ke daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value?: string) => {
    if (!value) return 'Rp 0'
    const numValue = parseFloat(value.replace(/[^\d.-]/g, ''))
    if (isNaN(numValue)) return value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numValue)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Produk
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.filter(url => url && url.trim() !== '').map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={imageUrl}
                        alt={`${product.name} - Gambar ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          Utama
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.shortDesc && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Deskripsi Singkat</h3>
                  <p className="text-gray-900">{product.shortDesc}</p>
                </div>
              )}
              {product.description && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Deskripsi Lengkap</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fitur Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Spesifikasi Teknis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {product.inStock ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Tersedia
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Stok Habis
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-amber-500">
                    <Star className="w-3 h-3 mr-1" />
                    Unggulan
                  </Badge>
                )}
                {product.isActive ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 border-gray-600">
                    Non-Aktif
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Price */}
              {product.price && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Harga</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</div>
                </div>
              )}

              <Separator />

              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Kategori</div>
                    <div className="font-medium">{product.category.name}</div>
                  </div>
                </div>
              )}

              {/* Application */}
              {product.application && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Aplikasi</div>
                    <div className="font-medium">{product.application}</div>
                  </div>
                </div>
              )}

              {/* Location */}
              {product.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Lokasi</div>
                    <div className="font-medium">{product.location}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Details */}
          {(product.capacity || product.efficiency || product.warranty || product.delivery) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Teknis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.capacity && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Kapasitas</div>
                    <div className="font-medium">{product.capacity}</div>
                  </div>
                )}
                {product.efficiency && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Efisiensi
                    </div>
                    <div className="font-medium">{product.efficiency}</div>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Garansi</div>
                    <div className="font-medium">{product.warranty}</div>
                  </div>
                )}
                {product.delivery && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Waktu Pengiriman</div>
                    <div className="font-medium">{product.delivery}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Dibuat
                </div>
                <div className="font-medium">{formatDate(product.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Terakhir Diubah
                </div>
                <div className="font-medium">{formatDate(product.updatedAt)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Slug</div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{product.slug}</code>
              </div>
            </CardContent>
          </Card>

          {/* SEO Info */}
          {(product.metaTitle || product.metaDescription) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {product.metaTitle && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Meta Title</div>
                    <div className="font-medium">{product.metaTitle}</div>
                  </div>
                )}
                {product.metaDescription && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Meta Description</div>
                    <div className="text-gray-700">{product.metaDescription}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
