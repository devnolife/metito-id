"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Droplets, Filter, Zap, Shield, Wrench, Clock, Phone, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react"

// Types
interface Service {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string
  icon?: string
  features: string[]
  pricing?: any
  isFeatured: boolean
  isActive: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Icon mapping untuk services
  const iconMapping: Record<string, any> = {
    "droplets": Droplets,
    "filter": Filter,
    "zap": Zap,
    "shield": Shield,
    "wrench": Wrench,
    "clock": Clock,
    "phone": Phone,
    "mail": Mail,
  }

  const colorMapping: Record<string, { icon: string, bg: string }> = {
    "droplets": { icon: "text-blue-600", bg: "bg-gradient-to-br from-blue-500 to-blue-600" },
    "filter": { icon: "text-orange-600", bg: "bg-gradient-to-br from-orange-500 to-orange-600" },
    "zap": { icon: "text-yellow-600", bg: "bg-gradient-to-br from-yellow-500 to-yellow-600" },
    "shield": { icon: "text-green-600", bg: "bg-gradient-to-br from-green-500 to-green-600" },
    "wrench": { icon: "text-purple-600", bg: "bg-gradient-to-br from-purple-500 to-purple-600" },
    "clock": { icon: "text-pink-600", bg: "bg-gradient-to-br from-pink-500 to-pink-600" },
    "phone": { icon: "text-blue-600", bg: "bg-gradient-to-br from-blue-500 to-blue-600" },
    "mail": { icon: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
  }

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/services')

        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }

        const data = await response.json()

        if (data.success) {
          setServices(data.data || [])
        } else {
          throw new Error(data.message || 'Failed to load services')
        }

      } catch (error) {
        console.error('Error loading services:', error)
        setError('Gagal memuat data layanan. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

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
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold">
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Memuat layanan...</span>
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

          {/* Services Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = iconMapping[service.icon || 'droplets'] || Droplets
                const colors = colorMapping[service.icon || 'droplets'] || colorMapping['droplets']

                return (
                  <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105">
                    <CardHeader className="text-center pb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${colors.bg}`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        {service.shortDesc || service.description}
                      </p>
                      <div className="space-y-2">
                        {service.features.slice(0, 4).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      {service.pricing && service.pricing.startingPrice ? (
                        <div className="text-lg font-semibold text-blue-600 mb-4">
                          {service.pricing.startingPrice}
                        </div>
                      ) : (
                        <div className="text-lg font-semibold text-gray-600 mb-4">
                          Hubungi untuk Harga
                        </div>
                      )}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                        Konsultasi Gratis
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}

              {/* No Services Found */}
              {services.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Layanan</h3>
                  <p className="text-gray-600 mb-6">Layanan sedang dalam proses pengembangan</p>
                </div>
              )}
            </div>
          )}
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
