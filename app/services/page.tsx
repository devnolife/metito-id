import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, Filter, Zap, Shield, Wrench, Clock, CheckCircle, Star } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: <Droplets className="w-8 h-8 text-blue-600" />,
      title: "Sistem Pengolahan Air",
      description: "Solusi pengolahan air lengkap untuk aplikasi industri dan kota",
      features: ["Reverse Osmosis", "Ultrafiltrasi", "Nanofiltrasi", "Pertukaran Ion"],
      price: "Mulai $5,000"
    },
    {
      icon: <Filter className="w-8 h-8 text-blue-600" />,
      title: "Solusi Filtrasi",
      description: "Sistem filtrasi canggih untuk berbagai kebutuhan kualitas air",
      features: ["Filter Pasir", "Filter Karbon", "Filter Multimedia", "Filter Kantong"],
      price: "Mulai $2,500"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Sistem Disinfeksi",
      description: "Sistem disinfeksi UV dan ozon untuk pasokan air yang aman",
      features: ["Sterilisator UV", "Generator Ozon", "Klorinasi", "Elektroklorinasi"],
      price: "Mulai $3,000"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Pemantauan Kualitas Air",
      description: "Sistem pemantauan dan kontrol real-time untuk jaminan kualitas air",
      features: ["Pemantauan pH", "Kontrol Kekeruhan", "Pengukur Konduktivitas", "Pemantauan Jarak Jauh"],
      price: "Mulai $1,500"
    },
    {
      icon: <Wrench className="w-8 h-8 text-blue-600" />,
      title: "Pemeliharaan & Dukungan",
      description: "Layanan pemeliharaan profesional dan dukungan teknis",
      features: ["Pemeliharaan Preventif", "Perbaikan Darurat", "Suku Cadang", "Pelatihan"],
      price: "Penawaran Khusus"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Layanan Darurat 24/7",
      description: "Dukungan darurat 24 jam untuk sistem air yang kritis",
      features: ["Respons Darurat", "Deployment Cepat", "Teknisi Ahli", "Diagnostik Jarak Jauh"],
      price: "Hubungi untuk Harga"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Layanan Pengolahan Air Profesional
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Layanan Pengolahan Air
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              yang Komprehensif
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dari desain dan instalasi hingga pemeliharaan dan dukungan, kami menyediakan solusi pengolahan air end-to-end untuk kebutuhan bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Minta Penawaran
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Lihat Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menawarkan solusi pengolahan air yang komprehensif yang disesuaikan untuk memenuhi persyaratan spesifik Anda dan standar industri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                      {service.icon}
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {service.price}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Metito Water Engineer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dengan pengalaman lebih dari 20 tahun, kami memberikan solusi pengolahan air yang andal dan efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kualitas Premium</h3>
              <p className="text-gray-600">Peralatan dan komponen bersertifikat ISO untuk performa yang tahan lama</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dukungan Andal</h3>
              <p className="text-gray-600">Dukungan teknis 24/7 dan cakupan garansi yang komprehensif</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instalasi Ahli</h3>
              <p className="text-gray-600">Instalasi dan commissioning profesional oleh insinyur bersertifikat</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
