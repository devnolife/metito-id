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
  MapPin,
  ChevronLeft,
  ChevronRight,
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

  // Slider produk (satu baris, sisanya digeser)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const scrollByCards = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

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

  // Auto-scroll slider produk (berhenti saat hover/sentuh), loop ke awal di ujung
  useEffect(() => {
    if (loading || error || filteredProducts.length === 0) return
    const el = scrollRef.current
    if (!el) return

    const interval = setInterval(() => {
      if (pausedRef.current || el.matches(':hover')) return
      const card = el.querySelector<HTMLElement>('[data-product-card]')
      const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.85
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [loading, error, filteredProducts.length])

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
      <div className="absolute inset-0 bg-[#f8f9ff]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--lime)]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--navy)]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block animate-fade-in-up">
            <Badge className="rounded-full bg-[var(--lime)]/20 text-[#3d4d00] px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[var(--lime)]/30 transition-all duration-300">
              Pameran Produk
            </Badge>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6 text-[var(--navy)] animate-fade-in-up animation-delay-100">
            Solusi Teknik Pengolahan Air Kami
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Temukan rangkaian lengkap solusi pengolahan air dan air limbah yang canggih yang dirancang untuk
            aplikasi industri dan perkotaan
          </p>
        </div>

        {/* Categories */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-2xl border border-[#e5eeff] bg-white p-6 animate-pulse">
                <div className="w-14 h-14 bg-[#e5eeff] rounded-2xl mx-auto mb-4"></div>
                <div className="h-3.5 bg-[#e5eeff] rounded-full mx-auto w-3/4 mb-2"></div>
                <div className="h-3 bg-[#eff4ff] rounded-full mx-auto w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || Settings
              const isSelected = selectedCategory === category.id
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? "all" : category.id)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in-up 0.6s ease-out forwards'
                  }}
                  className={`group relative flex flex-col items-center text-center rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 ${isSelected
                    ? "bg-[var(--navy)] border-[var(--navy)] shadow-xl shadow-[var(--navy)]/25"
                    : "bg-white border-[#e5eeff] hover:border-[var(--lime)] shadow-[0_12px_30px_-18px_rgba(11,28,48,0.18)] hover:shadow-[0_22px_44px_-22px_rgba(11,28,48,0.28)]"
                    }`}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${isSelected
                    ? "bg-[var(--lime)] text-[var(--navy)]"
                    : "bg-[#eff4ff] text-[var(--navy)] group-hover:bg-[var(--lime)]/20"
                    }`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className={`font-display font-bold text-sm leading-tight mb-2 ${isSelected ? "text-white" : "text-[var(--navy)]"
                    }`}>
                    {category.name}
                  </h3>
                  {category._count && (
                    <span className={`text-[11px] font-semibold rounded-full px-2.5 py-0.5 transition-colors duration-300 ${isSelected
                      ? "bg-white/15 text-[var(--lime)]"
                      : "bg-[#e5eeff] text-slate-500"
                      }`}>
                      {category._count.products} produk
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Search and Filter — unified command bar */}
        <div className="mb-16 flex flex-col md:flex-row md:items-center gap-3 p-3 bg-white rounded-[1.5rem] border border-[#e5eeff] shadow-[0_24px_55px_-30px_rgba(11,28,48,0.3)]">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[var(--navy)] transition-colors" />
            <Input
              type="search"
              placeholder="Cari produk berdasarkan nama, deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-xl border-0 bg-[#f8f9ff] focus-visible:ring-2 focus-visible:ring-[var(--navy)]/15 focus-visible:bg-white transition-all duration-300 text-base placeholder:text-slate-400"
            />
          </div>
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="w-full md:w-52 h-12 rounded-xl border-0 bg-[#f8f9ff] hover:bg-[#eff4ff] focus:ring-2 focus:ring-[var(--navy)]/15 transition-all duration-300 font-semibold text-[var(--navy)]">
              <Filter className="w-4 h-4 mr-2 text-[var(--lime-dim)]" />
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
            <Loader2 className="w-8 h-8 animate-spin text-[var(--navy)]" />
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
              className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-xl"
            >
              Muat Ulang
            </Button>
          </div>
        )}

        {/* Product Slider — satu baris, sisanya digeser */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div>
            {/* Slider header + nav */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-slate-500">
                Menampilkan <span className="font-bold text-[var(--navy)]">{filteredProducts.length}</span> produk — geser untuk lihat lainnya
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollByCards('left')}
                  aria-label="Sebelumnya"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-[#dce9ff] bg-white text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)] transition-all duration-300 shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards('right')}
                  aria-label="Selanjutnya"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--lime)] text-[var(--navy)] hover:bg-[var(--lime-bright)] transition-all duration-300 shadow-lg shadow-[var(--lime)]/25 hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Baris slider */}
            <div
              ref={scrollRef}
              onPointerEnter={() => { pausedRef.current = true }}
              onPointerLeave={() => { pausedRef.current = false }}
              onTouchStart={() => { pausedRef.current = true }}
              onTouchEnd={() => { pausedRef.current = false }}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-8 pb-4 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  data-product-card
                  className="group relative shrink-0 w-[300px] sm:w-[340px] snap-start overflow-visible border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fade-in-up 0.6s ease-out forwards'
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
                    <div className="absolute inset-0 bg-[var(--lime)]/5 rounded-3xl"></div>
                  </div>

                  {/* Floating detail card that appears on hover - larger coverage */}
                  <div className="absolute -top-6 left-0 right-0 bottom-20 z-50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100 pointer-events-none">
                    <div className="mx-3 h-full bg-white border-2 border-[var(--navy)]/20 rounded-2xl shadow-2xl shadow-[var(--navy)]/25 overflow-hidden flex flex-col">
                      {/* Header */}
                      <div className="bg-[var(--navy)] px-6 py-5 flex-shrink-0">
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
                      <div className="flex-1 overflow-hidden p-6 bg-gradient-to-br from-white to-[#eff4ff] flex flex-col justify-between">
                        {/* Extended Description */}
                        <div className="mb-5">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-1 h-5 bg-[var(--lime)] rounded"></span>
                            Tentang Produk
                          </h4>
                          <div className="bg-white rounded-xl p-4 border-2 border-[#dce9ff] shadow-sm">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {product.description || product.shortDesc || 'Solusi pengolahan air berkualitas tinggi dengan teknologi terkini untuk memenuhi kebutuhan industri dan perkotaan. Produk ini dirancang dengan standar internasional dan telah terbukti efektif dalam berbagai aplikasi.'}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--lime)] rounded"></span>
                              Keunggulan Utama
                            </h4>
                            <div className="space-y-2.5">
                              {product.features.slice(0, 5).map((feature: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-3 border-2 border-[#dce9ff] shadow-sm hover:shadow-md transition-all duration-300">
                                  <span className="w-7 h-7 bg-[var(--navy)] text-[var(--lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm text-gray-800 font-medium leading-relaxed pt-0.5">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Category Badge at bottom */}
                        <div className="bg-[var(--navy)] rounded-xl p-4 border-2 border-[var(--navy)] shadow-lg">
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

                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden relative rounded-t-3xl bg-[#eff4ff]">
                    <img
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Bottom gradient for depth */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

                    {/* Stock badge */}
                    {product.inStock && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[var(--navy)] shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Tersedia
                        </span>
                      </div>
                    )}

                    {/* Featured badge */}
                    {product.isFeatured && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lime)] px-3 py-1 text-xs font-bold text-[var(--navy)] shadow-md">
                          ★ Unggulan
                        </span>
                      </div>
                    )}

                    {/* Efficiency chip */}
                    {product.efficiency && product.efficiency !== '—' && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 text-xs font-bold text-white shadow-md">
                          <Zap className="w-3.5 h-3.5 text-[var(--lime)]" />
                          Efisiensi {product.efficiency}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <CardContent className="p-6">
                    {/* Category + Application */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5e7400]">
                        {product.category.name}
                      </span>
                      <span className="rounded-full bg-[#e5eeff] text-[var(--navy)] text-[11px] font-semibold px-2.5 py-0.5">
                        {product.application || 'Universal'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-bold text-[var(--navy)] leading-snug line-clamp-2 min-h-[3.5rem] group-hover:text-[#3d4d00] transition-colors">
                      {product.name}
                    </h3>

                    {/* Location */}
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 text-[var(--lime-dim)]" />
                      {product.location || 'Indonesia'}
                    </div>

                    {/* Divider */}
                    <div className="my-5 h-px bg-[#e5eeff]" />

                    {/* Price + capacity */}
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">Harga</div>
                        {showPrices ? (
                          <div className="font-display text-2xl font-bold text-[var(--navy)] leading-none">
                            {product.price}
                          </div>
                        ) : (
                          <div className="text-base font-semibold text-[var(--navy)]">Hubungi Kami</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1">Kapasitas</div>
                        <div className="text-sm font-semibold text-slate-600">{product.capacity || 'Custom'}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleWhatsAppClick(product)}
                        className="flex-1 h-12 bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-[var(--navy)]/20 group/btn"
                      >
                        <MessageCircle className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:rotate-12" />
                        <span>WhatsApp</span>
                      </Button>
                      <Button
                        asChild
                        className="w-12 h-12 p-0 bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] rounded-full shadow-lg shadow-[var(--lime)]/25 transition-all duration-300 hover:scale-105 group/btn"
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
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-[var(--navy)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
              <Search className="w-16 h-16 text-[var(--lime)]" />
            </div>
            <h3 className="font-display text-3xl font-bold text-[var(--navy)] mb-3">Produk tidak ditemukan</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Coba sesuaikan kriteria pencarian atau filter Anda untuk menemukan produk yang tepat</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedApplication("all")
              }}
              className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-2xl px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Hapus Semua Filter
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="relative overflow-hidden bg-[var(--navy)] rounded-3xl p-12 text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--lime)]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--lime)]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-block p-3 bg-[var(--lime)]/15 rounded-2xl backdrop-blur-sm mb-6">
                <MessageCircle className="w-12 h-12 text-[var(--lime)]" />
              </div>
              <h3 className="font-display text-4xl font-bold mb-4">Tidak menemukan yang Anda cari?</h3>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Kami mengkhususkan diri dalam solusi pengolahan air kustom. Hubungi ahli kami untuk rekomendasi yang dipersonalisasi dan dapatkan konsultasi gratis!
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button className="bg-[var(--lime)] text-[var(--navy)] hover:bg-[var(--lime-bright)] rounded-2xl px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Hubungi Ahli Kami
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white/40 text-white hover:bg-white hover:text-[var(--navy)] rounded-2xl px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
