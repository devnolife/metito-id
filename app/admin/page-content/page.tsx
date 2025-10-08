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
import {
  FileText, Edit, Trash2, Plus, Search, Upload, X,
  Home, Layout, Phone, MapPin, Mail, Globe,
  Info, Eye, AlertCircle
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  // Group contents by page and section
  const groupedContents = filteredContents.reduce((acc, content) => {
    const pageKey = content.page
    const sectionKey = content.section

    if (!acc[pageKey]) {
      acc[pageKey] = {}
    }
    if (!acc[pageKey][sectionKey]) {
      acc[pageKey][sectionKey] = []
    }
    acc[pageKey][sectionKey].push(content)
    return acc
  }, {} as Record<string, Record<string, PageContent[]>>)

  // Section info mapping untuk memberikan context
  const sectionInfo: Record<string, { label: string; description: string; icon: any; color: string }> = {
    hero: { label: "Hero Section", description: "Banner utama di halaman depan", icon: Home, color: "bg-blue-50 text-blue-600" },
    stats: { label: "Statistik", description: "Angka pencapaian perusahaan", icon: Info, color: "bg-green-50 text-green-600" },
    services: { label: "Layanan", description: "Daftar layanan yang ditawarkan", icon: Layout, color: "bg-purple-50 text-purple-600" },
    contact_info: { label: "Info Kontak", description: "Informasi kontak perusahaan (footer, contact page)", icon: Phone, color: "bg-orange-50 text-orange-600" },
    about: { label: "Tentang Kami", description: "Informasi tentang perusahaan", icon: Info, color: "bg-teal-50 text-teal-600" },
    footer: { label: "Footer", description: "Konten di bagian footer website", icon: Layout, color: "bg-gray-50 text-gray-600" },
    contact: { label: "Kontak", description: "Form dan info kontak", icon: Mail, color: "bg-pink-50 text-pink-600" },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Layout className="w-8 h-8" />
          Konten Halaman Website
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola semua konten halaman website. Perubahan akan langsung terlihat di halaman publik.
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Tips Mengedit Konten:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Setiap section di bawah mewakili bagian visual di website</li>
              <li>Preview menunjukkan dimana konten akan muncul</li>
              <li>Order menentukan urutan tampilan (angka kecil = muncul lebih dulu)</li>
            </ul>
          </div>
        </div>
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

      {/* Content List - Grouped by Page and Section */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <Tabs defaultValue={Object.keys(groupedContents)[0]} className="space-y-6">
          <TabsList>
            {Object.keys(groupedContents).map(page => (
              <TabsTrigger key={page} value={page} className="capitalize">
                {page === 'home' && <Home className="w-4 h-4 mr-2" />}
                {page === 'footer' && <Layout className="w-4 h-4 mr-2" />}
                {page === 'contact' && <Phone className="w-4 h-4 mr-2" />}
                {page}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedContents).map(([page, sections]) => (
            <TabsContent key={page} value={page} className="space-y-8">
              {Object.entries(sections).map(([section, items]) => {
                const info = sectionInfo[section] || {
                  label: section,
                  description: `Konten untuk section ${section}`,
                  icon: FileText,
                  color: "bg-gray-50 text-gray-600"
                }
                const Icon = info.icon

                return (
                  <div key={section} className="space-y-4">
                    {/* Section Header */}
                    <div className={`p-4 rounded-lg ${info.color} border`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{info.label}</h3>
                          <p className="text-sm opacity-80">{info.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {items.length} item{items.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Items */}
                    <div className="grid gap-4">
                      {items.sort((a, b) => a.order - b.order).map((content) => (
                        <Card key={content.id} className="overflow-hidden">
                          <div className="flex">
                            {/* Preview/Visual indicator */}
                            <div className="w-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center border-r">
                              {content.imageUrl ? (
                                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                  <Image
                                    src={content.imageUrl}
                                    alt={content.title || content.key}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : content.icon ? (
                                <div className="text-center">
                                  <div className="w-16 h-16 mx-auto bg-white rounded-lg flex items-center justify-center shadow-sm mb-2">
                                    <span className="text-2xl">{content.icon}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">Icon</p>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400">
                                  <Eye className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-xs">No Preview</p>
                                </div>
                              )}
                            </div>

                            {/* Content Details */}
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-lg">{content.key}</h4>
                                    <Badge variant={content.isActive ? "default" : "secondary"} className="text-xs">
                                      {content.isActive ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Order: {content.order}
                                    </Badge>
                                  </div>
                                  {content.title && (
                                    <p className="text-sm font-medium text-gray-900 mb-1">{content.title}</p>
                                  )}
                                  {content.subtitle && (
                                    <p className="text-sm text-gray-600 mb-1">{content.subtitle}</p>
                                  )}
                                  {content.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2">{content.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
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
                                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                                {content.link && (
                                  <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    <span className="truncate max-w-xs">{content.link}</span>
                                  </div>
                                )}
                                {content.icon && (
                                  <div className="flex items-center gap-1">
                                    <span>Icon: {content.icon}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, content: null })}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Konten Website
            </DialogTitle>
          </DialogHeader>
          {editDialog.content && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Location Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Lokasi di Website:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-white">
                        {editDialog.content.page}
                      </Badge>
                      <span className="text-blue-600">→</span>
                      <Badge variant="outline" className="bg-white">
                        {editDialog.content.section}
                      </Badge>
                      <span className="text-blue-600">→</span>
                      <Badge variant="outline" className="bg-white">
                        {editDialog.content.key}
                      </Badge>
                    </div>
                    {sectionInfo[editDialog.content.section] && (
                      <p className="text-xs text-blue-700 mt-2">
                        📍 {sectionInfo[editDialog.content.section].description}
                      </p>
                    )}
                  </div>
                </div>
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
