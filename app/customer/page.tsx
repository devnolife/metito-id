
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-[var(--lime)]/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Testimoni Pelanggan
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Kepercayaan{" "}
            <span className="text-[var(--lime-bright)]">Pelanggan Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Baca apa yang dikatakan pelanggan berharga kami tentang pengalaman mereka dengan solusi pengolahan air kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Lihat Studi Kasus
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Hubungi Kami
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Pencapaian Kami
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Angka Berbicara
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Kepercayaan dari berbagai industri telah membuktikan kualitas dan keandalan layanan kami
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index % 4} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--navy)] text-[var(--lime)] rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-[var(--navy)]">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Testimoni Pelanggan
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Apa Kata Pelanggan
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Mendengar langsung dari pelanggan yang telah merasakan manfaat solusi pengolahan air kami
            </p>
          </Reveal>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--navy)]" />
              <span className="ml-2 text-slate-500">Memuat testimoni...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--navy)] mb-2">Terjadi Kesalahan</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full px-7"
              >
                Muat Ulang
              </Button>
            </div>
          )}

          {/* Testimonials Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={i % 3}>
                  <Card className="group h-full rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <Quote className="w-8 h-8 text-[var(--lime)]/40 group-hover:text-[var(--lime)] transition-colors" />
                      </div>

                      <p className="text-slate-700 mb-6 leading-relaxed text-sm">
                        "{testimonial.content}"
                      </p>

                      <div className="border-t border-[#e5eeff] pt-4">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={testimonial.avatar || '/placeholder-user.jpg'} alt={testimonial.name} />
                            <AvatarFallback className="bg-[var(--navy)] text-[var(--lime)] font-semibold">
                              {getInitials(testimonial.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-display font-semibold text-[var(--navy)]">{testimonial.name}</h4>
                            {testimonial.position && (
                              <p className="text-sm text-slate-500">{testimonial.position}</p>
                            )}
                            {testimonial.company && (
                              <p className="text-sm font-medium text-[var(--navy)]">{testimonial.company}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-500">
                          {testimonial.company && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[var(--navy)]" />
                              <span>{testimonial.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--navy)]" />
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
                </Reveal>
              ))}

              {/* Empty State */}
              {testimonials.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Quote className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[var(--navy)] mb-2">Belum Ada Testimoni</h3>
                  <p className="text-slate-500 mb-6">Testimoni pelanggan akan tampil di sini</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Industri yang Dilayani
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Beragam Industri
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Kami melayani berbagai industri dengan solusi pengolahan air yang disesuaikan dengan kebutuhan spesifik
            </p>
          </Reveal>

          <Reveal className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-6 py-3 text-sm font-medium border-[#dce9ff] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)] transition-colors cursor-pointer"
              >
                {industry}
              </Badge>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/92 to-[var(--navy)]/70" />
        <Reveal className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Mulai Sekarang
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Bergabunglah dengan Pelanggan Puas Kami
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Ribuan perusahaan telah mempercayai kami untuk kebutuhan pengolahan air mereka. Saatnya giliran Anda merasakan perbedaannya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Mulai Konsultasi
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Download Case Study
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
} 
