"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Eye, Download, MapPin, Calendar, Building, Loader2, AlertCircle, ImageIcon } from "lucide-react"
import Image from "next/image"

// Types
interface GalleryItem {
  id: string
  title: string
  description?: string
  image: string
  category?: string
  projectType: 'INDUSTRIAL' | 'MUNICIPAL' | 'RESIDENTIAL' | 'COMMERCIAL'
  location?: string
  completedAt?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  count: number
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  // Project type mapping untuk filter
  const projectTypeMap: Record<string, string> = {
    'INDUSTRIAL': 'Industri',
    'MUNICIPAL': 'Kota',
    'COMMERCIAL': 'Komersial',
    'RESIDENTIAL': 'Residensial'
  }

  // Category mapping untuk backward compatibility
  const categoryMap: Record<string, string> = {
    'industrial': 'Industri',
    'municipal': 'Kota',
    'commercial': 'Komersial',
    'ro-systems': 'Sistem RO',
    'wastewater': 'Air Limbah',
    'desalination': 'Desalinasi'
  }

  // Load gallery items from API
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/gallery?limit=50')

        if (!response.ok) {
          throw new Error('Failed to fetch gallery items')
        }

        const data = await response.json()

        if (data.success) {
          const items = data.data?.galleryItems || []
          setGalleryItems(items)

          // Generate categories dari data yang ada
          const categoryCount: Record<string, number> = {}
          items.forEach((item: GalleryItem) => {
            const category = item.category || item.projectType.toLowerCase()
            categoryCount[category] = (categoryCount[category] || 0) + 1
          })

          const generatedCategories: Category[] = [
            { id: 'all', name: 'Semua Proyek', count: items.length }
          ]

          Object.entries(categoryCount).forEach(([key, count]) => {
            const name = categoryMap[key] || projectTypeMap[key.toUpperCase()] || key
            generatedCategories.push({ id: key, name, count })
          })

          setCategories(generatedCategories)
        } else {
          throw new Error(data.message || 'Failed to load gallery items')
        }

      } catch (error) {
        console.error('Error loading gallery data:', error)
        setError('Gagal memuat data galeri. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadGalleryData()
  }, [])

  const filterProjects = (category: string) => {
    if (category === "all") return galleryItems
    return galleryItems.filter((item: GalleryItem) => {
      const itemCategory = item.category || item.projectType.toLowerCase()
      return itemCategory === category
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-[var(--lime)]/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Portfolio Terbaik
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Galeri Proyek{" "}
            <span className="text-[var(--lime-bright)]">Unggulan Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Jelajahi portofolio komprehensif proyek pengolahan air kami di berbagai industri dan aplikasi dengan standar kualitas tertinggi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Lihat Semua Proyek
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <Download className="w-4 h-4 mr-2" />
              Unduh Brosur
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Project Gallery Section */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Portfolio Terbaik
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              Proyek Unggulan
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Koleksi lengkap proyek-proyek pengolahan air yang telah kami kerjakan dengan standar internasional
            </p>
          </Reveal>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-12">
              {loading ? (
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-[#e5eeff] rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <TabsList className="inline-flex h-auto p-1 bg-white/90 backdrop-blur-sm shadow-lg border border-[#dce9ff] rounded-2xl">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="relative px-4 py-2 text-sm font-semibold text-slate-600 data-[state=active]:text-white data-[state=active]:bg-[var(--navy)] rounded-xl transition-all duration-200 hover:text-[var(--navy)]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="bg-[#eff4ff] text-slate-600 text-xs px-2 py-0.5">
                          {category.count}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}
            </div>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--navy)]" />
                    <span className="ml-2 text-slate-500">Memuat galeri...</span>
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

                {/* Gallery Grid */}
                {!loading && !error && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filterProjects(category.id).map((project: GalleryItem, i: number) => (
                      <Reveal key={project.id} delay={i % 3}>
                        <Card className="group h-full overflow-hidden rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)] transition-all duration-300 hover:-translate-y-2">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <div className="relative w-full h-full">
                              <Image
                                src={project.image || '/placeholder.jpg'}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/95 text-[var(--navy)] font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-white/20">
                                {project.category ?
                                  project.category.replace("-", " ").toUpperCase() :
                                  projectTypeMap[project.projectType] || project.projectType
                                }
                              </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-white/90 text-[var(--navy)] hover:bg-[var(--lime)] rounded-full w-10 h-10 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" className="bg-white/90 text-[var(--navy)] hover:bg-[var(--lime)] rounded-full w-10 h-10 p-0">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-2 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                              {project.description || 'Proyek pengolahan air berkualitas tinggi'}
                            </p>

                            <div className="space-y-2 text-sm text-slate-500">
                              {project.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-[var(--navy)]" />
                                  <span>{project.location}</span>
                                </div>
                              )}
                              {project.completedAt && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[var(--navy)]" />
                                  <span>{new Date(project.completedAt).getFullYear()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-[var(--navy)]" />
                                <span>{projectTypeMap[project.projectType] || project.projectType}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#e5eeff]">
                              <Button className="w-full bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full text-sm">
                                Lihat Detail Proyek
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Reveal>
                    ))}

                    {/* Empty State */}
                    {filterProjects(category.id).length === 0 && (
                      <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto mb-6">
                          <ImageIcon className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-[var(--navy)] mb-2">Belum Ada Proyek</h3>
                        <p className="text-slate-500 mb-6">Proyek untuk kategori ini sedang dalam pengembangan</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
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
            Tertarik dengan Proyek Kami?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Konsultasikan kebutuhan proyek pengolahan air Anda dengan tim ahli kami untuk mendapatkan solusi terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Konsultasi Proyek
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <Download className="w-5 h-5 mr-2" />
              Download Portfolio
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
} 
