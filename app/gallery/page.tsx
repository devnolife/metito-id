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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proyek Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi portofolio komprehensif proyek pengolahan air kami di berbagai industri dan aplikasi.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full mb-12 bg-white shadow-lg rounded-xl p-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 px-3 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
                >
                  <span className="font-medium text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterProjects(category.id).map((project) => (
                    <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 p-2 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 p-2 rounded-lg">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge className="bg-blue-600 text-white mb-2">
                            {project.category.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{project.year}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building className="w-4 h-4" />
                            <span>{project.client}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
