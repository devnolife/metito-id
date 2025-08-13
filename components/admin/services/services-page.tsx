"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { Plus, Settings, Search, Clock, CheckCircle, DollarSign } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: string
  status: 'active' | 'inactive'
  completedProjects: number
  createdAt: string
}

export function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Mock data - replace with actual API calls
      const mockServices: Service[] = [
        {
          id: "1",
          name: "Konsultasi Sistem Pengolahan Air",
          description: "Konsultasi lengkap untuk desain sistem pengolahan air industri",
          category: "consulting",
          price: 5000000,
          duration: "2-4 minggu",
          status: "active",
          completedProjects: 45,
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "Instalasi Water Treatment Plant",
          description: "Jasa instalasi dan commissioning water treatment plant",
          category: "installation",
          price: 50000000,
          duration: "1-3 bulan",
          status: "active",
          completedProjects: 28,
          createdAt: new Date().toISOString()
        }
      ]

      setServices(mockServices)

      toast({
        title: "Data Berhasil Dimuat",
        description: `${mockServices.length} layanan ditemukan`,
        variant: "default",
      })
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Kesalahan",
        description: "Gagal memuat data layanan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <LoadingOverlay
        message="Memuat data layanan..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Layanan</h1>
          <p className="text-gray-600">Kelola layanan dan jasa pengolahan air</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => toast({ title: "Coming Soon", description: "Fitur tambah layanan akan segera hadir" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Layanan</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Layanan tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyek Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.reduce((sum, s) => sum + s.completedProjects, 0)}</div>
            <p className="text-xs text-muted-foreground">Total proyek</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Layanan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(services.reduce((sum, s) => sum + s.price, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total nilai</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari layanan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                  {service.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Harga:</span>
                  <span className="font-semibold">{formatCurrency(service.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Durasi:</span>
                  <span className="font-semibold">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Kategori:</span>
                  <span className="font-semibold capitalize">{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Proyek Selesai:</span>
                  <span className="font-semibold">{service.completedProjects}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming Soon", description: "Fitur edit akan segera hadir" })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming Soon", description: "Fitur hapus akan segera hadir" })}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada layanan</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Tidak ada layanan yang sesuai dengan pencarian"
              : "Mulai dengan menambahkan layanan pertama Anda"
            }
          </p>
        </div>
      )}
    </div>
  )
} 
