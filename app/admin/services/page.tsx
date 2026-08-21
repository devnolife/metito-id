"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Star, Settings, Droplets, Wrench, Zap, Shield, Target, Users, Globe, Cog } from "lucide-react"

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
interface ServiceFormState {
  name: string
  description: string
  shortDesc: string
  icon: string
  features: string
  isFeatured: boolean
  isActive: boolean
  pricing: Record<string, unknown>
}

const getInitialServiceFormState = (): ServiceFormState => ({
  name: "",
  description: "",
  shortDesc: "",
  icon: "",
  features: "",
  isFeatured: false,
  isActive: true,
  pricing: {},
})

const parseFeaturesInput = (input: string): string[] =>
  input
    .split(/\r?\n/)
    .map((feature) => feature.trim())
    .filter(Boolean)

const mapFormStateToPayload = (data: ServiceFormState) => ({
  name: data.name.trim(),
  description: data.description.trim(),
  shortDesc: data.shortDesc.trim(),
  icon: data.icon.trim(),
  features: parseFeaturesInput(data.features),
  pricing: data.pricing ?? {},
  isFeatured: data.isFeatured,
  isActive: data.isActive,
})


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
  const [services, setServices] = useState<Service[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState<ServiceFormState>(() => getInitialServiceFormState())
  const handleCreateFormChange = useCallback((value: Partial<ServiceFormState>) => {
    setCreateFormData((prev) => ({ ...prev, ...value }))
  }, [])
  const [isCreating, setIsCreating] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editFormData, setEditFormData] = useState<ServiceFormState>(() => getInitialServiceFormState())
  const handleEditFormChange = useCallback((value: Partial<ServiceFormState>) => {
    setEditFormData((prev) => ({ ...prev, ...value }))
  }, [])
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)

  const { toast } = useToast()

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true)

      const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (searchTerm) {
        params.set('search', searchTerm)
      }

      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      if (featuredFilter !== 'all') {
        params.set('featured', featuredFilter)
      }

      const response = await fetch(`/api/admin/services?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers,
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const fetchedPagination: Pagination = data.data.pagination

          if (fetchedPagination.totalPages > 0 && currentPage > fetchedPagination.totalPages) {
            setCurrentPage(fetchedPagination.totalPages)
            return
          }

          if (fetchedPagination.totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1)
            return
          }

          setServices(data.data.services)
          setPagination(fetchedPagination)
        } else {
          console.error('Failed to load services:', data.message)
          toast({
            title: 'Gagal memuat layanan',
            description: data.message ?? 'Silakan coba lagi.',
            variant: 'destructive',
          })
        }
      } else {
        console.error('Failed to load services:', response.statusText)
        toast({
          title: 'Gagal memuat layanan',
          description: 'Silakan coba lagi atau periksa koneksi Anda.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error loading services:', error)
      toast({
        title: 'Kesalahan jaringan',
        description: 'Tidak dapat memuat data layanan. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, featuredFilter, searchTerm, statusFilter])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleCreateDialogChange = useCallback((open: boolean) => {
    setIsCreateDialogOpen(open)
    if (!open) {
      setCreateFormData(getInitialServiceFormState())
    }
  }, [])

  const handleEditDialogChange = useCallback((open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingService(null)
      setEditFormData(getInitialServiceFormState())
    }
  }, [])

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setEditFormData({
      name: service.name,
      description: service.description,
      shortDesc: service.shortDesc ?? '',
      icon: service.icon ?? '',
      features: Array.isArray(service.features) ? service.features.join('\n') : '',
      isFeatured: service.isFeatured,
      isActive: service.isActive,
      pricing: service.pricing ?? {},
    })
    setIsEditDialogOpen(true)
  }

  const handleCreateService = async () => {
    if (!createFormData.name.trim() || !createFormData.description.trim()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Nama dan deskripsi layanan wajib diisi.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsCreating(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const payload = mapFormStateToPayload(createFormData)

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          if (pagination && pagination.page === 1) {
            setServices((prev) => {
              const current = prev ?? []
              const updated = [data.data, ...current]
              if (pagination && updated.length > pagination.limit) {
                return updated.slice(0, pagination.limit)
              }
              return updated
            })
          }

          setPagination((prev) => {
            if (!prev) {
              return prev
            }
            const totalCount = prev.totalCount + 1
            const totalPages = Math.max(prev.totalPages, Math.ceil(totalCount / prev.limit))
            return {
              ...prev,
              totalCount,
              totalPages,
              hasNext: prev.page < totalPages,
              hasPrev: prev.page > 1,
            }
          })

          await loadServices()
          handleCreateDialogChange(false)
          toast({
            title: 'Layanan ditambahkan',
            description: `${data.data.name} berhasil ditambahkan.`,
          })
        } else {
          console.error('Failed to create service:', data.message)
          toast({
            title: 'Gagal membuat layanan',
            description: data.message ?? 'Silakan coba lagi.',
            variant: 'destructive',
          })
        }
      } else {
        console.error('Failed to create service:', response.statusText)
        toast({
          title: 'Gagal membuat layanan',
          description: 'Silakan coba lagi atau hubungi administrator.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating service:', error)
      toast({
        title: 'Kesalahan jaringan',
        description: 'Terjadi kesalahan saat membuat layanan. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateService = async () => {
    if (!editingService) {
      toast({
        title: 'Tidak ada layanan dipilih',
        description: 'Pilih layanan yang ingin diperbarui terlebih dahulu.',
        variant: 'destructive',
      })
      return
    }

    if (!editFormData.name.trim() || !editFormData.description.trim()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Nama dan deskripsi layanan wajib diisi.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUpdating(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const payload = mapFormStateToPayload(editFormData)

      const response = await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setServices((prev) =>
            (prev ?? []).map((service) => (service.id === data.data.id ? data.data : service))
          )
          await loadServices()
          handleEditDialogChange(false)
          toast({
            title: 'Perubahan tersimpan',
            description: `${data.data.name} berhasil diperbarui.`,
          })
        } else {
          console.error('Failed to update service:', data.message)
          toast({
            title: 'Gagal memperbarui layanan',
            description: data.message ?? 'Silakan coba lagi.',
            variant: 'destructive',
          })
        }
      } else {
        console.error('Failed to update service:', response.statusText)
        toast({
          title: 'Gagal memperbarui layanan',
          description: 'Silakan coba lagi atau hubungi administrator.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating service:', error)
      toast({
        title: 'Kesalahan jaringan',
        description: 'Terjadi kesalahan saat memperbarui layanan. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      return
    }

    try {
      setDeletingServiceId(serviceId)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setServices((prev) => (prev ?? []).filter((service) => service.id !== serviceId))

          setPagination((prev) => {
            if (!prev) {
              return prev
            }
            const totalCount = Math.max(prev.totalCount - 1, 0)
            const totalPages = totalCount === 0 ? 1 : Math.max(1, Math.ceil(totalCount / prev.limit))
            return {
              ...prev,
              totalCount,
              totalPages,
              hasNext: prev.page < totalPages,
              hasPrev: prev.page > 1 && totalPages > 1,
            }
          })

          const shouldShiftPage = Boolean(pagination && pagination.page > 1 && services.length <= 1)
          if (shouldShiftPage) {
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          } else {
            await loadServices()
          }

          toast({
            title: 'Layanan dihapus',
            description: 'Layanan berhasil dihapus dari daftar.',
          })
        } else {
          console.error('Failed to delete service:', data.message)
          toast({
            title: 'Gagal menghapus layanan',
            description: data.message ?? 'Silakan coba lagi.',
            variant: 'destructive',
          })
        }
      } else {
        console.error('Failed to delete service:', response.statusText)
        toast({
          title: 'Gagal menghapus layanan',
          description: 'Silakan coba lagi atau hubungi administrator.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({
        title: 'Kesalahan jaringan',
        description: 'Terjadi kesalahan saat menghapus layanan. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setDeletingServiceId(null)
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
        <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
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
            <ServiceForm
              formData={createFormData}
              onFormChange={handleCreateFormChange}
              onSubmit={handleCreateService}
              onCancel={() => handleCreateDialogChange(false)}
              isSubmitting={isCreating}
              submitLabel="Simpan"
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Layanan</DialogTitle>
            </DialogHeader>
            {editingService && (
              <ServiceForm
                formData={editFormData}
                onFormChange={handleEditFormChange}
                onSubmit={handleUpdateService}
                onCancel={() => handleEditDialogChange(false)}
                isSubmitting={isUpdating}
                submitLabel="Simpan Perubahan"
              />
            )}
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
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit layanan</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deletingServiceId === service.id}
                    >
                      <Trash2 className={`w-4 h-4 ${deletingServiceId === service.id ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Hapus layanan</span>
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
                onClick={() => handleCreateDialogChange(true)}
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
    </div>
  )
}

