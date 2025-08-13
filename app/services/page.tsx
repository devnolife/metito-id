import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Droplets, Filter, Zap, Shield, Wrench, Clock, Phone, Mail, CheckCircle } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: <Droplets className="w-8 h-8 text-blue-600" />,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      title: "Pengolahan Air Bersih",
      description: "Sistem pengolahan air bersih untuk kebutuhan domestik dan komersial dengan teknologi terdepan.",
      features: ["Sistem filtrasi multi-stage", "Teknologi reverse osmosis", "Monitoring kualitas real-time"],
      price: "Mulai dari Rp 15.000.000"
    },
    {
      id: 2,
      icon: <Filter className="w-8 h-8 text-orange-600" />,
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      title: "Pengolahan Air Limbah",
      description: "Solusi lengkap pengolahan air limbah industri dan domestik sesuai standar lingkungan.",
      features: ["Sistem biologis dan kimia", "Teknologi MBR", "Sertifikasi lingkungan"],
      price: "Mulai dari Rp 50.000.000"
    },
    {
      id: 3,
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      title: "Sistem Desalinasi",
      description: "Teknologi desalinasi untuk mengubah air laut menjadi air tawar berkualitas tinggi.",
      features: ["Reverse osmosis seawater", "Sistem energi efisien", "Otomasi penuh"],
      price: "Mulai dari Rp 200.000.000"
    },
    {
      id: 4,
      icon: <Shield className="w-8 h-8 text-green-600" />,
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      title: "Water Quality Testing",
      description: "Layanan pengujian kualitas air komprehensif dengan laboratorium terakreditasi.",
      features: ["Pengujian parameter lengkap", "Sertifikat resmi", "Konsultasi ahli"],
      price: "Mulai dari Rp 500.000"
    },
    {
      id: 5,
      icon: <Wrench className="w-8 h-8 text-purple-600" />,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      title: "Maintenance & Service",
      description: "Layanan perawatan berkala dan perbaikan sistem pengolahan air existing.",
      features: ["Maintenance rutin", "Emergency repair", "Spare part original"],
      price: "Mulai dari Rp 2.000.000"
    },
    {
      id: 6,
      icon: <Clock className="w-8 h-8 text-pink-600" />,
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
      title: "Konsultasi Teknis",
      description: "Konsultasi dan desain sistem pengolahan air sesuai kebutuhan spesifik.",
      features: ["Survei lokasi", "Desain engineering", "Kalkulasi ROI"],
      price: "Mulai dari Rp 5.000.000"
    }
  ]

  const process = [
    {
      step: "01",
      title: "Konsultasi Awal",
      description: "Diskusi kebutuhan dan survei lokasi untuk memahami kondisi existing"
    },
    {
      step: "02",
      title: "Analisis & Desain",
      description: "Analisis air dan desain sistem yang optimal sesuai kebutuhan spesifik"
    },
    {
      step: "03",
      title: "Implementasi",
      description: "Instalasi sistem dengan teknisi berpengalaman dan peralatan modern"
    },
    {
      step: "04",
      title: "Testing & Commissioning",
      description: "Pengujian sistem dan pelatihan operator untuk memastikan performa optimal"
    },
    {
      step: "05",
      title: "Maintenance",
      description: "Layanan perawatan berkala untuk menjaga performa sistem jangka panjang"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Layanan Profesional
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Layanan Pengolahan
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Air Komprehensif
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dapatkan solusi pengolahan air terbaik dengan layanan komprehensif dari tim ahli berpengalaman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Gratis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Lihat Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Layanan Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Profesional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dapatkan solusi pengolahan air terbaik dengan layanan komprehensif dari tim ahli kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105">
                <CardHeader className="text-center pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 mb-4">
                    {service.price}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                    Konsultasi Gratis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Proses Kerja
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bagaimana Kami Bekerja
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses kerja yang terstruktur dan sistematis untuk hasil optimal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>

                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-blue-200 transform -translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Hubungi tim ahli kami untuk konsultasi gratis dan dapatkan solusi pengolahan air yang tepat untuk kebutuhan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Sekarang
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Mail className="w-5 h-5 mr-2" />
              Konsultasi Email
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
