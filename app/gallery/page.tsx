"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Portfolio Terbaik
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Galeri Proyek
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Unggulan Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Jelajahi portofolio komprehensif proyek pengolahan air kami di berbagai industri dan aplikasi dengan standar kualitas tertinggi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Lihat Semua Proyek
            </Button>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Unduh Brosur
            </Button>
          </div>
        </div>
      </section>

      {/* Project Gallery Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Portfolio Terbaik
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proyek Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Koleksi lengkap proyek-proyek pengolahan air yang telah kami kerjakan dengan standar internasional
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-12">
              {loading ? (
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <TabsList className="inline-flex h-auto p-1 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="relative px-4 py-2 text-sm font-semibold text-gray-600 data-[state=active]:text-white data-[state=active]:bg-blue-600 rounded-xl transition-all duration-200 hover:text-blue-600"
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
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
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Memuat galeri...</span>
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

                {/* Gallery Grid */}
                {!loading && !error && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filterProjects(category.id).map((project: GalleryItem) => (
                      <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <div className="relative w-full h-full">
                            <Image
                              src={project.image || '/placeholder.jpg'}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/95 text-blue-700 font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-white/20">
                              {project.category ?
                                project.category.replace("-", " ").toUpperCase() :
                                projectTypeMap[project.projectType] || project.projectType
                              }
                            </Badge>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {project.description || 'Proyek pengolahan air berkualitas tinggi'}
                          </p>

                          <div className="space-y-2 text-sm text-gray-500">
                            {project.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>{project.location}</span>
                              </div>
                            )}
                            {project.completedAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span>{new Date(project.completedAt).getFullYear()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span>{projectTypeMap[project.projectType] || project.projectType}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-sm">
                              Lihat Detail Proyek
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Empty State */}
                    {filterProjects(category.id).length === 0 && (
                      <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Proyek</h3>
                        <p className="text-gray-600 mb-6">Proyek untuk kategori ini sedang dalam pengembangan</p>
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tertarik dengan Proyek Kami?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Konsultasikan kebutuhan proyek pengolahan air Anda dengan tim ahli kami untuk mendapatkan solusi terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Proyek
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download Portfolio
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
