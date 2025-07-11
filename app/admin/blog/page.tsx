"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Eye, Calendar, Tag, User } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  featuredImage: string
  publishedDate: string
  status: "published" | "draft"
  seoTitle: string
  seoDescription: string
  readTime: number
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Teknologi Terbaru dalam Pengolahan Air",
      content: "Artikel tentang inovasi terbaru dalam teknologi pengolahan air yang ramah lingkungan dan efisien...",
      excerpt: "Mengenal berbagai teknologi mutakhir untuk pengolahan air yang berkelanjutan",
      category: "Teknologi",
      tags: ["teknologi", "pengolahan air", "inovasi"],
      author: "Admin",
      featuredImage: "/images/blog/water-technology.jpg",
      publishedDate: "2024-01-15",
      status: "published",
      seoTitle: "Teknologi Terbaru dalam Pengolahan Air | Metito",
      seoDescription: "Pelajari teknologi terbaru dalam pengolahan air yang ramah lingkungan dan efisien dari Metito Indonesia",
      readTime: 5
    },
    {
      id: 2,
      title: "Tips Perawatan Sistem Water Treatment",
      content: "Panduan lengkap untuk merawat sistem water treatment agar tetap optimal dan tahan lama...",
      excerpt: "Panduan praktis perawatan sistem water treatment untuk performa optimal",
      category: "Panduan",
      tags: ["perawatan", "water treatment", "maintenance"],
      author: "Admin",
      featuredImage: "/images/blog/maintenance-guide.jpg",
      publishedDate: "2024-01-10",
      status: "draft",
      seoTitle: "Tips Perawatan Sistem Water Treatment | Metito",
      seoDescription: "Pelajari cara merawat sistem water treatment dengan tips dari ahli Metito Indonesia",
      readTime: 7
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    author: "",
    featuredImage: "",
    status: "published" as "published" | "draft",
    seoTitle: "",
    seoDescription: "",
    readTime: 5
  })

  const categories = ["Teknologi", "Panduan", "Berita", "Tips", "Industri"]

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddPost = () => {
    const newPost: BlogPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      author: formData.author,
      featuredImage: formData.featuredImage || "/placeholder.svg?height=200&width=300",
      publishedDate: new Date().toISOString().split("T")[0],
      status: formData.status,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      readTime: formData.readTime
    }
    setPosts([...posts, newPost])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditPost = () => {
    if (!editingPost) return

    const updatedPost: BlogPost = {
      ...editingPost,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      author: formData.author,
      featuredImage: formData.featuredImage || "/placeholder.svg?height=200&width=300",
      status: formData.status,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      readTime: formData.readTime
    }

    setPosts(posts.map((post) => (post.id === editingPost.id ? updatedPost : post)))
    setIsEditDialogOpen(false)
    setEditingPost(null)
    resetForm()
  }

  const handleDeletePost = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel blog ini?")) {
      setPosts(posts.filter((post) => post.id !== id))
    }
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(", "),
      author: post.author,
      featuredImage: post.featuredImage,
      status: post.status,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      readTime: post.readTime
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      author: "",
      featuredImage: "",
      status: "published",
      seoTitle: "",
      seoDescription: "",
      readTime: 5
    })
  }

  const BlogForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Judul Artikel</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Masukkan judul artikel"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Ringkasan singkat artikel"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="content">Konten Artikel</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Tulis konten artikel lengkap"
          rows={8}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="author">Penulis</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Nama penulis"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="teknologi, air, inovasi"
        />
      </div>

      <div>
        <Label htmlFor="featuredImage">Gambar Utama</Label>
        <Input
          id="featuredImage"
          value={formData.featuredImage}
          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          placeholder="URL gambar utama"
        />
      </div>

      <div>
        <Label htmlFor="readTime">Waktu Baca (menit)</Label>
        <Input
          id="readTime"
          type="number"
          value={formData.readTime}
          onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
          placeholder="5"
        />
      </div>

      <div>
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          value={formData.seoTitle}
          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
          placeholder="Judul untuk SEO"
        />
      </div>

      <div>
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea
          id="seoDescription"
          value={formData.seoDescription}
          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
          placeholder="Deskripsi untuk SEO"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="published">Diterbitkan</option>
          <option value="draft">Draf</option>
        </select>
      </div>

      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
        {submitLabel}
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Manajemen Blog</h1>
        <p className="text-gray-600">Kelola artikel dan konten blog</p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Blog Management</h2>
              <p className="text-gray-600">Kelola artikel dan konten blog perusahaan</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Artikel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Artikel Blog Baru</DialogTitle>
                  <DialogDescription>
                    Buat artikel blog baru untuk ditampilkan di website. Pastikan semua field yang wajib diisi telah terisi dengan benar.
                  </DialogDescription>
                </DialogHeader>
                <BlogForm onSubmit={handleAddPost} submitLabel="Tambah Artikel" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari artikel, kategori, atau tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Diterbitkan" : "Draf"}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.readTime} min</span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{post.category}</span>
                      <User className="w-3 h-3 text-gray-400 ml-2" />
                      <span className="text-xs text-gray-500">{post.author}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{post.publishedDate}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Artikel Blog</DialogTitle>
                <DialogDescription>
                  Ubah informasi artikel blog. Pastikan semua field yang wajib diisi telah terisi dengan benar.
                </DialogDescription>
              </DialogHeader>
              <BlogForm onSubmit={handleEditPost} submitLabel="Simpan Perubahan" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

