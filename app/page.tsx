import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Shield, Droplets, Filter, Zap, Settings, Star, CheckCircle, ArrowRight, Target, Lightbulb, Heart } from "lucide-react"

export default function Home() {
  const stats = [
    { icon: <Target className="w-8 h-8" />, value: "100%", label: "Komitmen Kualitas", color: "text-blue-600" },
    { icon: <Lightbulb className="w-8 h-8" />, value: "24/7", label: "Layanan Siap", color: "text-green-600" },
    { icon: <Heart className="w-8 h-8" />, value: "∞", label: "Dedikasi Tinggi", color: "text-purple-600" },
    { icon: <Shield className="w-8 h-8" />, value: "100%", label: "Jaminan Kualitas", color: "text-orange-600" }
  ]

  const services = [
    {
      icon: <Droplets className="w-12 h-12 text-blue-600" />,
      title: "Pengolahan Air",
      description: "Solusi pengolahan air lengkap untuk aplikasi industri dan perkotaan"
    },
    {
      icon: <Filter className="w-12 h-12 text-green-600" />,
      title: "Sistem Filtrasi",
      description: "Teknologi filtrasi canggih untuk pasokan air bersih dan aman"
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-600" />,
      title: "Disinfeksi",
      description: "Sistem disinfeksi UV dan ozon untuk eliminasi patogen"
    },
    {
      icon: <Settings className="w-12 h-12 text-orange-600" />,
      title: "Pemeliharaan",
      description: "Layanan pemeliharaan dan dukungan profesional untuk performa optimal"
    }
  ]

  const features = [
    "Teknologi Terdepan dan Inovatif",
    "Dukungan Teknis 24/7 Tersedia",
    "Solusi Kustom untuk Setiap Kebutuhan",
    "Sistem Monitoring dan Kontrol Canggih",
    "Desain Hemat Energi",
    "Jaminan Garansi Komprehensif"
  ]

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Solusi Terpercaya
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solusi Pengolahan Air Profesional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Perusahaan yang berkomitmen memberikan solusi pengolahan air terbaik dengan teknologi modern dan layanan prima.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keahlian Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi pengolahan air komprehensif yang disesuaikan untuk memenuhi kebutuhan spesifik Anda dan standar industri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase with Hover Effects */}
      <ProductShowcase />

      {/* Mission & Vision Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Visi & Misi Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Komitmen Terhadap Masa Depan Air Bersih
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen untuk menjadi pioneer dalam teknologi pengolahan air yang berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi perusahaan terdepan dalam solusi pengolahan air yang berkelanjutan dan ramah lingkungan di Indonesia.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menyediakan solusi pengolahan air berkualitas tinggi dengan teknologi terkini dan layanan pelanggan yang prima.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
                Mengapa Memilih Metito Water Solutions
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Keunggulan dalam Solusi Pengolahan Air
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kami berkomitmen memberikan solusi pengolahan air inovatif dengan teknologi terdepan dan dedikasi tinggi untuk memenuhi kebutuhan pelanggan.
              </p>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                  Pelajari Lebih Lanjut Tentang Kami
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl">
                  Hubungi Kami
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Teknologi Terkini</div>
                      <div className="text-sm text-gray-600">Inovasi Terdepan</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Dukungan 24/7</div>
                      <div className="text-sm text-gray-600">Selalu Tersedia</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6 mt-12">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Dedikasi Tinggi</div>
                      <div className="text-sm text-gray-600">Komitmen Total</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Tim Profesional</div>
                      <div className="text-sm text-gray-600">Ahli Terpercaya</div>
                    </CardContent>
                  </Card>
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
            Siap Mentransformasi Pengolahan Air Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Dapatkan konsultasi ahli dan solusi kustom untuk kebutuhan pengolahan air Anda. Tim kami siap membantu Anda mencapai hasil yang optimal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Gratis
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Unduh Katalog
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
