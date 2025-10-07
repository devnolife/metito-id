
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Footer } from "@/components/footer"
import { Star, Quote, Building2, MapPin, Calendar, Users, Award, ThumbsUp, Loader2, AlertCircle } from "lucide-react"

// Types
interface Testimonial {
  id: string
  name: string
  company?: string
  position?: string
  content: string
  rating: number
  avatar?: string
  isFeatured: boolean
  createdAt: string
}

export default function CustomerPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/testimonials?limit=20')

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials')
        }

        const data = await response.json()

        if (data.success) {
          setTestimonials(data.data || [])
        } else {
          throw new Error(data.message || 'Failed to load testimonials')
        }

      } catch (error) {
        console.error('Error loading testimonials:', error)
        setError('Gagal memuat data testimoni. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  // Helper function to format date
  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  // Dynamic stats based on testimonials data
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: `${testimonials.length}+`,
      label: "Testimoni Pelanggan",
      color: "text-blue-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "25+",
      label: "Tahun Pengalaman",
      color: "text-green-600"
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      value: testimonials.length > 0 ? `${Math.round((testimonials.filter(t => t.rating >= 4).length / testimonials.length) * 100)}%` : "99%",
      label: "Kepuasan Pelanggan",
      color: "text-purple-600"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      value: "1000+",
      label: "Proyek Selesai",
      color: "text-orange-600"
    }
  ]

  const industries = [
    "Manufaktur", "Farmasi", "Makanan & Minuman", "Kesehatan",
    "Pariwisata", "Pertambangan", "Petrokimia", "Kota", "Pembangkit Listrik"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Testimoni Pelanggan
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Kepercayaan
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Pelanggan Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Baca apa yang dikatakan pelanggan berharga kami tentang pengalaman mereka dengan solusi pengolahan air kami.
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
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Pencapaian Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Angka Berbicara
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kepercayaan dari berbagai industri telah membuktikan kualitas dan keandalan layanan kami
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

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Testimoni Pelanggan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pelanggan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mendengar langsung dari pelanggan yang telah merasakan manfaat solusi pengolahan air kami
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Memuat testimoni...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Muat Ulang
              </Button>
            </div>
          )}

          {/* Testimonials Grid */}
          {!loading && !error && (
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

                    <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                      "{testimonial.content}"
                    </p>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={testimonial.avatar || '/placeholder-user.jpg'} alt={testimonial.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {getInitials(testimonial.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          {testimonial.position && (
                            <p className="text-sm text-gray-600">{testimonial.position}</p>
                          )}
                          {testimonial.company && (
                            <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-500">
                        {testimonial.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span>{testimonial.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{formatYear(testimonial.createdAt)}</span>
                        </div>
                        {testimonial.isFeatured && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-600 font-medium">Testimoni Pilihan</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {testimonials.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Quote className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Testimoni</h3>
                  <p className="text-gray-600 mb-6">Testimoni pelanggan akan tampil di sini</p>
                </div>
              )}
            </div>
          )}
        </div>       
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Industri yang Dilayani
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beragam Industri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami melayani berbagai industri dengan solusi pengolahan air yang disesuaikan dengan kebutuhan spesifik
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-6 py-3 text-sm font-medium border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
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
            Bergabunglah dengan Pelanggan Puas Kami
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Ribuan perusahaan telah mempercayai kami untuk kebutuhan pengolahan air mereka. Saatnya giliran Anda merasakan perbedaannya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Mulai Konsultasi
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Download Case Study
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
