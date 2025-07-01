import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download, MapPin, Calendar, Building } from "lucide-react"
import Image from "next/image"

export default function GalleryPage() {
  const projects = [
    {
      id: 1,
      title: "Pabrik Pengolahan Air Industri",
      category: "industrial",
      location: "Jakarta, Indonesia",
      year: "2023",
      client: "PT Manufacturing Corp",
      image: "/placeholder.jpg",
      description: "Sistem pengolahan air lengkap untuk fasilitas manufaktur"
    },
    {
      id: 2,
      title: "Sistem Penyediaan Air Kota",
      category: "municipal",
      location: "Surabaya, Indonesia",
      year: "2023",
      client: "Pemerintah Kota",
      image: "/placeholder.jpg",
      description: "Pengolahan dan distribusi air kota skala besar"
    },
    {
      id: 3,
      title: "Pabrik Reverse Osmosis",
      category: "ro-systems",
      location: "Bandung, Indonesia",
      year: "2022",
      client: "PT Beverage Company",
      image: "/placeholder.jpg",
      description: "Sistem reverse osmosis kapasitas tinggi untuk produksi minuman"
    },
    {
      id: 4,
      title: "Fasilitas Pengolahan Air Limbah",
      category: "wastewater",
      location: "Medan, Indonesia",
      year: "2022",
      client: "Kompleks Industri",
      image: "/placeholder.jpg",
      description: "Sistem pengolahan dan daur ulang air limbah canggih"
    },
    {
      id: 5,
      title: "Pengolahan Air Rumah Sakit",
      category: "commercial",
      location: "Yogyakarta, Indonesia",
      year: "2023",
      client: "Rumah Sakit Umum",
      image: "/placeholder.jpg",
      description: "Sistem pengolahan air medis untuk fasilitas kesehatan"
    },
    {
      id: 6,
      title: "Sistem Air Hotel",
      category: "commercial",
      location: "Bali, Indonesia",
      year: "2022",
      client: "Resort Mewah",
      image: "/placeholder.jpg",
      description: "Solusi pengolahan air lengkap untuk industri pariwisata"
    },
    {
      id: 7,
      title: "Pengolahan Air Pabrik Kimia",
      category: "industrial",
      location: "Tangerang, Indonesia",
      year: "2023",
      client: "PT Chemical Industries",
      image: "/placeholder.jpg",
      description: "Pengolahan air khusus untuk pemrosesan kimia"
    },
    {
      id: 8,
      title: "Pabrik Desalinasi",
      category: "desalination",
      location: "Makassar, Indonesia",
      year: "2022",
      client: "Pengembangan Pesisir",
      image: "/placeholder.jpg",
      description: "Sistem desalinasi air laut untuk komunitas pesisir"
    }
  ]

  const categories = [
    { id: "all", name: "Semua Proyek", count: projects.length },
    { id: "industrial", name: "Industri", count: projects.filter(p => p.category === "industrial").length },
    { id: "municipal", name: "Kota", count: projects.filter(p => p.category === "municipal").length },
    { id: "commercial", name: "Komersial", count: projects.filter(p => p.category === "commercial").length },
    { id: "ro-systems", name: "Sistem RO", count: projects.filter(p => p.category === "ro-systems").length },
    { id: "wastewater", name: "Air Limbah", count: projects.filter(p => p.category === "wastewater").length },
    { id: "desalination", name: "Desalinasi", count: projects.filter(p => p.category === "desalination").length }
  ]

  const filterProjects = (category: string) => {
    if (category === "all") return projects
    return projects.filter(project => project.category === category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Portofolio Proyek
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Galeri
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Proyek Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Jelajahi instalasi pengolahan air yang berhasil di seluruh Indonesia, menampilkan solusi inovatif dan keunggulan teknik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Lihat Semua Proyek
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Unduh Brosur
            </Button>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-medium">
                Portfolio Terbaik
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Proyek Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Jelajahi portofolio komprehensif proyek pengolahan air kami di berbagai industri dan aplikasi dengan standar kualitas tertinggi.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex h-auto p-1 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl">
                {categories.map((category, index) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="relative px-6 py-3 text-sm font-semibold text-gray-600 data-[state=active]:text-white data-[state=active]:bg-blue-600 rounded-xl transition-all duration-200 hover:text-blue-600"
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        {category.count}
                      </Badge>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterProjects(category.id).map((project, index) => (
                    <Card key={project.id} className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                      <div className="relative overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 text-blue-700 font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-white/20">
                            {project.category.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <Button
                            size="icon"
                            className="w-10 h-10 bg-white/95 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="w-10 h-10 bg-white/95 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Project Number */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <MapPin className="w-4 h-4" />
                              <span className="font-medium">{project.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{project.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                <span className="font-medium">{project.client}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar Animation */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {filterProjects(category.id).length > 6 && (
                  <div className="text-center mt-12">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                      Lihat Lebih Banyak Proyek
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Proyek Selesai</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600 font-medium">Tahun Pengalaman</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Klien Puas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Dukungan Tersedia</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
