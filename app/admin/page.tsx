"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, Users, Package, FileText, Image, Phone, TrendingUp, Calendar, Bell, Activity } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()

        if (data.success && data.data.role === 'ADMIN') {
          setUser(data.data)
          // Load dashboard stats here
          loadDashboardStats()
          return
        } else if (data.success && data.data.role !== 'ADMIN') {
          toast({
            title: "Akses Ditolak",
            description: "Anda tidak memiliki hak akses admin.",
            variant: "destructive",
          })
          router.push('/admin/login')
          return
        }
      }

      // Redirect to login if not authenticated
      router.push('/admin/login')
    } catch (error) {
      console.error('Auth check error:', error)
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat memverifikasi akses. Silakan login kembali.",
        variant: "destructive",
      })
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    try {
      // TODO: Implement actual API calls for dashboard stats
      // For now, using mock data
      setStats({
        totalProducts: 45,
        totalCustomers: 128,
        totalOrders: 89,
        totalRevenue: 2500000
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

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
        message="Memuat dashboard..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang kembali, {user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            {user.role}
          </Badge>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produk aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Pelanggan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pesanan bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Revenue bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Manajemen Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Kelola katalog produk dan layanan</p>
            <div className="space-y-2">
              <a href="/admin/products" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="font-medium">Produk</div>
                <div className="text-sm text-gray-600">Manage products</div>
              </a>
              <a href="/admin/services" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="font-medium">Layanan</div>
                <div className="text-sm text-gray-600">Manage services</div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manajemen Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Kelola data pelanggan dan kontak</p>
            <div className="space-y-2">
              <a href="/admin/customers" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="font-medium">Pelanggan</div>
                <div className="text-sm text-gray-600">Manage customers</div>
              </a>
              <a href="/admin/contact" className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="font-medium">Kontak</div>
                <div className="text-sm text-gray-600">Manage inquiries</div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Konten & Media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Kelola konten dan media</p>
            <div className="space-y-2">
              <a href="/admin/blog" className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="font-medium">Blog</div>
                <div className="text-sm text-gray-600">Manage blog posts</div>
              </a>
              <a href="/admin/gallery" className="block p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="font-medium">Galeri</div>
                <div className="text-sm text-gray-600">Manage gallery</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Produk baru ditambahkan</p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pelanggan baru mendaftar</p>
                <p className="text-xs text-gray-500">5 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pesanan baru diterima</p>
                <p className="text-xs text-gray-500">1 hari yang lalu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
