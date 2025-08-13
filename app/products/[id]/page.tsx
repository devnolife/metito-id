"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  Shield,
  Award,
  Droplets,
  Gauge,
  Calendar,
  MapPin,
  ArrowLeft,
  Zap,
  Settings,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
  inStock: boolean
  specs: string[]
  capacity: string
  warranty: string
  delivery: string
  detailedSpecs: {
    [key: string]: string
  }
  features: string[]
  applications: string[]
  certifications: string[]
}

// Mock product data - in real app, this would come from API
const mockProduct: Product = {
  id: "1",
  name: "Sistem RO Industrial 10.000 LPH",
  description: "Sistem reverse osmosis untuk kebutuhan industri dengan kapasitas tinggi dan efisiensi optimal. Dirancang khusus untuk aplikasi industri yang membutuhkan air berkualitas tinggi dengan konsistensi yang dapat diandalkan.",
  price: 85000000,
  originalPrice: 95000000,
  images: [
    "/images/products/1751113221463_vprh85xdwf.jpg",
    "/images/products/1751115076198_7co6h7om303.jpg",
    "/images/products/1751121933661_pcw7o3dbzfs.jpg",
    "/images/products/1751207300894_y53c2mjo2z.jpg"
  ],
  category: "Reverse Osmosis",
  rating: 4.8,
  reviews: 24,
  inStock: true,
  specs: ["10.000 LPH", "Efisiensi 95%", "Otomatis", "Stainless Steel 316"],
  capacity: "10.000 LPH",
  warranty: "2 Tahun",
  delivery: "2-3 Minggu",
  detailedSpecs: {
    "Kapasitas": "10.000 LPH",
    "Efisiensi": "95%",
    "Tekanan Operasi": "15-20 Bar",
    "Material": "Stainless Steel 316",
    "Dimensi": "3000 x 1500 x 2000 mm",
    "Berat": "2500 kg",
    "Konsumsi Listrik": "15 kW",
    "Inlet Connection": "6 inch",
    "Outlet Connection": "4 inch",
    "Kontrol": "PLC Siemens",
    "Display": "HMI Touch Screen 10 inch",
    "Sertifikasi": "ISO 9001, CE Mark"
  },
  features: [
    "Sistem flush otomatis untuk memperpanjang umur membran",
    "Monitoring kualitas air real-time",
    "Sistem recovery energi untuk efisiensi tinggi",
    "Proteksi tekanan tinggi dan rendah",
    "Indikator penggantian filter",
    "Remote monitoring capability",
    "Sistem sanitasi otomatis",
    "Alarm dan notifikasi sistem"
  ],
  applications: [
    "Industri Farmasi",
    "Industri Makanan & Minuman",
    "Industri Elektronik",
    "Pembangkit Listrik",
    "Industri Kimia",
    "Rumah Sakit"
  ],
  certifications: [
    "ISO 9001:2015",
    "CE Marking",
    "NSF/ANSI 61",
    "ASME Boiler Code"
  ]
}

const relatedProducts = [
  {
    id: "2",
    name: "Filter Air Multimedia 5.000 LPH",
    price: 45000000,
    image: "/images/products/1751115076198_7co6h7om303.jpg",
    rating: 4.7
  },
  {
    id: "3",
    name: "Sistem UV Sterilizer 3.000 LPH",
    price: 25000000,
    image: "/images/products/1751121933661_pcw7o3dbzfs.jpg",
    rating: 4.6
  },
  {
    id: "4",
    name: "Dosing System Chemical",
    price: 35000000,
    image: "/images/products/1751207300894_y53c2mjo2z.jpg",
    rating: 4.5
  }
]

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // In real app, fetch product by ID from API
    setProduct(mockProduct)
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h2>
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

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan ${product.name}. Bisakah Anda memberikan informasi lebih lanjut dan penawaran harga?`
    )
    const whatsappUrl = `https://wa.me/6281234567890?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
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

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
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
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-100 text-blue-800">{product.category}</Badge>
                <Badge className={`${product.inStock ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {product.inStock ? "Tersedia" : "Pesan Terlebih Dahulu"}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="text-lg font-semibold text-gray-900 ml-2">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} ulasan)</span>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold text-blue-600">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-xl text-gray-500 line-through">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Kapasitas</span>
                </div>
                <span className="text-lg text-gray-600">{product.capacity}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Garansi</span>
                </div>
                <span className="text-lg text-gray-600">{product.warranty}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Pengiriman</span>
                </div>
                <span className="text-lg text-gray-600">{product.delivery}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Sertifikasi</span>
                </div>
                <span className="text-lg text-gray-600">ISO 9001</span>
              </div>
            </div>

            {/* Action Buttons */}
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

            {/* Contact Info */}
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

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 mb-8">
              <TabsTrigger value="specifications" className="text-sm">Spesifikasi</TabsTrigger>
              <TabsTrigger value="features" className="text-sm">Fitur</TabsTrigger>
              <TabsTrigger value="applications" className="text-sm">Aplikasi</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm">Ulasan</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Spesifikasi Teknis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.detailedSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Fitur Unggulan</h3>
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

            <TabsContent value="applications">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Aplikasi Industri</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {product.applications.map((application, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{application}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Pelanggan</h3>
                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">PT. Industri Makanan ABC</div>
                          <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600">5.0</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        "Sistem RO ini sangat membantu dalam proses produksi kami. Kualitas air yang dihasilkan sangat baik dan konsisten. Tim support juga sangat responsif."
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">RS. Sehat Sentosa</div>
                          <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                            ))}
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        "Instalasi berjalan lancar dan sistem bekerja dengan sangat baik. Maintenance yang mudah menjadi nilai plus."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">{relatedProduct.rating}</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(relatedProduct.price)}
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
      </div>

      <Footer />
    </div>
  )
} 
