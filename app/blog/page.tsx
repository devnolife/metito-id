import { SidebarLayout } from "@/components/sidebar-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, User, Clock, ArrowRight, Search, Filter, Tag } from "lucide-react"
import Image from "next/image"

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "Masa Depan Pengolahan Air: Teknologi dan Tren yang Muncul",
    excerpt: "Jelajahi inovasi terbaru dalam teknologi pengolahan air dan bagaimana hal tersebut membentuk masa depan industri.",
    content: "Dari sistem monitoring berbasis AI hingga teknologi membran canggih, industri pengolahan air mengalami inovasi yang cepat...",
    author: "Dr. Sarah Chen",
    date: "2024-01-15",
    readTime: "8 menit baca",
    category: "Teknologi",
    image: "/placeholder.jpg",
    tags: ["Inovasi", "Teknologi", "Tren Masa Depan"]
  }

  const blogPosts = [
    {
      id: 2,
      title: "Memahami Reverse Osmosis: Panduan Lengkap",
      excerpt: "Pelajari semua yang perlu Anda ketahui tentang teknologi reverse osmosis dan aplikasinya dalam pengolahan air.",
      author: "Eng. Ahmad Hidayat",
      date: "2024-01-10",
      readTime: "6 menit baca",
      category: "Pendidikan",
      image: "/placeholder.jpg",
      tags: ["RO", "Teknologi", "Panduan"]
    },
    {
      id: 3,
      title: "Standar Kualitas Air di Indonesia: Update 2024",
      excerpt: "Update terbaru tentang regulasi kualitas air Indonesia dan persyaratan kepatuhan untuk bisnis.",
      author: "Dr. Siti Rahayu",
      date: "2024-01-08",
      readTime: "5 menit baca",
      category: "Regulasi",
      image: "/placeholder.jpg",
      tags: ["Regulasi", "Indonesia", "Standar"]
    },
    {
      id: 4,
      title: "Pengolahan Air Berkelanjutan: Manfaat Lingkungan",
      excerpt: "Bagaimana teknologi pengolahan air modern berkontribusi pada keberlanjutan lingkungan dan konservasi sumber daya.",
      author: "Ir. Budi Santoso",
      date: "2024-01-05",
      readTime: "7 menit baca",
      category: "Keberlanjutan",
      image: "/placeholder.jpg",
      tags: ["Keberlanjutan", "Lingkungan", "Teknologi Hijau"]
    },
    {
      id: 5,
      title: "Pengolahan Air Industri: Praktik Terbaik",
      excerpt: "Praktik terbaik yang penting untuk mengimplementasikan sistem pengolahan air yang efektif di fasilitas industri.",
      author: "Eng. Lisa Wong",
      date: "2024-01-03",
      readTime: "9 menit baca",
      category: "Industri",
      image: "/placeholder.jpg",
      tags: ["Industri", "Praktik Terbaik", "Implementasi"]
    },
    {
      id: 6,
      title: "Tips Pemeliharaan untuk Sistem Pengolahan Air",
      excerpt: "Panduan pemeliharaan praktis untuk memastikan performa optimal dan umur panjang solusi teknik air Anda.",
      author: "Tech. Rudi Hermawan",
      date: "2023-12-28",
      readTime: "4 menit baca",
      category: "Pemeliharaan",
      image: "/placeholder.jpg",
      tags: ["Pemeliharaan", "Tips", "Perawatan Peralatan"]
    },
    {
      id: 7,
      title: "Solusi Air Hemat Biaya untuk UKM",
      excerpt: "Opsi pengolahan air yang terjangkau yang disesuaikan untuk usaha kecil dan menengah di Indonesia.",
      author: "Analyst. Maya Dewi",
      date: "2023-12-25",
      readTime: "6 menit baca",
      category: "Bisnis",
      image: "/placeholder.jpg",
      tags: ["UKM", "Hemat Biaya", "Solusi Bisnis"]
    }
  ]

  const categories = [
    { name: "Semua", count: blogPosts.length + 1 },
    { name: "Teknologi", count: 3 },
    { name: "Pendidikan", count: 2 },
    { name: "Regulasi", count: 1 },
    { name: "Keberlanjutan", count: 2 },
    { name: "Industri", count: 2 },
    { name: "Bisnis", count: 1 }
  ]

  const popularTags = [
    "Pengolahan Air", "Sistem RO", "Industri", "Teknologi", "Keberlanjutan",
    "Pemeliharaan", "Regulasi", "Inovasi", "Praktik Terbaik", "Indonesia"
  ]

  return (
    <SidebarLayout
      title="Blog & Artikel"
      description="Wawasan terkini tentang teknologi pengolahan air, tren industri, dan praktik terbaik dari para ahli."
    >
      <div className="space-y-16">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari artikel..."
              className="pl-12 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold">
            Cari
          </Button>
        </div>

        {/* Featured Article */}
        <section>
          <div className="text-center mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Artikel Unggulan
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900">
              Artikel Pilihan
            </h2>
          </div>

          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">
                    {featuredPost.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl w-fit">
                  Baca Artikel Lengkap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </section>

        {/* Blog Grid */}
        <section>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Artikel Terbaru</h2>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-600 text-white text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.date).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button size="lg" variant="outline" className="px-8 py-3 rounded-xl">
                  Muat Artikel Lainnya
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Categories */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900">Kategori</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                      <span className="text-gray-700 hover:text-blue-600 font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900">Tag Populer</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Tetap Terbaru</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Berlangganan newsletter kami untuk wawasan pengolahan air terbaru dan berita industri.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Alamat email Anda" className="border-blue-200" />
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                      Berlangganan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
} 
