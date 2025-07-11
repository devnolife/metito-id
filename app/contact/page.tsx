import { SidebarLayout } from "@/components/sidebar-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Headphones, Globe } from "lucide-react"

export default function ContactPage() {
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
        "+62 21 5555 1234",
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
      phone: "+62 21 5555 1234",
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
    <SidebarLayout
      title="Hubungi Kami"
      description="Siap mendiskusikan kebutuhan pengolahan air Anda? Tim ahli kami siap membantu menemukan solusi yang sempurna."
    >
      <div className="space-y-16">
        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form & Support Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-lg">
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
                    <Input placeholder="John" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Belakang *
                    </label>
                    <Input placeholder="Doe" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email *
                  </label>
                  <Input type="email" placeholder="john.doe@perusahaan.com" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <Input type="tel" placeholder="+62 812 3456 7890" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan
                  </label>
                  <Input placeholder="Perusahaan Anda" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Pertanyaan *
                  </label>
                  <Select>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Pilih jenis pertanyaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Minta Penawaran</SelectItem>
                      <SelectItem value="support">Dukungan Teknis</SelectItem>
                      <SelectItem value="info">Informasi Produk</SelectItem>
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
                    placeholder="Ceritakan kebutuhan Anda..."
                    className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-3">
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pesan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Opsi Dukungan</h3>
              <p className="text-gray-600 mb-6">
                Pilih cara terbaik untuk menghubungi kami berdasarkan kebutuhan Anda.
              </p>
            </div>

            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{option.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-600">{option.contact}</p>
                          <p className="text-sm text-gray-500">{option.hours}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <section>
          <div className="text-center mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Kantor Cabang
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lokasi Kantor Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dengan kantor di seluruh Indonesia, kami siap melayani Anda kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{office.city}</h3>
                      <p className="text-gray-600 mb-2">{office.address}</p>
                      <p className="font-medium text-blue-600 mb-1">{office.phone}</p>
                      <p className="font-medium text-blue-600 mb-2">{office.email}</p>
                      <p className="text-sm text-gray-500">Manager: {office.manager}</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Hubungi Kantor {office.city}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan Segera?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Tim teknis kami tersedia 24/7 untuk membantu Anda dengan masalah darurat atau pertanyaan mendesak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Sekarang
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <MessageSquare className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
} 
