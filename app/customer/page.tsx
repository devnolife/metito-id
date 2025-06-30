import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, Building2, MapPin, Calendar, Users, Award, ThumbsUp } from "lucide-react"

export default function CustomerPage() {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Ahmad Santoso",
      position: "General Manager",
      company: "PT Indofood Manufacturing",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Metito Water Engineer telah menjadi mitra terpercaya kami selama lebih dari 5 tahun. Sistem pengolahan air mereka telah meningkatkan efisiensi produksi dan kualitas produk kami secara signifikan. Tim mereka profesional dan selalu siap memberikan dukungan.",
      project: "Pabrik Pengolahan Air Industri",
      location: "Jakarta",
      year: "2019-2024"
    },
    {
      id: 2,
      name: "Ir. Siti Nurhaliza",
      position: "Plant Manager",
      company: "PT Pharmaceutical Indonesia",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Layanan luar biasa dan peralatan berkualitas tinggi. Sistem air farmasi yang mereka pasang melampaui semua harapan kami. Layanan pemeliharaan mereka sangat baik dan responsif.",
      project: "Sistem Air Farmasi",
      location: "Bandung",
      year: "2020-2024"
    },
    {
      id: 3,
      name: "Bapak Wijaya",
      position: "Operations Director",
      company: "Hotel Grand Indonesia",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Sistem pengolahan air hotel telah berjalan sempurna selama 3 tahun. Tamu kami secara konsisten memuji kualitas air, dan sistem telah membantu kami mengurangi biaya operasional secara signifikan.",
      project: "Pengolahan Air Hotel",
      location: "Jakarta",
      year: "2021-2024"
    },
    {
      id: 4,
      name: "Dr. Made Sutrisno",
      position: "Hospital Director",
      company: "RS Sanglah Hospital",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Air medis sangat penting untuk operasi kami. Metito Water Engineer memberikan sistem yang memenuhi semua standar internasional. Tim dukungan teknis mereka berpengetahuan dan selalu siap membantu.",
      project: "Pengolahan Air Medis",
      location: "Bali",
      year: "2022-2024"
    },
    {
      id: 5,
      name: "Ibu Dewi Sartika",
      position: "Environmental Manager",
      company: "PT Pertamina Refinery",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Sistem pengolahan air limbah telah membantu kami mencapai zero liquid discharge dan memenuhi semua regulasi lingkungan. Keahlian Metito Water Engineer dalam air limbah industri sangat mengesankan.",
      project: "Pengolahan Air Limbah Industri",
      location: "Cilacap",
      year: "2020-2024"
    },
    {
      id: 6,
      name: "Pak Hendri Kurniawan",
      position: "Production Manager",
      company: "PT Aqua Golden Mississippi",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Sistem reverse osmosis untuk produksi minuman kami telah luar biasa. Kualitas air konsisten, dan efisiensi sistem telah melampaui harapan kami. Sangat direkomendasikan!",
      project: "Pengolahan Air Minuman",
      location: "Sukabumi",
      year: "2021-2024"
    }
  ]

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "500+", label: "Pelanggan Puas", color: "text-blue-600" },
    { icon: <Award className="w-8 h-8" />, value: "25+", label: "Tahun Pengalaman", color: "text-green-600" },
    { icon: <ThumbsUp className="w-8 h-8" />, value: "99%", label: "Kepuasan Pelanggan", color: "text-purple-600" },
    { icon: <Building2 className="w-8 h-8" />, value: "1000+", label: "Proyek Selesai", color: "text-orange-600" }
  ]

  const industries = [
    "Manufaktur", "Farmasi", "Makanan & Minuman", "Kesehatan",
    "Pariwisata", "Pertambangan", "Petrokimia", "Kota", "Pembangkit Listrik"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Kisah Sukses Pelanggan
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Apa Kata
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Pelanggan Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Temukan mengapa perusahaan terkemuka di seluruh Indonesia mempercayai Metito Water Engineer untuk kebutuhan pengolahan air mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Lihat Studi Kasus
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimoni Pelanggan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Baca apa yang dikatakan pelanggan berharga kami tentang pengalaman mereka dengan solusi pengolahan air kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.review}"
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                        <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{testimonial.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{testimonial.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{testimonial.year}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industri yang Kami Layani
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi pengolahan air kami melayani berbagai industri di seluruh Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-6 py-3 text-base font-medium border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Bergabung dengan Kisah Sukses Kami?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Biarkan kami membantu Anda mencapai tujuan pengolahan air dengan solusi yang terbukti dan dukungan ahli kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Dapatkan Konsultasi Gratis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Unduh Brosur
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
