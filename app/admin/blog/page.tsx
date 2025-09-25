"use client"

import React, { useState, useCallback, memo, useEffect, useRef } from "react"
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

// Form state shape extracted so BlogForm can live outside main component
type BlogFormState = {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string
  author: string
  featuredImage: string
  status: "published" | "draft"
  seoTitle: string
  seoDescription: string
  readTime: number
}

interface BlogFormProps {
  form: BlogFormState
  categories: string[]
  onChange: (patch: Partial<BlogFormState>) => void
  onSubmit: () => void
  submitLabel: string
  errors?: Record<string, string[]>
}

const BlogForm = memo(function BlogForm({ form, categories, onChange, onSubmit, submitLabel, errors }: BlogFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Judul Artikel</Label>
        <Input id="title" value={form.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Masukkan judul artikel" />
        {errors?.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
      </div>
      <div>
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea id="excerpt" value={form.excerpt} onChange={(e) => onChange({ excerpt: e.target.value })} rows={2} placeholder="Ringkasan singkat artikel" />
      </div>
      <div>
        <Label htmlFor="content">Konten Artikel</Label>
        <Textarea id="content" value={form.content} onChange={(e) => onChange({ content: e.target.value })} rows={8} placeholder="Tulis konten artikel lengkap" />
        {errors?.content && <p className="mt-1 text-xs text-red-500">{errors.content[0]}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select id="category" value={form.category} onChange={(e) => onChange({ category: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Pilih kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="author">Penulis</Label>
          <Input id="author" value={form.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Nama penulis" />
          {errors?.author && <p className="mt-1 text-xs text-red-500">{errors.author[0]}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
        <Input id="tags" value={form.tags} onChange={(e) => onChange({ tags: e.target.value })} placeholder="teknologi, air, inovasi" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="featuredImage">Gambar Utama</Label>
        {form.featuredImage && (
          <div className="w-full aspect-video rounded border overflow-hidden flex items-center justify-center bg-gray-50">
            <img src={form.featuredImage} alt="Featured" className="object-cover w-full h-full" />
          </div>
        )}
        <input
          id="featuredFile"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onChange({ featuredImage: `FILE_OBJECT:${file.name}` } as any)
              // file object marker; real upload handled in parent before submit
              ;(onChange as any)({ __localFile: file })
            }
          }}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500">Pilih gambar dari komputer Anda. Maks 10MB.</p>
      </div>
      <div>
        <Label htmlFor="readTime">Waktu Baca (menit)</Label>
        <Input id="readTime" type="number" value={form.readTime} onChange={(e) => onChange({ readTime: parseInt(e.target.value) || 5 })} placeholder="5" />
      </div>
      <div>
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input id="seoTitle" value={form.seoTitle} onChange={(e) => onChange({ seoTitle: e.target.value })} placeholder="Judul untuk SEO" />
      </div>
      <div>
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea id="seoDescription" value={form.seoDescription} onChange={(e) => onChange({ seoDescription: e.target.value })} rows={2} placeholder="Deskripsi untuk SEO" />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select id="status" value={form.status} onChange={(e) => onChange({ status: e.target.value as any })} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="published">Diterbitkan</option>
          <option value="draft">Draf</option>
        </select>
      </div>
      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700">{submitLabel}</Button>
    </div>
  )
})
BlogForm.displayName = 'BlogForm'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const localFileRef = useRef<File | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<BlogFormState>({
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

  async function fetchPosts() {
    setLoadingPosts(true)
    try {
      const res = await fetch('/api/blog?limit=100')
      const json = await res.json()
      if (json.success) {
        const mapped: BlogPost[] = json.data.posts.map((p: any) => ({
          id: p.id,
          title: p.title,
            content: p.content,
            excerpt: p.excerpt || '',
            category: p.tags?.[0]?.name || '',
            tags: p.tags?.map((t: any) => t.name) || [],
            author: p.authorName || 'Admin',
            featuredImage: p.coverImage || '',
            publishedDate: p.createdAt.split('T')[0],
            status: p.isPublished ? 'published' : 'draft',
            seoTitle: p.metaTitle || '',
            seoDescription: p.metaDescription || '',
            readTime: Math.max(1, Math.round(p.content.split(/\s+/).length / 200))
        }))
        setPosts(mapped)
      }
    } catch (e) {
      console.error('Failed fetch posts', e)
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  async function uploadFeaturedIfNeeded(): Promise<string | undefined> {
    if (!localFileRef.current) return formData.featuredImage || undefined
    try {
      setUploadingImage(true)
      const fd = new FormData()
      fd.append('file', localFileRef.current)
      fd.append('category', 'blog')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) {
        return json.data.filePath
      } else {
        console.error('Upload failed', json.message)
      }
    } catch (e) {
      console.error('Upload error', e)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddPost = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    const imagePath = await uploadFeaturedIfNeeded()
    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      coverImage: imagePath,
      authorName: formData.author || 'Admin',
      isPublished: formData.status === 'published',
      metaTitle: formData.seoTitle || undefined,
      metaDescription: formData.seoDescription || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json()
    if (json.success) {
      setIsAddDialogOpen(false)
      resetForm()
      localFileRef.current = null
      fetchPosts()
    } else {
      if (res.status === 422 && json.errors) {
        setFormErrors(json.errors)
      } else {
        alert(json.message || 'Gagal menyimpan artikel')
      }
    }
    setSubmitting(false)
  }

  const handleEditPost = async () => {
    if (!editingPost) return
    if (!validateForm()) return
    setSubmitting(true)
    const imagePath = await uploadFeaturedIfNeeded()
    const payload: any = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      coverImage: imagePath,
      authorName: formData.author,
      isPublished: formData.status === 'published',
      metaTitle: formData.seoTitle || undefined,
      metaDescription: formData.seoDescription || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    const res = await fetch(`/api/blog/${editingPost.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json()
    if (json.success) {
      setIsEditDialogOpen(false)
      setEditingPost(null)
      resetForm()
      localFileRef.current = null
      fetchPosts()
    } else {
      if (res.status === 422 && json.errors) {
        setFormErrors(json.errors)
      } else {
        alert(json.message || 'Gagal memperbarui artikel')
      }
    }
    setSubmitting(false)
  }

  const handleDeletePost = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel blog ini?')) return
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      fetchPosts()
    } else {
      alert(json.message || 'Gagal menghapus artikel')
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

  // (BlogForm moved outside component to keep stable identity & prevent caret resets)

  const handleFormPatch = useCallback((patch: Partial<typeof formData> & { __localFile?: File }) => {
    if (patch.__localFile) {
      localFileRef.current = patch.__localFile
      // create object URL for preview
      const url = URL.createObjectURL(patch.__localFile)
      setFormData(prev => ({ ...prev, featuredImage: url }))
      return
    }
    setFormData(prev => ({ ...prev, ...patch }))
  }, [])

  function validateForm(): boolean {
    const errs: Record<string, string[]> = {}
    if (!formData.title || formData.title.trim().length < 5) {
      errs.title = ['Judul minimal 5 karakter']
    }
    if (!formData.content || formData.content.trim().length < 50) {
      errs.content = ['Konten minimal 50 karakter']
    }
    if (!formData.author || formData.author.trim().length < 2) {
      errs.author = ['Nama penulis minimal 2 karakter']
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  function renderFieldError(name: string) {
    if (!formErrors[name]) return null
    return <p className="mt-1 text-xs text-red-500">{formErrors[name][0]}</p>
  }

  return (
    <div className="flex flex-col h-full">

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
                <BlogForm errors={formErrors} form={formData} categories={categories} onChange={(p)=>{ if (formErrors[Object.keys(p)[0] as string]) setFormErrors(prev=>{ const copy={...prev}; delete copy[Object.keys(p)[0] as string]; return copy }) ; handleFormPatch(p) }} onSubmit={handleAddPost} submitLabel={submitting ? "Menyimpan..." : "Tambah Artikel"} />
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
            {loadingPosts && <div className="col-span-full text-center text-sm text-gray-500">Memuat artikel...</div>}
            {!loadingPosts && filteredPosts.map((post) => (
              <Card key={post.id as any} className="hover:shadow-lg transition-shadow">
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
              <BlogForm errors={formErrors} form={formData} categories={categories} onChange={(p)=>{ if (formErrors[Object.keys(p)[0] as string]) setFormErrors(prev=>{ const copy={...prev}; delete copy[Object.keys(p)[0] as string]; return copy }) ; handleFormPatch(p) }} onSubmit={handleEditPost} submitLabel={submitting ? "Menyimpan..." : "Simpan Perubahan"} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

