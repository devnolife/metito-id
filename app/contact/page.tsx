import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Headphones } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      details: ["+62 812-1760-3950", "+62 21 5555 1235"],
      subtitle: "Sen - Jum: 08:00 - 18:00"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@metito.id", "sales@metito.id"],
      subtitle: "Respon dalam 24 jam"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      details: ["Jl. Teknologi No. 123", "Jakarta Selatan 12345"],
      subtitle: "Indonesia"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Jam Operasional",
      details: ["Senin - Jumat: 08:00 - 18:00", "Sabtu: 08:00 - 15:00"],
      subtitle: "Minggu: Tutup"
    }
  ]

  const teams = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Tim Sales",
      description: "Konsultasi produk dan harga",
      contact: "sales@metito.id",
      phone: "+62 812-1760-3950"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Tim Support Teknis",
      description: "Dukungan teknis dan troubleshooting",
      contact: "support@metito.id",
      phone: "+62 21 5555 1235"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Tim Customer Service",
      description: "Informasi umum dan layanan pelanggan",
      contact: "cs@metito.id",
      phone: "+62 21 5555 1236"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Hubungi Kami
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Mari Berbicara
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Tentang Proyek Anda
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tim ahli kami siap membantu Anda menemukan solusi pengolahan air yang tepat untuk kebutuhan spesifik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Gratis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Langsung
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Informasi Kontak
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Menghubungi Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai cara untuk terhubung dengan tim ahli kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 text-white">
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{info.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Teams Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
                  Kirim Pesan
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Formulir Kontak
                </h2>
                <p className="text-lg text-gray-600">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          className="border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          className="border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telepon *
                        </label>
                        <Input
                          placeholder="+62 xxx xxxx xxxx"
                          className="border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Perusahaan
                        </label>
                        <Input
                          placeholder="Nama perusahaan"
                          className="border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Topik Konsultasi *
                      </label>
                      <Select>
                        <SelectTrigger className="border-gray-200 rounded-xl">
                          <SelectValue placeholder="Pilih topik konsultasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="industrial">Pengolahan Air Industri</SelectItem>
                          <SelectItem value="municipal">Pengolahan Air Kota</SelectItem>
                          <SelectItem value="wastewater">Pengolahan Air Limbah</SelectItem>
                          <SelectItem value="desalination">Sistem Desalinasi</SelectItem>
                          <SelectItem value="maintenance">Maintenance & Service</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pesan *
                      </label>
                      <Textarea
                        placeholder="Jelaskan kebutuhan Anda secara detail..."
                        className="border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-3 font-semibold">
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Teams */}
            <div>
              <div className="mb-8">
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium mb-4">
                  Tim Ahli
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Hubungi Tim Spesialis
                </h2>
                <p className="text-lg text-gray-600">
                  Terhubung langsung dengan tim spesialis sesuai kebutuhan Anda
                </p>
              </div>

              <div className="space-y-6">
                {teams.map((team, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white flex-shrink-0">
                          {team.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{team.title}</h3>
                          <p className="text-gray-600 mb-3">{team.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">{team.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">{team.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Butuh Konsultasi Segera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Tim ahli kami siap memberikan konsultasi dan solusi terbaik untuk kebutuhan pengolahan air Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Sekarang
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
