"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, FileText, Image, Phone, TrendingUp, Calendar, Bell, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  recentInquiries: Array<{
    id: string
    name: string
    email: string
    subject: string
    status: string
    createdAt: string
    product?: { name: string }
    user?: { name: string; email: string }
  }>
  recentProducts: Array<{
    id: string
    name: string
    price: number
    category: { name: string }
    createdAt: string
  }>
  monthlyStats: {
    productsAdded: number
    customersAdded: number
    inquiriesReceived: number
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        } else {
          throw new Error(data.message || 'Failed to load dashboard data')
        }
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast({
        title: "Kesalahan",
        description: "Gagal memuat data dashboard. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Baru saja'
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} hari yang lalu`
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Tidak dapat memuat data dashboard
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyStats.productsAdded} bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyStats.customersAdded} bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Inquiries bulan ini</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Inquiries Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{inquiry.name}</p>
                      <p className="text-xs text-gray-500">{inquiry.subject}</p>
                      <p className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</p>
                    </div>
                    <Badge variant={inquiry.status === 'PENDING' ? 'destructive' : 'default'}>
                      {inquiry.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada inquiries</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produk Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(product.createdAt)}</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada produk</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
