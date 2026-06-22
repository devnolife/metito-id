"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Droplets, Gauge, Calendar, MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getSetting } from "@/lib/settings"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  specs: string[]
  capacity: string
  warranty: string
  delivery: string
}

interface Category {
  name: string
  count: number
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sistem RO Industrial 10.000 LPH",
    description: "Sistem reverse osmosis untuk kebutuhan industri dengan kapasitas tinggi",
    price: 85000000,
    originalPrice: 95000000,
    image: "/images/products/1751113221463_vprh85xdwf.jpg",
    category: "Reverse Osmosis",
    rating: 4.8,
    reviews: 24,
    inStock: true,
    specs: ["10.000 LPH", "Efisiensi 95%", "Otomatis"],
    capacity: "10.000 LPH",
    warranty: "2 Tahun",
    delivery: "2-3 Minggu"
  },
  {
    id: "2",
    name: "Filter Air Multimedia 5.000 LPH",
    description: "Sistem filtrasi multimedia untuk pengolahan air bersih",
    price: 45000000,
    image: "/images/products/1751115076198_7co6h7om303.jpg",
    category: "Multimedia Filter",
    rating: 4.7,
    reviews: 18,
    inStock: true,
    specs: ["5.000 LPH", "Multi-layer", "Backwash Otomatis"],
    capacity: "5.000 LPH",
    warranty: "1 Tahun",
    delivery: "1-2 Minggu"
  },
  {
    id: "3",
    name: "Sistem UV Sterilizer 3.000 LPH",
    description: "Sistem sterilisasi UV untuk disinfeksi air",
    price: 25000000,
    image: "/images/products/1751121933661_pcw7o3dbzfs.jpg",
    category: "UV Sterilizer",
    rating: 4.6,
    reviews: 15,
    inStock: false,
    specs: ["3.000 LPH", "UV-C", "Stainless Steel"],
    capacity: "3.000 LPH",
    warranty: "1 Tahun",
    delivery: "3-4 Minggu"
  }
]

