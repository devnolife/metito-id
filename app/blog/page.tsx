import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, User, Clock, ArrowRight, Search, Filter, Tag } from "lucide-react"
import Image from "next/image"

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "The Future of Water Treatment: Emerging Technologies and Trends",
    excerpt: "Explore the latest innovations in water treatment technology and how they're shaping the industry's future.",
    content: "From AI-powered monitoring systems to advanced membrane technologies, the water treatment industry is experiencing rapid innovation...",
    author: "Dr. Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Technology",
    image: "/placeholder.jpg",
    tags: ["Innovation", "Technology", "Future Trends"]
  }

  const blogPosts = [
    {
      id: 2,
      title: "Understanding Reverse Osmosis: A Complete Guide",
      excerpt: "Learn everything you need to know about reverse osmosis technology and its applications in water treatment.",
      author: "Eng. Ahmad Hidayat",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Education",
      image: "/placeholder.jpg",
      tags: ["RO", "Technology", "Guide"]
    },
    {
      id: 3,
      title: "Water Quality Standards in Indonesia: 2024 Update",
      excerpt: "Latest updates on Indonesian water quality regulations and compliance requirements for businesses.",
      author: "Dr. Siti Rahayu",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "Regulation",
      image: "/placeholder.jpg",
      tags: ["Regulation", "Indonesia", "Standards"]
    },
    {
      id: 4,
      title: "Sustainable Water Treatment: Environmental Benefits",
      excerpt: "How modern water treatment technologies contribute to environmental sustainability and resource conservation.",
      author: "Ir. Budi Santoso",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Sustainability",
      image: "/placeholder.jpg",
      tags: ["Sustainability", "Environment", "Green Technology"]
    },
    {
      id: 5,
      title: "Industrial Water Treatment: Best Practices",
      excerpt: "Essential best practices for implementing effective water treatment systems in industrial facilities.",
      author: "Eng. Lisa Wong",
      date: "2024-01-03",
      readTime: "9 min read",
      category: "Industrial",
      image: "/placeholder.jpg",
      tags: ["Industrial", "Best Practices", "Implementation"]
    },
    {
      id: 6,
      title: "Maintenance Tips for Water Treatment Systems",
      excerpt: "Practical maintenance guidelines to ensure optimal performance and longevity of your water treatment equipment.",
      author: "Tech. Rudi Hermawan",
      date: "2023-12-28",
      readTime: "4 min read",
      category: "Maintenance",
      image: "/placeholder.jpg",
      tags: ["Maintenance", "Tips", "Equipment Care"]
    },
    {
      id: 7,
      title: "Cost-Effective Water Solutions for SMEs",
      excerpt: "Affordable water treatment options tailored for small and medium enterprises in Indonesia.",
      author: "Analyst. Maya Dewi",
      date: "2023-12-25",
      readTime: "6 min read",
      category: "Business",
      image: "/placeholder.jpg",
      tags: ["SME", "Cost-Effective", "Business Solutions"]
    }
  ]

  const categories = [
    { name: "All", count: blogPosts.length + 1 },
    { name: "Technology", count: 3 },
    { name: "Education", count: 2 },
    { name: "Regulation", count: 1 },
    { name: "Sustainability", count: 2 },
    { name: "Industrial", count: 2 },
    { name: "Business", count: 1 }
  ]

  const popularTags = [
    "Water Treatment", "RO Systems", "Industrial", "Technology", "Sustainability",
    "Maintenance", "Regulation", "Innovation", "Best Practices", "Indonesia"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Knowledge Hub
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Water Treatment
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Insights & News
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest trends, technologies, and best practices in water treatment industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white focus:text-gray-900 rounded-xl"
              />
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Article
            </h2>
          </div>

          <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
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
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl w-fit">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
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
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8 py-3 rounded-xl">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-8">
              {/* Categories */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  <h3 className="text-lg font-bold text-gray-900">Popular Tags</h3>
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Stay Updated</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Subscribe to our newsletter for the latest water treatment insights and industry news.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" className="border-blue-200" />
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
