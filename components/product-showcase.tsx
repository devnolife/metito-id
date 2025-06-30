"use client"

import { useState, useEffect } from "react"
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
  Heart,
  Droplets,
  Waves,
  Zap,
  Settings,
  Gauge,
  FlaskConical,
} from "lucide-react"
import { getSetting } from "@/lib/settings"

export function ProductShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState("all")
  const [showPrices, setShowPrices] = useState(true)
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const showPricesLanding = await getSetting('show_prices_landing')
        const whatsappNum = await getSetting('whatsapp_number')

        setShowPrices(showPricesLanding !== false)
        if (whatsappNum) {
          setWhatsappNumber(whatsappNum)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        // Default to showing prices on error
        setShowPrices(true)
      }
    }
    loadSettings()
  }, [])

  const categories = [
    { id: "membrane", name: "Sistem Membran", icon: Droplets, color: "water-blue" },
    { id: "filtration", name: "Unit Filtrasi", icon: Waves, color: "primary-blue" },
    { id: "disinfection", name: "Disinfeksi", icon: Zap, color: "accent-orange" },
    { id: "pumps", name: "Pompa & Motor", icon: Settings, color: "water-blue" },
    { id: "monitoring", name: "Monitoring", icon: Gauge, color: "primary-blue" },
    { id: "chemical", name: "Dosis Kimia", icon: FlaskConical, color: "accent-orange" },
  ]

  const products = [
    {
      id: 1,
      name: "Sistem Membran RO 1000 GPD",
      category: "membrane",
      price: "$45,000",
      application: "Industri",
      capacity: "1000 GPD",
      efficiency: "99.5%",
      location: "USA",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Tekanan Tinggi", "Pemulihan Energi", "Flush Otomatis"],
      description:
        "Sistem membran reverse osmosis canggih yang dirancang untuk aplikasi pengolahan air industri dengan efisiensi dan keandalan tinggi.",
      whatsappMessage: "Halo, saya tertarik dengan Sistem Membran RO 1000 GPD. Bisakah Anda memberikan detail lebih lanjut?",
    },
    {
      id: 2,
      name: "Modul Ultrafiltrasi UF-500",
      category: "filtration",
      price: "$28,000",
      application: "Perkotaan",
      capacity: "500 m³/hari",
      efficiency: "99.9%",
      location: "Jerman",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Serat Berongga", "Sistem Backwash", "Kontrol PLC"],
      description:
        "Sistem ultrafiltrasi berperforma tinggi untuk pengolahan air perkotaan dengan siklus pembersihan otomatis.",
      whatsappMessage: "Halo, saya ingin mengetahui lebih lanjut tentang Modul Ultrafiltrasi UF-500.",
    },
    {
      id: 3,
      name: "Sistem Disinfeksi UV UV-2000",
      category: "disinfection",
      price: "$15,000",
      application: "Industri",
      capacity: "2000 L/menit",
      efficiency: "99.99%",
      location: "Belanda",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Lampu UV-C", "Monitor Intensitas", "Sistem Alarm"],
      description: "Sistem disinfeksi UV canggih untuk eliminasi patogen yang efektif tanpa aditif kimia.",
      whatsappMessage: "Halo, saya tertarik dengan Sistem Disinfeksi UV UV-2000. Mohon berikan detail harga.",
    },
    {
      id: 4,
      name: "Pompa Sentrifugal CP-750",
      category: "pumps",
      price: "$8,500",
      application: "Industri",
      capacity: "750 m³/jam",
      efficiency: "85%",
      location: "Italia",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Stainless Steel", "Kecepatan Variabel", "Proteksi Kering"],
      description:
        "Pompa sentrifugal berperforma tinggi yang dirancang untuk aplikasi pengolahan air dengan kontrol kecepatan variabel.",
      whatsappMessage: "Halo, saya membutuhkan informasi tentang Pompa Sentrifugal CP-750 untuk proyek saya.",
    },
    {
      id: 5,
      name: "Monitor Kualitas Air WQM-Pro",
      category: "monitoring",
      price: "$12,000",
      application: "Perkotaan",
      capacity: "Multi-parameter",
      efficiency: "Real-time",
      location: "USA",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["pH, DO, Turbidity", "Data Logger", "Akses Jarak Jauh"],
      description:
        "Sistem monitoring kualitas air komprehensif dengan pencatatan data real-time dan kemampuan akses jarak jauh.",
      whatsappMessage:
        "Halo, saya tertarik dengan Monitor Kualitas Air WQM-Pro. Bisakah Anda memberikan spesifikasi teknis?",
    },
    {
      id: 6,
      name: "Sistem Dosis Kimia CDS-100",
      category: "chemical",
      price: "$6,500",
      application: "Industri",
      capacity: "100 L/jam",
      efficiency: "±1% akurasi",
      location: "Jerman",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Pompa Peristaltik", "Kontrol Aliran", "Sensor Level"],
      description: "Sistem dosis kimia presisi untuk injeksi kimia yang akurat dalam proses pengolahan air.",
      whatsappMessage: "Halo, saya ingin mendapatkan penawaran untuk Sistem Dosis Kimia CDS-100.",
    },
    {
      id: 7,
      name: "Filter Pasir SF-2000",
      category: "filtration",
      price: "$18,000",
      application: "Perkotaan",
      capacity: "2000 m³/hari",
      efficiency: "95%",
      location: "Prancis",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Multi-media", "Sistem Backwash", "Kontrol Otomatis"],
      description: "Sistem filtrasi pasir berkapasitas tinggi untuk pengolahan air perkotaan dengan siklus backwash otomatis.",
      whatsappMessage: "Halo, saya tertarik dengan Filter Pasir SF-2000. Mohon berikan persyaratan instalasi.",
    },
    {
      id: 8,
      name: "Generator Ozon OG-50",
      category: "disinfection",
      price: "$22,000",
      application: "Industri",
      capacity: "50 g/jam",
      efficiency: "99.9%",
      location: "Jepang",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Corona Discharge", "Feed Oksigen", "Monitor Konsentrasi"],
      description:
        "Sistem generasi ozon canggih untuk disinfeksi air dan proses oksidasi dalam aplikasi industri.",
      whatsappMessage: "Halo, saya membutuhkan detail tentang Generator Ozon OG-50 untuk pengolahan air limbah.",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesApplication = selectedApplication === "all" || product.application === selectedApplication

    return matchesSearch && matchesCategory && matchesApplication
  })

  const handleWhatsAppClick = (product: (typeof products)[0]) => {
    const message = encodeURIComponent(product.whatsappMessage)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
            Pameran Produk
          </Badge>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Solusi Teknik Pengolahan Air Kami</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan rangkaian lengkap solusi pengolahan air dan air limbah yang canggih yang dirancang untuk
            aplikasi industri dan perkotaan
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${selectedCategory === category.id
                ? "border-blue-600 shadow-lg bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
                }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 group-hover:bg-blue-100"
                  }`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold text-sm ${selectedCategory === category.id ? "text-blue-600" : "text-gray-700"
                  }`}>
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-gray-200">
              <SelectValue placeholder="Aplikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aplikasi</SelectItem>
              <SelectItem value="Industri">Industri</SelectItem>
              <SelectItem value="Perkotaan">Perkotaan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white"
            >
              <div className="relative overflow-hidden">
                {/* Product Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Product details that appear on hover */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-8 group-hover:translate-y-0">
                    <Badge className="bg-blue-600 text-white mb-3 w-fit">
                      {product.application}
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.specs.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {showPrices ? (
                          <div className="text-2xl font-bold text-white">{product.price}</div>
                        ) : (
                          <div className="text-lg font-semibold text-white">Hubungi untuk Harga</div>
                        )}
                        <div className="text-gray-300 text-sm">{product.capacity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{product.efficiency}</div>
                        <div className="text-gray-300 text-sm">Efisiensi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Always visible bottom section */}
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{product.location}</p>
                    </div>
                    <div className="text-right">
                      {showPrices ? (
                        <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                      ) : (
                        <div className="text-lg font-semibold text-gray-600">Hubungi untuk Harga</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleWhatsAppClick(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 border-gray-300 hover:bg-gray-50 rounded-xl h-12 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 border-gray-300 hover:bg-gray-50 rounded-xl h-12 transition-all duration-300"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Produk tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">Coba sesuaikan kriteria pencarian atau filter Anda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedApplication("all")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Hapus Filter
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Tidak menemukan yang Anda cari?</h3>
            <p className="text-blue-100 mb-6">
              Kami mengkhususkan diri dalam solusi pengolahan air kustom. Hubungi ahli kami untuk rekomendasi yang dipersonalisasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-3 font-semibold">
                Hubungi Ahli Kami
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-3 font-semibold">
                Lihat Semua Produk
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