const mockCategories: Category[] = [
  { name: "Reverse Osmosis", count: 12 },
  { name: "Multimedia Filter", count: 8 },
  { name: "UV Sterilizer", count: 6 },
  { name: "Softener", count: 4 },
  { name: "Dosing System", count: 3 }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showPrices, setShowPrices] = useState(true)
  const [showOnlyInStock, setShowOnlyInStock] = useState(true)
  const [loading, setLoading] = useState(true)

  // Load initial data and settings
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load show_prices setting from database
        const showPricesSetting = await getSetting('show_prices')
        setShowPrices(showPricesSetting !== false)

        // Load products (using mock data for now)
        setProducts(mockProducts)
        setCategories(mockCategories)
        setFilteredProducts(mockProducts)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Stock filter
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Price filter
    if (showPrices) {
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, showOnlyInStock, priceRange, showPrices])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-[var(--lime)]/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Solusi Teknik Air
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Sistem Pengolahan{" "}
            <span className="text-[var(--lime-bright)]">Air Premium</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Temukan rangkaian komprehensif solusi pengolahan air kelas industri yang dirancang untuk efisiensi dan keandalan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Minta Penawaran
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Unduh Katalog
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Products Section */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="rounded-[1.25rem] border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] sticky top-24">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Filter className="w-5 h-5 mr-2 text-[var(--navy)]" />
                    <h2 className="font-display text-lg font-bold text-[var(--navy)]">Filter</h2>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-3">Cari Produk</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        placeholder="Cari peralatan..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-12 pr-4 py-3 border-[#dce9ff] rounded-xl focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-3">Kategori</label>
                    <div className="space-y-2">
                      <div
                        onClick={() => handleCategoryChange("all")}
                        className="flex items-center justify-between p-3 hover:bg-[#f8f9ff] rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="text-slate-700 hover:text-[var(--navy)] font-medium">Semua Kategori</span>
                        <Badge variant="secondary" className="text-xs bg-[#eff4ff] text-slate-600">
                          {products.length}
                        </Badge>
                      </div>
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => handleCategoryChange(category.name)}
                          className="flex items-center justify-between p-3 hover:bg-[#f8f9ff] rounded-lg cursor-pointer transition-colors"
                        >
                          <span className="text-slate-700 hover:text-[var(--navy)] font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs bg-[#eff4ff] text-slate-600">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  {showPrices && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[var(--navy)] mb-3">Rentang Harga (IDR)</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000000}
                        step={1000000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-slate-600 bg-[#f8f9ff] p-3 rounded-lg">
                        <span className="font-medium">{new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(priceRange[0])}</span>
                        <span className="font-medium">{new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(priceRange[1])}</span>
                      </div>
                    </div>
                  )}

                  {/* Capacity Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-3">Kapasitas</label>
                    <Select>
                      <SelectTrigger className="border-[#dce9ff] rounded-xl">
                        <SelectValue placeholder="Pilih rentang kapasitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kapasitas</SelectItem>
                        <SelectItem value="small">Kecil (1000 LPH)</SelectItem>
                        <SelectItem value="medium">Sedang (1000-10000 LPH)</SelectItem>
                        <SelectItem value="large">Besar (10000 LPH)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-3">Ketersediaan</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showOnlyInStock}
                          onChange={(e) => setShowOnlyInStock(e.target.checked)}
                          className="rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                        />
                        <span className="ml-2 text-sm text-slate-700">Tersedia</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]" />
                        <span className="ml-2 text-sm text-slate-700">Pesan Terlebih Dahulu</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full py-3">
                    Terapkan Filter
                  </Button>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-slate-600 font-medium">
                  Menampilkan <span className="font-bold text-[var(--navy)]">{filteredProducts.length}</span> dari <span className="font-bold text-[var(--navy)]">{products.length}</span> produk
                </div>

                <div className="flex items-center gap-4">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48 border-[#dce9ff] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Paling Populer</SelectItem>
                      {showPrices && <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>}
                      {showPrices && <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>}
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-[#dce9ff] rounded-xl overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none ${viewMode === "grid" ? "bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)]" : "hover:bg-[#f8f9ff]"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none ${viewMode === "list" ? "bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)]" : "hover:bg-[#f8f9ff]"}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredProducts.map((product, i) => (
                  <Reveal key={product.id} delay={i % 3}>
                    <Card className="group h-full rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                      <div className={`${viewMode === "list" ? "flex" : ""}`}>
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={250}
                            className={`object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === "list" ? "w-full h-64" : "w-full h-48"
                              }`}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={`${product.inStock ? "bg-[var(--lime)] text-[var(--navy)]" : "bg-orange-500 text-white"} font-semibold`}>
                              {product.inStock ? "Tersedia" : "Pesan Terlebih Dahulu"}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur-md hover:bg-white rounded-xl text-[var(--navy)]">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          {product.originalPrice && (
                            <div className="absolute bottom-4 left-4">
                              <Badge className="bg-red-500 text-white">
                                Hemat {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0
                                }).format(product.originalPrice - product.price)}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                />
                              ))}
                              <span className="text-sm text-slate-600 ml-2 font-medium">({product.reviews})</span>
                            </div>
                            <Badge variant="outline" className="text-[var(--navy)] border-[#dce9ff]">
                              {product.category}
                            </Badge>
                          </div>

                          <h3 className="font-display text-lg font-bold text-[var(--navy)] mb-2 transition-colors leading-tight">
                            {product.name}
                          </h3>

                          {viewMode === "list" && (
                            <p className="text-slate-500 mb-4 leading-relaxed">{product.description}</p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.specs.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-[#eff4ff] text-slate-600">
                                {spec}
                              </Badge>
                            ))}
                          </div>

                          {/* Product Details */}
                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Droplets className="w-4 h-4 text-[var(--navy)]" />
                              <span>Kapasitas: {product.capacity}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="w-4 h-4 text-[var(--navy)]" />
                              <span>Garansi: {product.warranty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="w-4 h-4 text-[var(--navy)]" />
                              <span>Pengiriman: {product.delivery}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              {showPrices ? (
                                <>
                                  <span className="font-display text-2xl font-bold text-[var(--navy)]">
                                    {new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      minimumFractionDigits: 0
                                    }).format(product.price)}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-slate-400 line-through ml-2">
                                      {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                      }).format(product.originalPrice)}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-lg font-semibold text-slate-600">
                                  Hubungi untuk Harga
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full"
                              size="sm"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {product.inStock ? "Tambah ke Keranjang" : "Pesan Terlebih Dahulu"}
                            </Button>
                            <Button variant="outline" size="sm" asChild className="rounded-full border-[#dce9ff] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white">
                              <Link href={`/products/${product.id}`}>
                                Lihat Detail
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-16">
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="rounded-full">
                    Sebelumnya
                  </Button>
                  <Button className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] rounded-full">1</Button>
                  <Button variant="outline" className="rounded-full">2</Button>
                  <Button variant="outline" className="rounded-full">3</Button>
                  <Button variant="outline" className="rounded-full">Selanjutnya</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/92 to-[var(--navy)]/70" />
        <Reveal className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Solusi Kustom
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Butuh Solusi Kustom?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Insinyur kami dapat merancang sistem pengolahan air yang disesuaikan untuk memenuhi persyaratan dan kebutuhan kapasitas spesifik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Minta Penawaran Kustom
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Konsultasi dengan Insinyur
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