interface ServiceFormProps {
  formData: ServiceFormState
  onFormChange: (value: Partial<ServiceFormState>) => void
  onSubmit: () => void
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
}

function ServiceForm({ formData, onFormChange, onSubmit, onCancel, isSubmitting, submitLabel }: ServiceFormProps) {
  const isSubmitDisabled = isSubmitting || !formData.name.trim() || !formData.description.trim()

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="service-name">Nama Layanan *</label>
        <Input
          id="service-name"
          autoFocus
          value={formData.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          placeholder="Masukkan nama layanan"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="service-description">Deskripsi *</label>
        <Textarea
          id="service-description"
          value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          placeholder="Masukkan deskripsi layanan"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="service-short-desc">Deskripsi Singkat</label>
        <Input
          id="service-short-desc"
          value={formData.shortDesc}
          onChange={(e) => onFormChange({ shortDesc: e.target.value })}
          placeholder="Deskripsi singkat (opsional)"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="service-icon">Icon</label>
        <Input
          id="service-icon"
          value={formData.icon}
          onChange={(e) => onFormChange({ icon: e.target.value })}
          placeholder="Nama icon (opsional)"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="service-features">Fitur Layanan</label>
        <Textarea
          id="service-features"
          value={formData.features}
          onChange={(e) => onFormChange({ features: e.target.value })}
          placeholder="Tuliskan setiap fitur pada baris baru"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Pisahkan fitur dengan enter untuk menambahkan lebih dari satu.</p>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center space-x-2 text-sm" htmlFor="service-featured">
          <input
            type="checkbox"
            id="service-featured"
            className="w-4 h-4"
            checked={formData.isFeatured}
            onChange={(e) => onFormChange({ isFeatured: e.target.checked })}
          />
          <span>Featured</span>
        </label>
        <label className="flex items-center space-x-2 text-sm" htmlFor="service-active">
          <input
            type="checkbox"
            id="service-active"
            className="w-4 h-4"
            checked={formData.isActive}
            onChange={(e) => onFormChange({ isActive: e.target.checked })}
          />
          <span>Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitDisabled}>
          {isSubmitting ? 'Menyimpan...' : submitLabel}
        </Button>
      </div>
    </div>
  )
}
