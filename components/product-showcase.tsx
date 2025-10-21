"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  MessageCircle,
  Eye,
  Droplets,
  Waves,
  Zap,
  Settings,
  Gauge,
  FlaskConical,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { getSetting } from "@/lib/settings"

// Types
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  _count?: {
    products: number
  }
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price?: string
  capacity?: string
  efficiency?: string
  location?: string
  application?: 'Industrial' | 'Municipal'
  specs?: any
  features: string[]
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  inStock: boolean
  isFeatured: boolean
}

export function ProductShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState("all")
  const [showPrices, setShowPrices] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Kontak WhatsApp (tiga nomor yang diminta sebelumnya)
  const contacts = useRef([
    { name: 'Khudaivi', phone: '08979380767', template: 'Halo Khudaivi, saya tertarik dengan informasi produk Metito.' },
    { name: 'Musthamu', phone: '082322345616', template: 'Halo Musthamu, saya ingin menanyakan detail produk Metito.' },
    { name: 'Sales 1', phone: '081217603950', template: 'Halo Sales 1, saya membutuhkan penawaran terkait solusi pengolahan air.' }
  ])
  // Tidak perlu indeks; gunakan pemilihan acak

  // Map kategori dengan icon
  const categoryIcons: Record<string, any> = {
    "Sistem Membran": Droplets,
    "Unit Filtrasi": Waves,
    "Disinfeksi": Zap,
    "Pompa & Motor": Settings,
    "Monitoring": Gauge,
    "Dosis Kimia": FlaskConical,
  }

  // Load data from APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load settings
        const showPricesSetting = await getSetting('show_prices')
        setShowPrices(showPricesSetting !== false)

        // Load categories and products
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=50') // Ambil lebih banyak produk untuk showcase
        ])

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()

        if (categoriesData.success) {
          setCategories(categoriesData.data || [])
        }

        if (productsData.success) {
          setProducts(productsData.data?.products || [])
        }

      } catch (error) {
        console.error('Error loading data:', error)
        setError('Gagal memuat data produk. Silakan refresh halaman.')
        // Default to showing prices on error
        setShowPrices(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.shortDesc || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.id === selectedCategory
    const matchesApplication = selectedApplication === "all" || product.application === selectedApplication

    return matchesSearch && matchesCategory && matchesApplication
  })

  const normalizeNumber = (num: string) => {
    let digits = num.replace(/[^0-9+]/g, '')
    if (digits.startsWith('+')) digits = digits.slice(1)
    if (digits.startsWith('0')) digits = '62' + digits.slice(1)
    if (!digits.startsWith('62')) digits = '62' + digits
    return digits
  }

  const pickRandomContact = () => {
    const arr = contacts.current
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleWhatsAppClick = (product: Product) => {
    const contact = pickRandomContact()
    const baseTemplate = contact.template
    const productLine = product ? `\nProduk: ${product.name}` : ''
    const messageFull = `${baseTemplate}${productLine}\n\n(Kirim dari halaman produk Metito)`
    const encoded = encodeURIComponent(messageFull)
    const number = normalizeNumber(contact.phone)
    const url = `https://wa.me/${number}?text=${encoded}`
    const win = window.open(url, '_blank')
    if (!win) {
      navigator.clipboard?.writeText(messageFull)
      alert('Tidak bisa membuka WhatsApp. Pesan sudah disalin, tempel manual di aplikasi WhatsApp.')
    }
  }

  return (
    <section id="products" className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block animate-fade-in-up">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
              ✨ Pameran Produk
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent animate-fade-in-up animation-delay-100">
            Solusi Teknik Pengolahan Air Kami
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Temukan rangkaian lengkap solusi pengolahan air dan air limbah yang canggih yang dirancang untuk
            aplikasi industri dan perkotaan
          </p>
        </div>

        {/* Categories */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-full mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || Settings
              const isSelected = selectedCategory === category.id
              return (
                <Card
                  key={category.id}
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 border-0 overflow-hidden ${isSelected
                    ? "shadow-2xl shadow-blue-500/25"
                    : "shadow-lg hover:shadow-2xl"
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in-up 0.6s ease-out forwards'
                  }}
                  onClick={() => setSelectedCategory(isSelected ? "all" : category.id)}
                >
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 opacity-100"
                    : "bg-gradient-to-br from-gray-50 to-white opacity-100 group-hover:opacity-0"
                    }`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? "opacity-100" : ""
                    }`}></div>

                  <CardContent className="relative p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${isSelected
                      ? "bg-white/20 text-white scale-110 rotate-6"
                      : "bg-white text-gray-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-110 group-hover:rotate-6"
                      }`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className={`font-bold text-sm transition-colors duration-300 ${isSelected ? "text-white" : "text-gray-900 group-hover:text-white"
                      }`}>
                      {category.name}
                    </h3>
                    {category._count && (
                      <p className={`text-xs mt-1 transition-colors duration-300 ${isSelected ? "text-white/80" : "text-gray-500 group-hover:text-white/80"
                        }`}>
                        {category._count.products} produk
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <Input
              type="search"
              placeholder="Cari produk berdasarkan nama, deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-14 rounded-2xl border-2 border-gray-200 bg-white shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base placeholder:text-gray-400"
            />
          </div>
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="w-full md:w-56 h-14 rounded-2xl border-2 border-gray-200 bg-white shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 font-medium">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <SelectValue placeholder="Semua Aplikasi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">Semua Aplikasi</SelectItem>
              <SelectItem value="Industrial" className="rounded-lg">🏭 Industrial</SelectItem>
              <SelectItem value="Municipal" className="rounded-lg">🏙️ Municipal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat produk...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Muat Ulang
            </Button>
          </div>
        )}

        {/* Product Grid with Hover Effects */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-8">
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group relative overflow-visible border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in-up 0.6s ease-out forwards'
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                </div>

                {/* Floating detail card that appears on hover - larger coverage */}
                <div className="absolute -top-6 left-0 right-0 bottom-20 z-50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100 pointer-events-none">
                  <div className="mx-3 h-full bg-white border-2 border-blue-300 rounded-2xl shadow-2xl shadow-blue-500/30 overflow-hidden flex flex-col">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 shadow-lg text-sm px-3 py-1">
                          {product.application}
                        </Badge>
                        {product.efficiency && (
                          <div className="text-sm font-bold text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            {product.efficiency}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-2xl line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <span className="flex items-center gap-1.5">
                          📍 <span className="font-medium">{product.location || 'Global'}</span>
                        </span>
                        {product.inStock && (
                          <span className="ml-auto flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="font-medium">Tersedia</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content - full card coverage */}
                    <div className="flex-1 overflow-hidden p-6 bg-gradient-to-br from-white to-blue-50/30 flex flex-col justify-between">
                      {/* Extended Description */}
                      <div className="mb-5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></span>
                          Tentang Produk
                        </h4>
                        <div className="bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {product.description || product.shortDesc || 'Solusi pengolahan air berkualitas tinggi dengan teknologi terkini untuk memenuhi kebutuhan industri dan perkotaan. Produk ini dirancang dengan standar internasional dan telah terbukti efektif dalam berbagai aplikasi.'}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></span>
                            Keunggulan Utama
                          </h4>
                          <div className="space-y-2.5">
                            {product.features.slice(0, 5).map((feature: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-3 border-2 border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-800 font-medium leading-relaxed pt-0.5">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Category Badge at bottom */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 border-2 border-blue-400 shadow-lg">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-white/90 font-bold text-sm">📦 Kategori:</span>
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-bold px-3 py-1.5 text-sm">
                            {product.category.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Image Container */}
                <div className="aspect-[4/3] overflow-hidden relative rounded-t-3xl">
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Stock badge */}
                  {product.inStock && (
                    <div className="absolute top-4 left-4 z-10 transition-transform duration-300 group-hover:scale-110">
                      <Badge className="bg-green-500/90 backdrop-blur-md text-white shadow-lg border border-white/20">
                        <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-1"></span>
                        Tersedia
                      </Badge>
                    </div>
                  )}

                  {/* Featured badge */}
                  {product.isFeatured && (
                    <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:scale-110">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-md text-white shadow-lg border border-white/20">
                        ⭐ Unggulan
                      </Badge>
                    </div>
                  )}

                  {/* Efficiency badge on hover */}
                  {product.efficiency && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 backdrop-blur-md text-white shadow-lg border border-white/20">
                        ⚡ {product.efficiency}
                      </Badge>
                    </div>
                  )}

                  {/* Product title overlay - fixed at top */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white/95 via-white/90 to-transparent backdrop-blur-sm p-5 z-20">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        {product.location || 'Global'}
                      </p>
                      <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold border border-blue-200">
                        {product.application || 'Universal'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Always visible bottom section - stable fixed height */}
                <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50 rounded-b-3xl">
                  {/* Price Box */}
                  <div className="text-center mb-6 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm min-h-[90px] flex flex-col justify-center transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-md">
                    {showPrices ? (
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-1">
                        {product.price}
                      </div>
                    ) : (
                      <div className="text-lg font-semibold text-gray-700 mb-1">Hubungi untuk Harga</div>
                    )}
                    <div className="text-gray-500 text-sm font-medium flex items-center justify-center gap-1.5">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {product.capacity || 'Sesuai Kebutuhan'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleWhatsAppClick(product)}
                      className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 transition-transform duration-300 group-hover/btn:rotate-12" />
                      <span>WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-14 h-14 p-0 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-300 group/btn"
                      asChild
                      title="Lihat Detail Produk"
                    >
                      <Link href={`/products/${product.id}`} className="flex items-center justify-center">
                        <Eye className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
              <Search className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Produk tidak ditemukan</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Coba sesuaikan kriteria pencarian atau filter Anda untuk menemukan produk yang tepat</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedApplication("all")
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              🔄 Hapus Semua Filter
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-4">Tidak menemukan yang Anda cari?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Kami mengkhususkan diri dalam solusi pengolahan air kustom. Hubungi ahli kami untuk rekomendasi yang dipersonalisasi dan dapatkan konsultasi gratis!
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  💬 Hubungi Ahli Kami
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/products">
                    🔍 Lihat Semua Produk
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
