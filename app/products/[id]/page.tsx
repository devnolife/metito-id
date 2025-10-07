"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  Droplets,
  Calendar,
  Settings,
  Loader2,
  ArrowLeft
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price: number | string
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
  category: {
    id: string
    name: string
    slug: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()
        setProduct(data)

        if (data.categoryId) {
          const relatedResponse = await fetch(`/api/products?categoryId=${data.categoryId}&limit=3`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            const filtered = relatedData.products?.filter((p: Product) => p.id !== data.id).slice(0, 3) || []
            setRelatedProducts(filtered)
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Produk tidak ditemukan')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Produk tidak ditemukan'}</h2>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Kembali ke Produk
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      if (isNaN(Number(price))) return price
      price = Number(price)
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan ${product.name}. Bisakah Anda memberikan informasi lebih lanjut dan penawaran harga?`
    )
    const whatsappUrl = `https://wa.me/6281234567890?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const displayImages = product.images && product.images.length > 0
    ? product.images
    : ['/placeholder.jpg']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Beranda</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">Produk</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Produk
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={displayImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-100 text-blue-800">{product.category.name}</Badge>
                <Badge className={`${product.inStock ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {product.inStock ? "Tersedia" : "Pesan Terlebih Dahulu"}
                </Badge>
                {product.application && (
                  <Badge variant="outline">{product.application}</Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {product.shortDesc && (
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {product.shortDesc}
                </p>
              )}

              {product.description && (
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {product.capacity && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Kapasitas</span>
                  </div>
                  <span className="text-lg text-gray-600">{product.capacity}</span>
                </div>
              )}
              {product.efficiency && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Efisiensi</span>
                  </div>
                  <span className="text-lg text-gray-600">{product.efficiency}</span>
                </div>
              )}
              {product.warranty && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Garansi</span>
                  </div>
                  <span className="text-lg text-gray-600">{product.warranty}</span>
                </div>
              )}
              {product.delivery && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Pengiriman</span>
                  </div>
                  <span className="text-lg text-gray-600">{product.delivery}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 text-lg font-semibold rounded-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Telepon
                </Button>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl py-3">
                  <Heart className="w-5 h-5 mr-2" />
                  Simpan
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl py-3">
                  <Share2 className="w-5 h-5 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Butuh Konsultasi?</h3>
                <p className="text-gray-600 mb-4">
                  Tim ahli kami siap membantu Anda memilih solusi yang tepat untuk kebutuhan spesifik Anda.
                </p>
                <div className="flex gap-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">
                    Minta Penawaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {(product.features.length > 0 || product.documents.length > 0) && (
          <div className="mt-16">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 mb-8">
                {product.features.length > 0 && (
                  <TabsTrigger value="features" className="text-sm">Fitur & Keunggulan</TabsTrigger>
                )}
                {product.documents.length > 0 && (
                  <TabsTrigger value="documents" className="text-sm">Dokumen</TabsTrigger>
                )}
              </TabsList>

              {product.features.length > 0 && (
                <TabsContent value="features">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Fitur & Keunggulan</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {product.documents.length > 0 && (
                <TabsContent value="documents">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Dokumen Produk</h3>
                      <div className="space-y-4">
                        {product.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{doc}</span>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <Image
                      src={relatedProduct.images?.[0] || '/placeholder.jpg'}
                      alt={relatedProduct.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-2">{relatedProduct.category.name}</Badge>
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h4>
                    {relatedProduct.shortDesc && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedProduct.shortDesc}</p>
                    )}
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      {formatPrice(relatedProduct.price)}
                    </div>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                      <Link href={`/products/${relatedProduct.id}`}>
                        Lihat Detail
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
