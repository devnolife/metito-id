"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { Search, Calendar, User, Clock, BookOpen, TrendingUp, Loader2, AlertCircle, FileText } from "lucide-react"
import Image from "next/image"

// Types
interface BlogTag {
  id: string
  name: string
  slug: string
  color?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  authorName: string
  authorEmail?: string
  isPublished: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  tags: BlogTag[]
}

interface Category {
  name: string
  count: number
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [pagination, setPagination] = useState<PaginationData | null>(null)

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min`
  }

  // Load blog posts from API
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const queryParams = new URLSearchParams({
          page: '1',
          limit: '20'
        })

        if (searchQuery) {
          queryParams.append('search', searchQuery)
        }

        const response = await fetch(`/api/blog?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }

        const data = await response.json()

        if (data.success) {
          const blogPosts = data.data.posts || []
          setPosts(blogPosts)
          setPagination(data.data.pagination)

          // Generate categories dari data yang ada
          const categoryCount: Record<string, number> = { 'Semua': blogPosts.length }
          const tagCounts: Record<string, number> = {}

          blogPosts.forEach((post: BlogPost) => {
            // Count categories from tags
            post.tags.forEach((tag: BlogTag) => {
              categoryCount[tag.name] = (categoryCount[tag.name] || 0) + 1
              tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1
            })
          })

          const generatedCategories: Category[] = Object.entries(categoryCount).map(([name, count]) => ({
            name,
            count
          }))

          setCategories(generatedCategories)

          // Set popular tags (top 10 most used)
          const sortedTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([name]) => name)

          setPopularTags(sortedTags)
        } else {
          throw new Error(data.message || 'Failed to load blog posts')
        }

      } catch (error) {
        console.error('Error loading blog posts:', error)
        setError('Gagal memuat artikel blog. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [searchQuery])

  // Filter data
  const featuredPosts = posts.filter(post => post.isFeatured)
  const recentPosts = posts.slice(0, 3)

  // Handle search input
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('search') as string
    setSearchQuery(query)
  }

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
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold">
              Baca Artikel Terbaru
            </Button>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold">
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

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="animate-pulse overflow-hidden">
                        <div className="aspect-[16/9] bg-gray-200"></div>
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
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-semibold text-gray-600 mb-2">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                      Coba Lagi
                    </Button>
                  </div>
                ) : featuredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-600">Belum ada artikel unggulan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                        <div className="aspect-[16/9] relative">
                          <Image
                            src={post.coverImage || '/images/blog/default-blog.jpg'}
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
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{calculateReadTime(post.content)}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {post.excerpt || post.content.substring(0, 150) + '...'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{post.authorName}</span>
                            </div>
                            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl">
                              Baca Selengkapnya
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* All Posts */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Semua Artikel</h2>
                {loading ? (
                  <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[16/9] md:aspect-auto bg-gray-200"></div>
                          <CardContent className="md:w-2/3 p-6 space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-600">Belum ada artikel</p>
                    <p className="text-gray-500">Artikel akan ditampilkan di sini setelah dipublikasikan</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                            <Image
                              src={post.coverImage || '/images/blog/default-blog.jpg'}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="md:w-2/3 p-6">
                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 flex-wrap">
                              <div className="flex items-center gap-2">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag.id} variant="outline" className="text-blue-600 border-blue-200">
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{calculateReadTime(post.content)}</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {post.excerpt || post.content.substring(0, 200) + '...'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{post.authorName}</span>
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
                )}
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
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="search"
                        placeholder="Cari artikel..."
                        className="pl-10 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue={searchQuery}
                      />
                    </form>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Kategori
                    </h3>
                    {loading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCategory === category.name
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            onClick={() => setSelectedCategory(category.name)}
                          >
                            <span className="font-medium">
                              {category.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Tag Populer
                    </h3>
                    {loading ? (
                      <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Artikel Terbaru
                    </h3>
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <div key={post.id} className="group cursor-pointer">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              Berlangganan Newsletter
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white px-8 py-3 rounded-xl font-semibold transition-all">
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
