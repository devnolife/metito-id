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
} from "lucide-react"
import Link from "next/link"
import { getSetting } from "@/lib/settings"

export function ProductShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState("all")
  const [showPrices, setShowPrices] = useState(true)
  // Kontak WhatsApp (tiga nomor yang diminta sebelumnya)
  const contacts = useRef([
    { name: 'Khudaivi', phone: '08979380767', template: 'Halo Khudaivi, saya tertarik dengan informasi produk Metito.' },
    { name: 'Musthamu', phone: '082322345616', template: 'Halo Musthamu, saya ingin menanyakan detail produk Metito.' },
    { name: 'Sales 1', phone: '081217603950', template: 'Halo Sales 1, saya membutuhkan penawaran terkait solusi pengolahan air.' }
  ])
  // Tidak perlu indeks; gunakan pemilihan acak

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const showPricesLanding = await getSetting('show_prices_landing')
        setShowPrices(showPricesLanding !== false)
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
      price: "Rp 675.000.000",
      application: "Industri",
      capacity: "1000 GPD",
      efficiency: "99.5%",
      location: "USA",
      image: "/images/products/product-1.jpg",
      specs: ["Tekanan Tinggi", "Pemulihan Energi", "Flush Otomatis"],
      description:
        "Sistem membran reverse osmosis canggih yang dirancang untuk aplikasi pengolahan air industri dengan efisiensi dan keandalan tinggi.",
      whatsappMessage: "Halo, saya tertarik dengan Sistem Membran RO 1000 GPD. Bisakah Anda memberikan detail lebih lanjut?",
    },
    {
      id: 2,
      name: "Modul Ultrafiltrasi UF-500",
      category: "filtration",
      price: "Rp 420.000.000",
      application: "Perkotaan",
      capacity: "500 m³/hari",
      efficiency: "99.9%",
      location: "Jerman",
      image: "/images/products/product-2.jpg",
      specs: ["Serat Berongga", "Sistem Backwash", "Kontrol PLC"],
      description:
        "Sistem ultrafiltrasi berperforma tinggi untuk pengolahan air perkotaan dengan siklus pembersihan otomatis.",
      whatsappMessage: "Halo, saya ingin mengetahui lebih lanjut tentang Modul Ultrafiltrasi UF-500.",
    },
    {
      id: 3,
      name: "Sistem Disinfeksi UV UV-2000",
      category: "disinfection",
      price: "Rp 225.000.000",
      application: "Industri",
      capacity: "2000 L/menit",
      efficiency: "99.99%",
      location: "Belanda",
      image: "/images/products/product-3.jpeg",
      specs: ["Lampu UV-C", "Monitor Intensitas", "Sistem Alarm"],
      description: "Sistem disinfeksi UV canggih untuk eliminasi patogen yang efektif tanpa aditif kimia.",
      whatsappMessage: "Halo, saya tertarik dengan Sistem Disinfeksi UV UV-2000. Mohon berikan detail harga.",
    },
    {
      id: 4,
      name: "Pompa Sentrifugal CP-750",
      category: "pumps",
      price: "Rp 127.500.000",
      application: "Industri",
      capacity: "750 m³/jam",
      efficiency: "85%",
      location: "Italia",
      image: "/images/products/product-4.jpg",
      specs: ["Stainless Steel", "Kecepatan Variabel", "Proteksi Kering"],
      description:
        "Pompa sentrifugal berperforma tinggi yang dirancang untuk aplikasi pengolahan air dengan kontrol kecepatan variabel.",
      whatsappMessage: "Halo, saya membutuhkan informasi tentang Pompa Sentrifugal CP-750 untuk proyek saya.",
    },
    {
      id: 5,
      name: "Monitor Kualitas Air WQM-Pro",
      category: "monitoring",
      price: "Rp 180.000.000",
      application: "Perkotaan",
      capacity: "Multi-parameter",
      efficiency: "Real-time",
      location: "USA",
      image: "/images/products/product-5.jpg",
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
      price: "Rp 97.500.000",
      application: "Industri",
      capacity: "100 L/jam",
      efficiency: "±1% akurasi",
      location: "Jerman",
      image: "/images/products/product-6.jpg",
      specs: ["Pompa Peristaltik", "Kontrol Aliran", "Sensor Level"],
      description: "Sistem dosis kimia presisi untuk injeksi kimia yang akurat dalam proses pengolahan air.",
      whatsappMessage: "Halo, saya ingin mendapatkan penawaran untuk Sistem Dosis Kimia CDS-100.",
    },
    {
      id: 7,
      name: "Filter Pasir SF-2000",
      category: "filtration",
      price: "Rp 270.000.000",
      application: "Perkotaan",
      capacity: "2000 m³/hari",
      efficiency: "95%",
      location: "Prancis",
      image: "/images/products/product-7.jpg",
      specs: ["Multi-media", "Sistem Backwash", "Kontrol Otomatis"],
      description: "Sistem filtrasi pasir berkapasitas tinggi untuk pengolahan air perkotaan dengan siklus backwash otomatis.",
      whatsappMessage: "Halo, saya tertarik dengan Filter Pasir SF-2000. Mohon berikan persyaratan instalasi.",
    },
    {
      id: 8,
      name: "Generator Ozon OG-50",
      category: "disinfection",
      price: "Rp 330.000.000",
      application: "Industri",
      capacity: "50 g/jam",
      efficiency: "99.9%",
      location: "Jepang",
      image: "/images/products/product-8.jpg",
      specs: ["Corona Discharge", "Feed Oksigen", "Monitor Konsentrasi"],
      description:
        "Sistem generasi ozon canggih untuk disinfeksi air dan proses oksidasi dalam aplikasi industri.",
      whatsappMessage: "Halo, saya membutuhkan detail tentang Generator Ozon OG-50 untuk pengolahan air limbah.",
    },
    {
      id: 9,
      name: "Sistem Ultrafiltrasi UF-1000",
      category: "filtration",
      price: "Rp 450.000.000",
      application: "Industri",
      capacity: "1000 m³/hari",
      efficiency: "99.8%",
      location: "USA",
      image: "/images/products/product-9.jpg",
      specs: ["Serat Berongga", "Sistem Backwash", "Kontrol PLC"],
      description: "Sistem ultrafiltrasi berkapasitas tinggi untuk aplikasi industri dengan efisiensi maksimal.",
      whatsappMessage: "Halo, saya tertarik dengan Sistem Ultrafiltrasi UF-1000. Mohon berikan detail spesifikasi.",
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

  const handleWhatsAppClick = (product: (typeof products)[0]) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white"
            >
              {/* Floating detail card that appears above the card */}
              <div className="absolute -top-4 left-0 right-0 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 mx-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {product.application}
                    </Badge>
                    <div className="text-sm font-semibold text-green-600">
                      {product.efficiency} Efisiensi
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.specs.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {showPrices ? (
                        <div className="text-lg font-bold text-blue-600">{product.price}</div>
                      ) : (
                        <div className="text-sm font-semibold text-gray-600">Hubungi untuk Harga</div>
                      )}
                      <div className="text-gray-500 text-xs">{product.capacity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">{product.location}</div>
                      <div className="text-xs text-gray-500">Lokasi</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden">
                {/* Product Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay that appears on hover - only on image area */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Efficiency badge on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Badge className="bg-green-600 text-white">
                      {product.efficiency} Efisiensi
                    </Badge>
                  </div>
                </div>

                {/* Product title at the top */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white/95 via-white/90 to-transparent backdrop-blur-sm p-4 z-20">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-600 text-sm">{product.location}</p>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {product.application}
                    </Badge>
                  </div>
                </div>

                {/* Always visible bottom section */}
                <CardContent className="p-6 bg-white relative z-10">
                  <div className="text-center mb-4">
                    {showPrices ? (
                      <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                    ) : (
                      <div className="text-lg font-semibold text-gray-600">Hubungi untuk Harga</div>
                    )}
                    <div className="text-gray-500 text-sm mt-1">{product.capacity}</div>
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
                      asChild
                      title="Lihat Detail Produk"
                    >
                      <Link href={`/products/${product.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
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
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-3 font-semibold" asChild>
                <Link href="/products">
                  Lihat Semua Produk
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
