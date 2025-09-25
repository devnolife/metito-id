"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Star, Settings, Droplets, Wrench, Zap, Shield, Target, Users, Globe, Cog, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DialogFooter } from "@/components/ui/dialog"

interface Service {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string
  icon?: string
  features: string[]
  pricing?: any
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Icon configuration with different colors
const iconConfigs = [
  { icon: Droplets, color: "bg-blue-100 text-blue-600", name: "droplets" },
  { icon: Wrench, color: "bg-orange-100 text-orange-600", name: "wrench" },
  { icon: Zap, color: "bg-yellow-100 text-yellow-600", name: "zap" },
  { icon: Shield, color: "bg-green-100 text-green-600", name: "shield" },
  { icon: Target, color: "bg-purple-100 text-purple-600", name: "target" },
  { icon: Users, color: "bg-pink-100 text-pink-600", name: "users" },
  { icon: Globe, color: "bg-indigo-100 text-indigo-600", name: "globe" },
  { icon: Cog, color: "bg-gray-100 text-gray-600", name: "cog" },
]

const getRandomIconConfig = () => {
  return iconConfigs[Math.floor(Math.random() * iconConfigs.length)]
}

export default function AdminServicesPage() {
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDesc: "",
    icon: "",
    features: [] as string[],
    pricing: {},
    isFeatured: false,
    isActive: true
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadServices()
  }, [currentPage, searchTerm, statusFilter, featuredFilter])

  const loadServices = async () => {
    try {
      setIsLoading(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(featuredFilter !== 'all' && { featured: featuredFilter })
      })

      const response = await fetch(`/api/admin/services?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setServices(data.data.services)
          setPagination(data.data.pagination)
        }
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateService = async () => {
    try {
      setIsSubmitting(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setIsCreateDialogOpen(false)
          setFormData({
            name: "",
            description: "",
            shortDesc: "",
            icon: "",
            features: [],
            pricing: {},
            isFeatured: false,
            isActive: true
          })
          loadServices()
          toast({ title: 'Berhasil', description: 'Layanan berhasil dibuat' })
        }
      }
    } catch (error) {
      console.error('Error creating service:', error)
      toast({ title: 'Gagal', description: 'Tidak dapat membuat layanan', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (service: Service) => {
    setCurrentService(service)
    setFormData({
      name: service.name,
      description: service.description,
      shortDesc: service.shortDesc || '',
      icon: service.icon || '',
      features: service.features || [],
      pricing: service.pricing || {},
      isFeatured: service.isFeatured,
      isActive: service.isActive
    })
    setEditDialogOpen(true)
  }

  const handleUpdateService = async () => {
    if (!currentService) return
    try {
      setLoadingAction(true)
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`

      const res = await fetch(`/api/admin/services/${currentService.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Gagal update layanan')
      toast({ title: 'Berhasil', description: 'Layanan diperbarui' })
      setEditDialogOpen(false)
      setCurrentService(null)
      loadServices()
    } catch (e: any) {
      toast({ title: 'Gagal', description: e.message || 'Tidak dapat update layanan', variant: 'destructive' })
    } finally {
      setLoadingAction(false)
    }
  }

  const openDelete = (service: Service) => {
    setCurrentService(service)
    setDeleteDialogOpen(true)
  }

  const handleDeleteService = async () => {
    if (!currentService) return
    try {
      setLoadingAction(true)
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`
      const res = await fetch(`/api/admin/services/${currentService.id}`, { method: 'DELETE', headers, credentials: 'include' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Gagal menghapus layanan')
      toast({ title: 'Berhasil', description: 'Layanan dihapus' })
      setDeleteDialogOpen(false)
      setCurrentService(null)
      loadServices()
    } catch (e: any) {
      toast({ title: 'Gagal', description: e.message || 'Tidak dapat menghapus layanan', variant: 'destructive' })
    } finally {
      setLoadingAction(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getServiceIcon = (service: Service, index: number) => {
    const iconConfig = getRandomIconConfig()
    const IconComponent = iconConfig.icon

    return (
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconConfig.color}`}>
        <IconComponent className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Layanan</h1>
          <p className="text-gray-600">Kelola layanan dan solusi teknik air</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              Tambah Layanan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Layanan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Layanan *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama layanan"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi layanan"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi Singkat</label>
                <Input
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Deskripsi singkat (opsional)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Nama icon (opsional)"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" className="text-sm">Featured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="text-sm">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCreateService}
                  disabled={isSubmitting || !formData.name || !formData.description}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari layanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white border-gray-200">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Tidak Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid gap-4">
        {isLoading ? (
          // Loading skeleton with better design
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : services.length > 0 ? (
          services.map((service, index) => (
            <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {getServiceIcon(service, index)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      {service.isFeatured && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
                          <Star className="w-3 h-3" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                        className={service.isActive
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                          : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200"
                        }
                      >
                        {service.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                      {service.shortDesc || service.description.substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Dibuat: {formatDate(service.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        Diupdate: {formatDate(service.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(service)}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDelete(service)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada layanan</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Mulai dengan menambahkan layanan pertama Anda untuk memberikan solusi terbaik kepada pelanggan
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Layanan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalCount)} dari {pagination.totalCount} layanan
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage(pagination.page - 1)}
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage(pagination.page + 1)}
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Layanan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi Singkat</label>
              <Input
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <label htmlFor="edit_isFeatured" className="text-sm">Featured</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="edit_isActive" className="text-sm">Active</label>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={loadingAction}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdateService}
              disabled={loadingAction || !formData.name || !formData.description}
            >
              {loadingAction ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Menyimpan...</>) : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Layanan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Apakah Anda yakin ingin menghapus layanan <strong>{currentService?.name}</strong>? Tindakan ini tidak bisa dibatalkan.</p>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loadingAction}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              disabled={loadingAction}
            >
              {loadingAction ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Menghapus...</>) : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
