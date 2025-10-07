import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Headphones, Globe } from "lucide-react"

export function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: "Kantor Pusat",
      details: [
        "Jl. Sudirman No. 123",
        "Jakarta Pusat 10220",
        "Indonesia"
      ]
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Nomor Telepon",
      details: [
        "+62 812-1760-3950",
        "+62 21 5555 5678",
        "WhatsApp: +62 812 3456 7890"
      ]
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: "Alamat Email",
      details: [
        "info@metito.id",
        "sales@metito.id",
        "support@metito.id"
      ]
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Jam Kerja",
      details: [
        "Senin - Jumat: 08:00 - 18:00",
        "Sabtu: 09:00 - 16:00",
        "Minggu: Darurat Saja"
      ]
    }
  ]

  const offices = [
    {
      city: "Jakarta",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+62 812-1760-3950",
      email: "jakarta@metito.id",
      manager: "Ir. Ahmad Santoso"
    },
    {
      city: "Surabaya",
      address: "Jl. Pemuda No. 456, Surabaya 60271",
      phone: "+62 31 5555 1234",
      email: "surabaya@metito.id",
      manager: "Ir. Siti Nurhaliza"
    },
    {
      city: "Medan",
      address: "Jl. Gatot Subroto No. 789, Medan 20112",
      phone: "+62 61 5555 1234",
      email: "medan@metito.id",
      manager: "Ir. Budi Wijaya"
    },
    {
      city: "Bandung",
      address: "Jl. Asia Afrika No. 321, Bandung 40111",
      phone: "+62 22 5555 1234",
      email: "bandung@metito.id",
      manager: "Ir. Dewi Sartika"
    }
  ]

  const supportOptions = [
    {
      icon: <Headphones className="w-8 h-8 text-blue-600" />,
      title: "Dukungan Teknis",
      description: "Dapatkan bantuan untuk instalasi, pemeliharaan, dan troubleshooting",
      contact: "support@metito.id",
      hours: "Tersedia 24/7"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Pertanyaan Penjualan",
      description: "Minta penawaran, informasi produk, dan konsultasi",
      contact: "sales@metito.id",
      hours: "Sen-Jum 08:00-18:00"
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Informasi Umum",
      description: "Informasi perusahaan, kemitraan, dan pertanyaan umum",
      contact: "info@metito.id",
      hours: "Sen-Jum 08:00-18:00"
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
              Hubungi Kami
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Hubungi
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Tim Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Siap mendiskusikan kebutuhan pengolahan air Anda? Tim ahli kami siap membantu Anda menemukan solusi yang sempurna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Telepon Sekarang: +62 812-1760-3950
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white px-8 py-3 rounded-xl font-semibold">
              Kirim Email
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Kirim Pesan kepada Kami
                  </CardTitle>
                  <p className="text-gray-600">
                    Isi formulir di bawah ini dan kami akan menghubungi Anda dalam 24 jam.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Depan *
                      </label>
                      <Input placeholder="John" className="border-gray-200 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Belakang *
                      </label>
                      <Input placeholder="Doe" className="border-gray-200 focus:border-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Email *
                    </label>
                    <Input type="email" placeholder="john.doe@perusahaan.com" className="border-gray-200 focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <Input type="tel" placeholder="+62 812 3456 7890" className="border-gray-200 focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Perusahaan
                    </label>
                    <Input placeholder="Perusahaan Anda" className="border-gray-200 focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Pertanyaan *
                    </label>
                    <Select>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Pilih jenis pertanyaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">Minta Penawaran</SelectItem>
                        <SelectItem value="support">Dukungan Teknis</SelectItem>
                        <SelectItem value="consultation">Konsultasi</SelectItem>
                        <SelectItem value="partnership">Kemitraan</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <Textarea
                      placeholder="Silakan jelaskan kebutuhan pengolahan air atau pertanyaan Anda..."
                      className="border-gray-200 focus:border-blue-500 min-h-[120px]"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-3">
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Dengan mengirimkan formulir ini, Anda menyetujui kebijakan privasi dan ketentuan layanan kami.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informasi Kontak
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                            <div className="space-y-1">
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="text-sm text-gray-600">{detail}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Support Options */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Opsi Dukungan
                </h2>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                            <div className="flex flex-col sm:flex-row gap-2 text-sm">
                              <Badge variant="outline" className="w-fit">
                                {option.contact}
                              </Badge>
                              <Badge variant="outline" className="w-fit text-green-600 border-green-200">
                                {option.hours}
                              </Badge>
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
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lokasi Kantor Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami memiliki kantor di seluruh Indonesia untuk melayani Anda dengan lebih baik. Kunjungi kami atau hubungi lokasi terdekat Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{office.city}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>{office.address}</p>
                    <p className="font-medium text-blue-600">{office.phone}</p>
                    <p className="font-medium text-blue-600">{office.email}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="font-semibold text-gray-900">{office.manager}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Temukan Kami di Sini
            </h2>
            <p className="text-lg text-gray-600">
              Kantor pusat kami berlokasi di jantung distrik bisnis Jakarta.
            </p>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Peta Interaktif</h3>
                <p className="text-gray-600">
                  Jl. Sudirman No. 123, Jakarta Pusat 10220
                </p>
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Lihat di Google Maps
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Hubungi kami hari ini untuk konsultasi gratis dan penawaran untuk kebutuhan pengolahan air Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Jadwalkan Konsultasi
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white px-8 py-3 rounded-xl font-semibold">
              Unduh Brosur
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
