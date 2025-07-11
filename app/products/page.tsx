"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
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

  // Load initial data
  useEffect(() => {
    setProducts(mockProducts)
    setCategories(mockCategories)
    setFilteredProducts(mockProducts)
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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Solusi Teknik Air
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Sistem Pengolahan
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Air Premium
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Temukan rangkaian komprehensif solusi pengolahan air kelas industri yang dirancang untuk efisiensi dan keandalan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Minta Penawaran
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Unduh Katalog
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg sticky top-24">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Filter</h2>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Cari Produk</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Cari peralatan..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-12 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
                    <div className="space-y-2">
                      <div
                        onClick={() => handleCategoryChange("all")}
                        className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="text-gray-700 hover:text-blue-600 font-medium">Semua Kategori</span>
                        <Badge variant="secondary" className="text-xs">
                          {products.length}
                        </Badge>
                      </div>
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          onClick={() => handleCategoryChange(category.name)}
                          className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <span className="text-gray-700 hover:text-blue-600 font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  {showPrices && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Rentang Harga (IDR)</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000000}
                        step={1000000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Kapasitas</label>
                    <Select>
                      <SelectTrigger className="border-gray-200 rounded-xl">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Ketersediaan</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showOnlyInStock}
                          onChange={(e) => setShowOnlyInStock(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Tersedia</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Pesan Terlebih Dahulu</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-3">
                    Terapkan Filter
                  </Button>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-gray-600 font-medium">
                  Menampilkan <span className="font-bold text-gray-900">{filteredProducts.length}</span> dari <span className="font-bold text-gray-900">{products.length}</span> produk
                </div>

                <div className="flex items-center gap-4">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48 border-gray-200 rounded-xl">
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

                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none ${viewMode === "grid" ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none ${viewMode === "list" ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 overflow-hidden">
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={250}
                          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === "list" ? "w-full h-64" : "w-full h-48"
                            }`}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${product.inStock ? "bg-green-500" : "bg-orange-500"} text-white`}>
                            {product.inStock ? "Tersedia" : "Pesan Terlebih Dahulu"}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur-md hover:bg-white rounded-xl">
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
                            <span className="text-sm text-gray-600 ml-2 font-medium">({product.reviews})</span>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {product.category}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {product.name}
                        </h3>

                        {viewMode === "list" && (
                          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.specs.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span>Kapasitas: {product.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Garansi: {product.warranty}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Pengiriman: {product.delivery}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {showPrices ? (
                              <>
                                <span className="text-2xl font-bold text-blue-600">
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                  }).format(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      minimumFractionDigits: 0
                                    }).format(product.originalPrice)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-gray-600">
                                Hubungi untuk Harga
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
                            size="sm"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? "Tambah ke Keranjang" : "Pesan Terlebih Dahulu"}
                          </Button>
                          <Button variant="outline" size="sm" asChild className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Link href={`/products/${product.id}`}>
                              Lihat Detail
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-16">
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="rounded-xl">
                    Sebelumnya
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">1</Button>
                  <Button variant="outline" className="rounded-xl">2</Button>
                  <Button variant="outline" className="rounded-xl">3</Button>
                  <Button variant="outline" className="rounded-xl">Selanjutnya</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Butuh Solusi Kustom?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Insinyur kami dapat merancang sistem pengolahan air yang disesuaikan untuk memenuhi persyaratan dan kebutuhan kapasitas spesifik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Minta Penawaran Kustom
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Konsultasi dengan Insinyur
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
