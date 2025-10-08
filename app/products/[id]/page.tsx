"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  ArrowLeft,
  ZoomIn,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight
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
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false)
  const [whatsappContacts, setWhatsappContacts] = useState<Array<{
    id: string
    name: string
    phoneNumber: string
    email: string | null
    role: string | null
    color: string
  }>>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          throw new Error('Produk tidak ditemukan , silahkan kembali ke halaman utama ')
        }

        const result = await response.json()
        const productData = result.data || result
        setProduct(productData)

        if (productData.categoryId) {
          const relatedResponse = await fetch(`/api/products?categoryId=${productData.categoryId}&limit=3`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            const filtered = relatedData.products?.filter((p: Product) => p.id !== productData.id).slice(0, 3) || []
            setRelatedProducts(filtered)
          }
        }
      } catch (err) {
        setError('Produk tidak ditemukan')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  // Fetch WhatsApp contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/whatsapp-contacts')
        const data = await response.json()
        if (data.success) {
          setWhatsappContacts(data.data)
        }
      } catch (error) {
        console.error('Error fetching WhatsApp contacts:', error)
      }
    }
    fetchContacts()
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isImageZoomed || !product) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageZoomed(false)
      } else if (e.key === 'ArrowLeft' && selectedImage > 0) {
        setSelectedImage(selectedImage - 1)
      } else if (e.key === 'ArrowRight' && selectedImage < (product.images?.length || 1) - 1) {
        setSelectedImage(selectedImage + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isImageZoomed, selectedImage, product])

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

  const handleWhatsAppClick = (phoneNumber?: string) => {
    // If phone number is provided, use it directly
    if (phoneNumber && typeof phoneNumber === 'string') {
      const message = encodeURIComponent(
        `Halo, saya tertarik dengan ${product.name}. Bisakah Anda memberikan informasi lebih lanjut dan penawaran harga?`
      )
      // Format phone number
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
      const formattedNumber = cleanNumber.startsWith('0') ? '62' + cleanNumber.slice(1) : cleanNumber
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`
      window.open(whatsappUrl, "_blank")
      setIsWhatsAppDialogOpen(false)
    } else {
      // Open dialog to choose contact
      setIsWhatsAppDialogOpen(true)
    }
  }

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Inquiry: ${product.name}`)
    const body = encodeURIComponent(
      `Halo,\n\nSaya tertarik dengan produk ${product.name}.\n\nMohon informasi lebih lanjut mengenai:\n- Spesifikasi lengkap\n- Harga dan penawaran\n- Ketersediaan\n\nTerima kasih.`
    )
    window.location.href = `mailto:info@metito.id?subject=${subject}&body=${body}`
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - ${product.shortDesc || product.description || 'Produk Water Treatment'}`,
      url: window.location.href
    }

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link produk berhasil disalin ke clipboard!')
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          alert('Link produk berhasil disalin ke clipboard!')
        } catch (err) {
          alert('Gagal menyalin link. Silakan salin manual: ' + window.location.href)
        }
        document.body.removeChild(textArea)
      }
    }
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
            {/* Main Image with Zoom */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
              <Image
                src={displayImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                onClick={() => setIsImageZoomed(true)}
              />
              <button
                onClick={() => setIsImageZoomed(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                title="Perbesar gambar"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>

              {/* Navigation arrows for main image */}
              {displayImages.length > 1 && (
                <>
                  {selectedImage > 0 && (
                    <button
                      onClick={() => setSelectedImage(selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      title="Gambar sebelumnya"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  {selectedImage < displayImages.length - 1 && (
                    <button
                      onClick={() => setSelectedImage(selectedImage + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      title="Gambar selanjutnya"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                </>
              )}

              {/* Image counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {displayImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedImage === index
                      ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-blue-500/10" />
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
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
                  onClick={() => handleWhatsAppClick()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat WhatsApp
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 rounded-xl py-3 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Card - Full Width */}
        <Card className="bg-blue-50 border-blue-200 mt-12">
          <CardContent className="p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Butuh Konsultasi?</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Tim ahli kami siap membantu Anda memilih solusi yang tepat untuk kebutuhan spesifik Anda.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleEmailClick}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-6 text-lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Hubungi via Email
                </Button>
                <Button
                  onClick={() => handleWhatsAppClick()}
                  className="bg-green-600 hover:bg-green-700 rounded-lg px-8 py-6 text-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

      {/* Image Lightbox Modal */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-10"
            title="Tutup"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            {selectedImage + 1} / {displayImages.length}
          </div>

          {/* Previous button */}
          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(selectedImage - 1)
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              title="Gambar sebelumnya"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {selectedImage < displayImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(selectedImage + 1)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              title="Gambar selanjutnya"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Main zoomed image */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayImages[selectedImage]}
              alt={product.name}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Thumbnail strip at bottom */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-3xl">
              <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImage(index)
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Contact Selection Dialog */}
      <Dialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Pilih Kontak WhatsApp</DialogTitle>
            <DialogDescription>
              Pilih salah satu tim kami untuk berkonsultasi tentang {product.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {whatsappContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleWhatsAppClick(contact.phoneNumber)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-700">
                      {contact.name}
                    </h4>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {contact.phoneNumber}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Klik salah satu kontak untuk membuka WhatsApp
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
