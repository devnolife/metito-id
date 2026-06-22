"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Award, Shield, CheckCircle, Download, Calendar, Building, Globe, Loader2, AlertCircle, FileText, FileX } from "lucide-react"
import Image from "next/image"

// Types
interface Certification {
  id: string
  name: string
  description?: string
  issuer: string
  certificate?: string
  issuedAt: string
  expiresAt?: string
  certificateNumber?: string
  credentialUrl?: string
  category?: string
  level?: string
  status?: 'active' | 'expired' | 'pending'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  count: number
  icon: React.ReactNode
}

export default function CertificationPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Icon mapping untuk categories
  const categoryIcons: Record<string, React.ReactNode> = {
    "Quality Management": <Award className="w-5 h-5" />,
    "Environmental Management": <Globe className="w-5 h-5" />,
    "Occupational Health & Safety": <Shield className="w-5 h-5" />,
    "Water Quality Standards": <CheckCircle className="w-5 h-5" />,
    "Pressure Vessel": <Building className="w-5 h-5" />,
    "European Conformity": <CheckCircle className="w-5 h-5" />,
    "International Standards": <Globe className="w-5 h-5" />,
    "Safety Standards": <Shield className="w-5 h-5" />,
  }

  // Load certifications from API
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/certifications?active=true')

        if (!response.ok) {
          throw new Error('Failed to fetch certifications')
        }

        const data = await response.json()

        if (data.success) {
          const certs = data.data || []
          setCertifications(certs)

          // Generate categories dari data yang ada
          const categoryCount: Record<string, number> = {}
          certs.forEach((cert: Certification) => {
            if (cert.category) {
              categoryCount[cert.category] = (categoryCount[cert.category] || 0) + 1
            }
          })

          const generatedCategories: Category[] = Object.entries(categoryCount).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            count,
            icon: categoryIcons[name] || <FileText className="w-5 h-5" />
          }))

          setCategories(generatedCategories)
        } else {
          throw new Error(data.message || 'Failed to load certifications')
        }

      } catch (error) {
        console.error('Error loading certifications:', error)
        setError('Gagal memuat data sertifikasi. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadCertifications()
  }, [])

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getStatusBadge = (cert: Certification) => {
    if (cert.status === 'expired' || isExpired(cert.expiresAt)) {
      return <Badge variant="destructive" className="text-xs">Kedaluwarsa</Badge>
    }
    if (cert.status === 'pending') {
      return <Badge variant="secondary" className="text-xs">Pending</Badge>
    }
    return <Badge variant="default" className="bg-green-600 text-xs">Aktif</Badge>
  }

  // Static awards data (could be moved to database later)
  const awards = [
    {
      title: "Water Technology Company of the Year",
      year: "2023",
      organization: "Indonesia Water Association",
      description: "Penghargaan untuk inovasi terdepan dalam teknologi pengolahan air"
    },
    {
      title: "Excellence in Environmental Solutions",
      year: "2022",
      organization: "Ministry of Environment",
      description: "Pengakuan atas kontribusi dalam solusi ramah lingkungan"
    },
    {
      title: "Best Water Treatment Project",
      year: "2023",
      organization: "Asia Water Forum",
      description: "Proyek terbaik dalam kategori pengolahan air industri"
    },
    {
      title: "Innovation Award",
      year: "2022",
      organization: "Indonesian Engineering Association",
      description: "Penghargaan inovasi untuk teknologi desalinasi air laut"
    }
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
            Sertifikasi &amp; Penghargaan
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Standar Kualitas{" "}
            <span className="text-[var(--lime-bright)]">Internasional</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Komitmen kami terhadap kualitas dan keunggulan terbukti melalui berbagai sertifikasi internasional dan penghargaan industri.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              <Download className="w-4 h-4 mr-2" />
              Download Sertifikat
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Lihat Penghargaan
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Kategori Sertifikasi
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Beragam Standar
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Sertifikasi yang mencakup berbagai aspek operasional untuk memastikan kualitas terbaik
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Reveal key={index} delay={index % 3}>
                <Card className="group h-full text-center rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--navy)] text-[var(--lime)] rounded-2xl mb-6 transition-colors duration-300 group-hover:bg-[var(--lime)] group-hover:text-[var(--navy)]">
                      {category.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-2">{category.name}</h3>
                    <p className="text-slate-500 text-sm">
                      {category.count} Sertifikat
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Sertifikasi Kami
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Sertifikat Resmi
            </h2>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Komitmen kami terhadap kualitas dan standar internasional tercermin dalam berbagai sertifikasi yang telah kami peroleh
            </p>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse rounded-[1.25rem] border border-[#dce9ff]">
                  <div className="aspect-[4/3] bg-[#e5eeff] rounded-t-[1.25rem]"></div>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-[#e5eeff] rounded-full"></div>
                    <div className="h-3 bg-[#eff4ff] rounded-full w-3/4"></div>
                    <div className="h-3 bg-[#eff4ff] rounded-full w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <FileX className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-semibold">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full px-7"
              >
                Coba Lagi
              </Button>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-semibold text-slate-600">Belum ada sertifikasi</p>
              <p className="text-slate-500">Sertifikasi akan ditampilkan di sini setelah ditambahkan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, i) => (
                <Reveal key={cert.id} delay={i % 3}>
                  <Card className="group h-full rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)] overflow-hidden">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={cert.certificate || '/certificates/default-cert.jpg'}
                        alt={cert.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-[var(--navy)] font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                          {cert.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(cert)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-2">{cert.name}</h3>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">{cert.description}</p>

                      <div className="space-y-2 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[var(--navy)]" />
                          <span>Penerbit: {cert.issuer}</span>
                        </div>
                        {cert.expiresAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--navy)]" />
                            <span>Berlaku hingga: {formatDate(cert.expiresAt)}</span>
                          </div>
                        )}
                      </div>

                      {cert.credentialUrl && (
                        <Button
                          className="w-full bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full text-sm"
                          onClick={() => window.open(cert.credentialUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Sertifikat
                        </Button>
                      )}

                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Penghargaan
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Pengakuan Industri
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Berbagai penghargaan yang membuktikan keunggulan dan inovasi kami di industri pengolahan air
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <Reveal key={index} delay={index % 2}>
                <Card className="group h-full rounded-[1.25rem] bg-[#f8f9ff] border border-[#e5eeff] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(11,28,48,0.25)]">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--navy)] text-[var(--lime)] rounded-2xl flex-shrink-0 transition-colors duration-300 group-hover:bg-[var(--lime)] group-hover:text-[var(--navy)]">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-display font-bold text-lg text-[var(--navy)]">{award.title}</h3>
                          <Badge variant="outline" className="text-[#3d4d00] border-[var(--lime)]/40 bg-[var(--lime)]/10">
                            {award.year}
                          </Badge>
                        </div>
                        <p className="text-[var(--navy)] font-medium mb-2">{award.organization}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{award.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
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
            Percayakan Proyek Anda pada Ahlinya
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Dengan berbagai sertifikasi dan penghargaan, kami siap memberikan solusi pengolahan air terbaik untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Konsultasi Gratis
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <Download className="w-5 h-5 mr-2" />
              Download Company Profile
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
} 
