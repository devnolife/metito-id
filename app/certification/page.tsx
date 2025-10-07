"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Sertifikasi & Penghargaan
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Standar Kualitas
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Internasional
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Komitmen kami terhadap kualitas dan keunggulan terbukti melalui berbagai sertifikasi internasional dan penghargaan industri.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Download Sertifikat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Lihat Penghargaan
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Kategori Sertifikasi
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beragam Standar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sertifikasi yang mencakup berbagai aspek operasional untuk memastikan kualitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 text-white">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.count} Sertifikat
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Sertifikasi Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sertifikat Resmi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Komitmen kami terhadap kualitas dan standar internasional tercermin dalam berbagai sertifikasi yang telah kami peroleh
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                Coba Lagi
              </Button>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-600">Belum ada sertifikasi</p>
              <p className="text-gray-500">Sertifikasi akan ditampilkan di sini setelah ditambahkan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert) => (
                <Card key={cert.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={cert.certificate || '/certificates/default-cert.jpg'}
                      alt={cert.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-blue-700 font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        {cert.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(cert)}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{cert.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{cert.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span>Penerbit: {cert.issuer}</span>
                      </div>
                      {cert.expiresAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>Berlaku hingga: {formatDate(cert.expiresAt)}</span>
                        </div>
                      )}
                    </div>

                    {cert.credentialUrl && (
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-sm"
                        onClick={() => window.open(cert.credentialUrl, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Sertifikat
                      </Button>
                    )}

                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium mb-4">
              Penghargaan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pengakuan Industri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai penghargaan yang membuktikan keunggulan dan inovasi kami di industri pengolahan air
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white flex-shrink-0">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{award.title}</h3>
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {award.year}
                        </Badge>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{award.organization}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{award.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Percayakan Proyek Anda pada Ahlinya
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Dengan berbagai sertifikasi dan penghargaan, kami siap memberikan solusi pengolahan air terbaik untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Gratis
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download Company Profile
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
