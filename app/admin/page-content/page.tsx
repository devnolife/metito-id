"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { FileText, Edit, Trash2, Plus, Search, Upload, X } from "lucide-react"
import Image from "next/image"

interface PageContent {
  id: string
  page: string
  section: string
  key: string
  title?: string
  subtitle?: string
  description?: string
  content?: any
  imageUrl?: string
  link?: string
  icon?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPageContentPage() {
  const [contents, setContents] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPage, setFilterPage] = useState<string>("all")
  const [filterSection, setFilterSection] = useState<string>("all")
  const [searchKey, setSearchKey] = useState<string>("")
  const [editDialog, setEditDialog] = useState<{ open: boolean; content: PageContent | null }>({
    open: false,
    content: null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const { toast } = useToast()

  const fetchContents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterPage !== "all") params.append("page", filterPage)
      if (filterSection !== "all") params.append("section", filterSection)

      const response = await fetch(`/api/page-content?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContents(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [filterPage, filterSection])

  const handleEdit = (content: PageContent) => {
    setEditDialog({ open: true, content })
    setUploadedImageUrl(content.imageUrl || "")
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran gambar maksimal 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'gallery') // Use gallery type for page content images

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedImageUrl(data.data.url)
        toast({
          title: "Berhasil",
          description: "Gambar berhasil diupload",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal upload gambar",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editDialog.content) return

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string || undefined,
      subtitle: formData.get("subtitle") as string || undefined,
      description: formData.get("description") as string || undefined,
      imageUrl: uploadedImageUrl || undefined,
      link: formData.get("link") as string || undefined,
      icon: formData.get("icon") as string || undefined,
      order: parseInt(formData.get("order") as string) || 0,
      isActive: formData.get("isActive") === "on",
    }

    try {
      const response = await fetch(`/api/page-content/${editDialog.content.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Konten berhasil diupdate",
        })
        setEditDialog({ open: false, content: null })
        fetchContents()
      } else {
        throw new Error("Failed to update")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate konten",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus konten ini?")) return

    try {
      const response = await fetch(`/api/page-content/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Konten berhasil dihapus",
        })
        fetchContents()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus konten",
        variant: "destructive",
      })
    }
  }

  const pages = Array.from(new Set(contents.map(c => c.page)))
  const sections = filterPage === "all"
    ? Array.from(new Set(contents.map(c => c.section)))
    : Array.from(new Set(contents.filter(c => c.page === filterPage).map(c => c.section)))

  const filteredContents = contents.filter(c => {
    if (filterPage !== "all" && c.page !== filterPage) return false
    if (filterSection !== "all" && c.section !== filterSection) return false
    if (searchKey && !c.key.toLowerCase().includes(searchKey.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Manajemen Konten Halaman
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola semua konten halaman website dari sini
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Halaman</Label>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaman</SelectItem>
                  {pages.map(page => (
                    <SelectItem key={page} value={page}>{page}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Seksi</Label>
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Seksi</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Cari Key</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Cari berdasarkan key..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {filteredContents.map((content) => (
            <Card key={content.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <span className="text-sm text-gray-500">{content.page} / {content.section} / </span>
                      {content.key}
                    </CardTitle>
                    {content.title && (
                      <p className="text-sm text-gray-600 mt-1">{content.title}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {content.subtitle && (
                    <div>
                      <span className="text-gray-500">Subtitle:</span>
                      <p className="font-medium">{content.subtitle}</p>
                    </div>
                  )}
                  {content.description && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Description:</span>
                      <p className="font-medium line-clamp-2">{content.description}</p>
                    </div>
                  )}
                  {content.icon && (
                    <div>
                      <span className="text-gray-500">Icon:</span>
                      <p className="font-medium">{content.icon}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Order:</span>
                    <p className="font-medium">{content.order}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className={`font-medium ${content.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {content.isActive ? 'Aktif' : 'Nonaktif'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, content: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Konten</DialogTitle>
          </DialogHeader>
          {editDialog.content && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                {editDialog.content.page} / {editDialog.content.section} / {editDialog.content.key}
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editDialog.content.title || ""}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editDialog.content.subtitle || ""}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editDialog.content.description || ""}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Gambar</Label>

                {/* Image Preview */}
                {uploadedImageUrl && (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={uploadedImageUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImageUrl("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {uploading ? "Uploading..." : uploadedImageUrl ? "Ganti Gambar" : "Upload Gambar"}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Manual URL Input */}
                <div>
                  <Label htmlFor="imageUrl" className="text-xs text-gray-500">Atau masukkan URL manual:</Label>
                  <Input
                    id="imageUrl"
                    value={uploadedImageUrl}
                    onChange={(e) => setUploadedImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  name="link"
                  defaultValue={editDialog.content.link || ""}
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editDialog.content.icon || ""}
                  placeholder="e.g., MapPin, Phone, Mail"
                />
              </div>

              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={editDialog.content.order}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={editDialog.content.isActive}
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialog({ open: false, content: null })}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
