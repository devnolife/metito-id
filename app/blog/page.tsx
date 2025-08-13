import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { Search, Calendar, User, Tag, Clock, BookOpen, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Teknologi Reverse Osmosis: Revolusi dalam Pengolahan Air",
      excerpt: "Pelajari bagaimana teknologi reverse osmosis mengubah cara kita memproses air dan mengapa menjadi standar emas dalam industri pengolahan air.",
      content: "Teknologi reverse osmosis (RO) telah menjadi salah satu metode paling efektif untuk mengolah air. Sistem ini menggunakan membran semi-permeabel untuk memisahkan kontaminan dari air...",
      author: "Dr. Ahmad Santoso",
      date: "2024-01-15",
      category: "Teknologi",
      tags: ["Reverse Osmosis", "Water Treatment", "Technology"],
      image: "/images/blog/ro-technology.jpg",
      readTime: "5 min",
      featured: true
    },
    {
      id: 2,
      title: "Panduan Lengkap Pemeliharaan Sistem Pengolahan Air Industri",
      excerpt: "Tips praktis untuk menjaga sistem pengolahan air industri agar tetap berfungsi optimal dan meminimalkan downtime.",
      content: "Pemeliharaan sistem pengolahan air industri adalah kunci untuk memastikan operasi yang efisien dan berkelanjutan...",
      author: "Ir. Siti Nurhaliza",
      date: "2024-01-10",
      category: "Maintenance",
      tags: ["Maintenance", "Industrial", "Best Practices"],
      image: "/images/blog/maintenance-guide.jpg",
      readTime: "7 min",
      featured: false
    },
    {
      id: 3,
      title: "Tantangan dan Solusi Pengolahan Air Limbah di Era Modern",
      excerpt: "Menghadapi tantangan pengolahan air limbah dengan teknologi terkini dan pendekatan berkelanjutan.",
      content: "Pengolahan air limbah menjadi semakin penting dalam era industrialisasi modern. Dengan meningkatnya regulasi lingkungan...",
      author: "Bapak Wijaya",
      date: "2024-01-05",
      category: "Environment",
      tags: ["Wastewater", "Environment", "Sustainability"],
      image: "/images/blog/wastewater-treatment.jpg",
      readTime: "6 min",
      featured: true
    },
    {
      id: 4,
      title: "Inovasi Smart Water Management untuk Kota Berkelanjutan",
      excerpt: "Bagaimana teknologi IoT dan AI mengubah cara kita mengelola sistem air kota untuk masa depan yang lebih berkelanjutan.",
      content: "Smart water management mengintegrasikan teknologi digital untuk mengoptimalkan penggunaan dan distribusi air...",
      author: "Dr. Made Sutrisno",
      date: "2023-12-28",
      category: "Smart Technology",
      tags: ["Smart City", "IoT", "Water Management"],
      image: "/images/blog/smart-water.jpg",
      readTime: "8 min",
      featured: false
    },
    {
      id: 5,
      title: "Ekonomi Sirkular dalam Industri Pengolahan Air",
      excerpt: "Menerapkan prinsip ekonomi sirkular untuk menciptakan sistem pengolahan air yang lebih efisien dan berkelanjutan.",
      content: "Ekonomi sirkular memberikan pendekatan baru dalam mengelola sumber daya air dengan prinsip reduce, reuse, dan recycle...",
      author: "Ibu Dewi Sartika",
      date: "2023-12-20",
      category: "Sustainability",
      tags: ["Circular Economy", "Sustainability", "Innovation"],
      image: "/images/blog/circular-economy.jpg",
      readTime: "9 min",
      featured: false
    },
    {
      id: 6,
      title: "Regulasi Baru Kualitas Air: Yang Perlu Diketahui Industri",
      excerpt: "Panduan lengkap tentang regulasi terbaru kualitas air dan dampaknya terhadap industri pengolahan air.",
      content: "Regulasi kualitas air terus berkembang untuk melindungi kesehatan masyarakat dan lingkungan...",
      author: "Pak Hendri Kurniawan",
      date: "2023-12-15",
      category: "Regulation",
      tags: ["Regulation", "Compliance", "Industry"],
      image: "/images/blog/water-regulation.jpg",
      readTime: "4 min",
      featured: false
    }
  ]

  const categories = [
    { name: "Semua", count: posts.length },
    { name: "Teknologi", count: posts.filter(p => p.category === "Teknologi").length },
    { name: "Maintenance", count: posts.filter(p => p.category === "Maintenance").length },
    { name: "Environment", count: posts.filter(p => p.category === "Environment").length },
    { name: "Smart Technology", count: posts.filter(p => p.category === "Smart Technology").length },
    { name: "Sustainability", count: posts.filter(p => p.category === "Sustainability").length },
    { name: "Regulation", count: posts.filter(p => p.category === "Regulation").length }
  ]

  const popularTags = [
    "Reverse Osmosis", "Water Treatment", "Technology", "Maintenance", "Industrial",
    "Environment", "Sustainability", "Smart City", "IoT", "Regulation"
  ]

  const featuredPosts = posts.filter(post => post.featured)
  const recentPosts = posts.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Blog & Insights
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Wawasan Industri
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Pengolahan Air
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dapatkan insight terdepan, tips praktis, dan berita terbaru dari dunia teknologi pengolahan air.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Baca Artikel Terbaru
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              <BookOpen className="w-4 h-4 mr-2" />
              Panduan Lengkap
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Artikel Unggulan</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                      <div className="aspect-[16/9] relative">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600 text-white">
                            Unggulan
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{post.author}</span>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-xl">
                            Baca Selengkapnya
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Posts */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Semua Artikel</h2>
                <div className="space-y-8">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="md:w-2/3 p-6">
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              {post.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.date).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{post.author}</span>
                            </div>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                              Baca Artikel
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Search */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Cari Artikel
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari artikel..."
                        className="pl-10 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Kategori
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <span className="text-gray-700 hover:text-blue-600 font-medium">
                            {category.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Tag Populer
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Artikel Terbaru
                    </h3>
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.date).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ingin Mendapatkan Update Terbaru?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Berlangganan newsletter kami untuk mendapatkan artikel terbaru, tips praktis, dan insight industri langsung di inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Berlangganan Newsletter
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <BookOpen className="w-5 h-5 mr-2" />
              Download E-Book Gratis
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
