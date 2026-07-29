"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Droplets, Filter, Zap, Shield, Wrench, Clock, Phone, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { COMPANY, CONTACT, ENGINEERING_SERVICES, toWhatsAppNumber } from "@/lib/company-profile"

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

// Layanan dari company profile — dipakai bila API belum punya data.
const FALLBACK_SERVICES: Service[] = ENGINEERING_SERVICES.map((service) => ({
  id: service.slug,
  name: service.title,
  slug: service.slug,
  description: service.description,
  shortDesc: service.description,
  icon: service.icon,
  features: [],
  isFeatured: false,
  isActive: true,
}))

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES)
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
          const apiServices: Service[] = data.data || []
          // Selalu tampilkan layanan dari company profile bila API belum terisi.
          setServices(apiServices.length > 0 ? apiServices : FALLBACK_SERVICES)
        } else {
          throw new Error(data.message || 'Failed to load services')
        }

      } catch (error) {
        console.error('Error loading services:', error)
        setServices(FALLBACK_SERVICES)
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
    <div className="min-h-screen bg-[var(--navy)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-lime/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--navy)]" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-lime/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Engineering Services
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Layanan Teknik{" "}
            <span className="text-[var(--lime-bright)]">Profesional &amp; Konsultasi</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Mencakup perancangan, instalasi, hingga pemeliharaan sistem dan proses industri &mdash; WTP, WWTP, STP,
            reverse osmosis, demineralization plant, dan chlorine dioxide system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              <a href={`https://wa.me/${toWhatsAppNumber(CONTACT.phones[0])}`} target="_blank" rel="noopener noreferrer">
                Konsultasi Gratis
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-[var(--surface)] hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <a href={`mailto:${CONTACT.email}`}>Kirim Email</a>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-lime/20 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Layanan Kami
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.1]">
              Layanan Profesional
            </h2>
            <p className="mt-5 text-lg text-[var(--body-muted)] leading-relaxed">
              Layanan teknik dan konsultasi {COMPANY.shortName} untuk sistem pengolahan air dan proses industri
            </p>
          </Reveal>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
              <span className="ml-2 text-[var(--body-muted)]">Memuat layanan...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
              <p className="text-[var(--body-muted)] mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] rounded-full px-7"
              >
                Muat Ulang
              </Button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => {
                const IconComponent = iconMapping[service.icon || 'droplets'] || Droplets

                return (
                  <Reveal key={service.id} delay={i % 3}>
                    <Card className="group h-full rounded-[1.25rem] bg-[var(--surface)] border border-[var(--hairline)] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                      <CardHeader className="text-center pb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gold/15 text-[var(--gold)] border border-gold/30 transition-colors duration-300 group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)] mx-auto">
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <CardTitle className="font-display text-xl font-bold text-white transition-colors">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <p className="text-[var(--body-muted)] leading-relaxed text-[15px]">
                          {service.shortDesc || service.description}
                        </p>
                        <div className="space-y-2 text-left">
                          {service.features.slice(0, 4).map((feature: string, index: number) => (
                            <div key={index} className="flex items-center text-sm text-[var(--body-text)]">
                              <CheckCircle className="w-4 h-4 text-[var(--lime-dim)] mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {service.pricing && service.pricing.startingPrice ? (
                          <div className="text-lg font-semibold text-white mb-4">
                            {service.pricing.startingPrice}
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-[var(--body-muted)] mb-4">
                            Hubungi untuk Harga
                          </div>
                        )}
                        <Button className="w-full bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] rounded-full">
                          Konsultasi Gratis
                        </Button>
                      </CardContent>
                    </Card>
                  </Reveal>
                )
              })}

              {/* No Services Found */}
              {services.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-[var(--body-muted)]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Belum Ada Layanan</h3>
                  <p className="text-[var(--body-muted)] mb-6">Layanan sedang dalam proses pengembangan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-lime/20 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Proses Kerja
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.1]">
              Bagaimana Kami Bekerja
            </h2>
            <p className="mt-5 text-lg text-[var(--body-muted)] leading-relaxed">
              Proses kerja yang terstruktur dan sistematis untuk hasil optimal
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <Reveal key={index} delay={index % 5} className="text-center relative">
                <div className="w-16 h-16 bg-gold/15 text-[var(--gold)] border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <span className="font-display font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-display font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--body-muted)]">{step.description}</p>

                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-lime/40 transform -translate-x-4"></div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-navy/92 to-navy/70" />
        <Reveal className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Mulai Sekarang
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Hubungi tim ahli kami untuk konsultasi gratis dan dapatkan solusi pengolahan air yang tepat untuk kebutuhan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              <a href={`tel:${CONTACT.phones[0].replace(/-/g, "")}`}>
                <Phone className="w-5 h-5 mr-2" />
                {CONTACT.phones[0]}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-[var(--surface)] hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <a href={`mailto:${CONTACT.email}`}>
                <Mail className="w-5 h-5 mr-2" />
                {CONTACT.email}
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
} 
