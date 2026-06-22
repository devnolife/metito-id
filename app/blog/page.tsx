"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-[var(--lime)]/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Blog &amp; Insights
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Wawasan Industri{" "}
            <span className="text-[var(--lime-bright)]">Pengolahan Air</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dapatkan insight terdepan, tips praktis, dan berita terbaru dari dunia teknologi pengolahan air.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Baca Artikel Terbaru
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <BookOpen className="w-4 h-4 mr-2" />
              Panduan Lengkap
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              <div className="mb-16">
                <Reveal className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-5 h-5 text-[var(--navy)]" />
                  <h2 className="font-display text-2xl font-bold text-[var(--navy)]">Artikel Unggulan</h2>
                </Reveal>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="animate-pulse overflow-hidden rounded-[1.25rem] border border-[#dce9ff]">
                        <div className="aspect-[16/9] bg-[#e5eeff]"></div>
                        <CardContent className="p-6 space-y-3">
                          <div className="h-4 bg-[#e5eeff] rounded-full"></div>
                          <div className="h-3 bg-[#eff4ff] rounded-full w-3/4"></div>
                          <div className="h-3 bg-[#eff4ff] rounded-full w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-semibold text-slate-600 mb-2">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full px-7">
                      Coba Lagi
                    </Button>
                  </div>
                ) : featuredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-semibold text-slate-600">Belum ada artikel unggulan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredPosts.map((post, i) => (
                      <Reveal key={post.id} delay={i % 2}>
                        <Card className="group h-full overflow-hidden rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                          <div className="aspect-[16/9] relative overflow-hidden">
                            <Image
                              src={post.coverImage || '/images/blog/default-blog.jpg'}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-[var(--lime)] text-[var(--navy)] font-semibold">
                                Unggulan
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{calculateReadTime(post.content)}</span>
                              </div>
                            </div>
                            <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-3 leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                              {post.excerpt || post.content.substring(0, 150) + '...'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-600">{post.authorName}</span>
                              </div>
                              <Button size="sm" className="bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)] rounded-full">
                                Baca Selengkapnya
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>

              {/* All Posts */}
              <div className="mb-8">
                <Reveal><h2 className="font-display text-2xl font-bold text-[var(--navy)] mb-8">Semua Artikel</h2></Reveal>
                {loading ? (
                  <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse overflow-hidden rounded-[1.25rem] border border-[#dce9ff]">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[16/9] md:aspect-auto bg-[#e5eeff]"></div>
                          <CardContent className="md:w-2/3 p-6 space-y-3">
                            <div className="h-4 bg-[#e5eeff] rounded-full"></div>
                            <div className="h-3 bg-[#eff4ff] rounded-full w-3/4"></div>
                            <div className="h-3 bg-[#eff4ff] rounded-full w-1/2"></div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-semibold text-slate-600">Belum ada artikel</p>
                    <p className="text-slate-500">Artikel akan ditampilkan di sini setelah dipublikasikan</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {posts.map((post, i) => (
                      <Reveal key={post.id} delay={i % 3}>
                        <Card className="group overflow-hidden rounded-[1.25rem] bg-white border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative overflow-hidden">
                              <Image
                                src={post.coverImage || '/images/blog/default-blog.jpg'}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <CardContent className="md:w-2/3 p-6">
                              <div className="flex items-center gap-4 mb-3 text-sm text-slate-500 flex-wrap">
                                <div className="flex items-center gap-2">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag.id} variant="outline" className="text-[var(--navy)] border-[#dce9ff]">
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
                              <h3 className="font-display font-bold text-xl text-[var(--navy)] mb-3 leading-tight">
                                {post.title}
                              </h3>
                              <p className="text-slate-500 mb-4 leading-relaxed">
                                {post.excerpt || post.content.substring(0, 200) + '...'}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-600">{post.authorName}</span>
                                </div>
                                <Button size="sm" className="bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white rounded-full">
                                  Baca Artikel
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Search */}
                <Card className="rounded-[1.25rem] border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)]">
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-4">
                      Cari Artikel
                    </h3>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        name="search"
                        placeholder="Cari artikel..."
                        className="pl-10 border-[#dce9ff] rounded-xl focus:ring-2 focus:ring-[var(--navy)] focus:border-transparent"
                        defaultValue={searchQuery}
                      />
                    </form>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="rounded-[1.25rem] border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)]">
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-4">
                      Kategori
                    </h3>
                    {loading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-8 bg-[#eff4ff] rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCategory === category.name
                              ? 'bg-[var(--lime)]/15 text-[var(--navy)]'
                              : 'hover:bg-[#f8f9ff] hover:text-[var(--navy)]'
                              }`}
                            onClick={() => setSelectedCategory(category.name)}
                          >
                            <span className="font-medium">
                              {category.name}
                            </span>
                            <Badge variant="secondary" className="text-xs bg-[#eff4ff] text-slate-600">
                              {category.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="rounded-[1.25rem] border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)]">
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-4">
                      Tag Populer
                    </h3>
                    {loading ? (
                      <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-6 w-16 bg-[#eff4ff] rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer border-[#dce9ff] text-slate-600 hover:bg-[var(--navy)] hover:border-[var(--navy)] hover:text-white transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="rounded-[1.25rem] border border-[#dce9ff] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)]">
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-lg text-[var(--navy)] mb-4">
                      Artikel Terbaru
                    </h3>
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 bg-[#eff4ff] rounded animate-pulse"></div>
                            <div className="h-3 bg-[#eff4ff] rounded w-1/2 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <div key={post.id} className="group cursor-pointer">
                            <h4 className="font-medium text-[var(--navy)] group-hover:text-[var(--lime-dim)] transition-colors mb-2 leading-snug">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
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
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/92 to-[var(--navy)]/70" />
        <Reveal className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Newsletter
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Ingin Mendapatkan Update Terbaru?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Berlangganan newsletter kami untuk mendapatkan artikel terbaru, tips praktis, dan insight industri langsung di inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Berlangganan Newsletter
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <BookOpen className="w-5 h-5 mr-2" />
              Download E-Book Gratis
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
