"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  Eye,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  Image,
  Award,
  Globe,
  Activity,
  Settings
} from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  pendingContacts: number
  activeServices: number
  totalBlogPosts: number
  galleryImages: number
  certifications: number
  websiteVisitors: number
}

interface RecentActivity {
  id: string
  type: 'contact' | 'order' | 'product' | 'blog'
  message: string
  timestamp: string
  status: 'pending' | 'completed' | 'active'
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data - replace with actual API calls
        const mockStats: DashboardStats = {
          totalProducts: 127,
          totalCustomers: 542,
          totalOrders: 89,
          totalRevenue: 1250000,
          pendingContacts: 12,
          activeServices: 8,
          totalBlogPosts: 24,
          galleryImages: 156,
          certifications: 15,
          websiteVisitors: 8340
        }

        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'contact',
            message: 'Permintaan konsultasi dari PT Indofood',
            timestamp: '2 menit yang lalu',
            status: 'pending'
          },
          {
            id: '2',
            type: 'order',
            message: 'Pesanan sistem filtrasi air - Rp 125.000.000',
            timestamp: '1 jam yang lalu',
            status: 'completed'
          },
          {
            id: '3',
            type: 'product',
            message: 'Produk baru "UV Sterilizer UV-2000" ditambahkan',
            timestamp: '3 jam yang lalu',
            status: 'active'
          },
          {
            id: '4',
            type: 'blog',
            message: 'Artikel "Teknologi Reverse Osmosis" dipublikasi',
            timestamp: '1 hari yang lalu',
            status: 'active'
          },
          {
            id: '5',
            type: 'contact',
            message: 'Konsultasi teknis dari PT Aqua Danone',
            timestamp: '2 hari yang lalu',
            status: 'completed'
          }
        ]

        setStats(mockStats)
        setRecentActivity(mockActivity)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-gold" />
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-emerald-300" />
      case 'product':
        return <Package className="w-4 h-4 text-gold" />
      case 'blog':
        return <FileText className="w-4 h-4 text-gold" />
      default:
        return <Activity className="w-4 h-4 text-body-text" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-gold/10 text-gold">Pending</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300">Selesai</Badge>
      case 'active':
        return <Badge variant="secondary" className="bg-gold/10 text-gold">Aktif</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-surface-2 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-surface-2 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Total Produk</p>
                <p className="text-3xl font-bold text-white">{stats?.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Total Pelanggan</p>
                <p className="text-3xl font-bold text-white">{stats?.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Pesanan Bulan Ini</p>
                <p className="text-3xl font-bold text-white">{stats?.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Pendapatan Bulan Ini</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Kontak Pending</p>
                <p className="text-3xl font-bold text-white">{stats?.pendingContacts}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Artikel Blog</p>
                <p className="text-3xl font-bold text-white">{stats?.totalBlogPosts}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Foto Gallery</p>
                <p className="text-3xl font-bold text-white">{stats?.galleryImages}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-body-text">Pengunjung Website</p>
                <p className="text-3xl font-bold text-white">{stats?.websiteVisitors?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-navy-deep rounded-lg">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.message}</p>
                    <p className="text-xs text-body-muted">{activity.timestamp}</p>
                  </div>
                  <div>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ringkasan Performa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-medium">Sistem Berjalan Normal</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300">Online</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium">Website Traffic</span>
                </div>
                <Badge variant="secondary" className="bg-gold/10 text-gold">+12%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium">Tingkat Kepuasan</span>
                </div>
                <Badge variant="secondary" className="bg-gold/10 text-gold">98%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium">Waktu Respons</span>
                </div>
                <Badge variant="secondary" className="bg-gold/10 text-gold">&lt; 2 jam</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2 h-12">
              <Package className="w-4 h-4" />
              Tambah Produk
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <FileText className="w-4 h-4" />
              Tulis Artikel
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Image className="w-4 h-4" />
              Upload Gambar
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Settings className="w-4 h-4" />
              Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
