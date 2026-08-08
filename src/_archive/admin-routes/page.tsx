"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  Package,
  FileText,
  FileSignature,
  Contact,
  CalendarClock,
  Cog,
  TrendingUp,
  Bell,
  Activity,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
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

interface QuickLink {
  href: string
  label: string
  caption: string
  icon: LucideIcon
}

const QUICK_LINKS: QuickLink[] = [
  { href: "/admin/quotations", label: "Surat Penawaran", caption: "Susun dokumen penawaran baru", icon: FileText },
  { href: "/admin/letters", label: "Nomor Surat", caption: "Register penomoran surat keluar", icon: FileSignature },
  { href: "/admin/crm", label: "CRM Pelanggan", caption: "Master pelanggan dan PIC penjualan", icon: Contact },
  { href: "/admin/crm/pipeline", label: "Pipeline Penjualan", caption: "Peluang berjalan dan target closing", icon: TrendingUp },
  { href: "/admin/crm/activities", label: "Log Aktivitas", caption: "Riwayat interaksi dan tindak lanjut", icon: CalendarClock },
  { href: "/admin/settings", label: "Pengaturan", caption: "Konfigurasi sistem dan identitas", icon: Cog },
]

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
      <div className="p-6">
        <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface p-6">
              <div className="mb-4 h-3 w-20 animate-pulse bg-surface-2" />
              <div className="mb-2 h-9 w-24 animate-pulse bg-surface-2" />
              <div className="h-3 w-28 animate-pulse bg-surface-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="border border-hairline bg-surface p-12 text-center">
          <p className="rail mb-2 text-gold">Error</p>
          <p className="text-body-text">Tidak dapat memuat data dashboard</p>
          <button
            type="button"
            onClick={loadDashboardStats}
            className="mt-6 rounded-sm bg-gold px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-gold-bright"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      index: '01',
      label: 'Total Produk',
      value: String(stats.totalProducts),
      caption: `+${stats.monthlyStats.productsAdded} bulan ini`,
      icon: Package,
    },
    {
      index: '02',
      label: 'Total Pelanggan',
      value: String(stats.totalCustomers),
      caption: `+${stats.monthlyStats.customersAdded} bulan ini`,
      icon: Users,
    },
    {
      index: '03',
      label: 'Total Inquiry',
      value: String(stats.totalOrders),
      caption: `${stats.monthlyStats.inquiriesReceived} masuk bulan ini`,
      icon: TrendingUp,
    },
    {
      index: '04',
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      caption: 'Akumulasi nilai transaksi',
      icon: Activity,
    },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Metrics — a single hairline grid instead of four floating cards. */}
      <section>
        <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.index} className="admin-stat bg-surface p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rail text-gold">{metric.index}</span>
                    <span className="h-px w-5 bg-gold/40" />
                  </div>
                  <Icon className="h-4 w-4 text-body-muted" />
                </div>
                <p className="rail mb-2 text-body-muted">{metric.label}</p>
                <p className="font-display text-3xl font-bold tracking-[-0.03em] text-white">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-body-muted">{metric.caption}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick access — indexed rows with the gold sweep from the public catalog. */}
      <section>
        <SectionMarker index="05" title="Akses Cepat" />
        <div className="border-b border-hairline">
          {QUICK_LINKS.map((link, i) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="index-row group flex items-center gap-4 px-4 py-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <span className="rail w-6 flex-shrink-0 text-body-muted transition-colors group-hover:text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="h-4 w-4 flex-shrink-0 text-body-muted transition-colors group-hover:text-gold" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-white">{link.label}</span>
                  <span className="block truncate text-xs text-body-muted">{link.caption}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-body-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-gold group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent inquiries */}
        <section className="admin-panel p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" />
              <h2 className="font-display text-base font-bold tracking-[-0.01em] text-white">
                Inquiry Terbaru
              </h2>
            </div>
          </div>

          {stats.recentInquiries.length > 0 ? (
            <ul className="border-b border-hairline">
              {stats.recentInquiries.map((inquiry, i) => (
                <li key={inquiry.id} className="admin-row flex items-start gap-3 py-3">
                  <span className="rail w-6 flex-shrink-0 pt-0.5 text-body-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{inquiry.name}</p>
                    <p className="truncate text-xs text-body-text">{inquiry.subject}</p>
                    <p className="mt-0.5 text-xs text-body-muted">{formatDate(inquiry.createdAt)}</p>
                  </div>
                  <StatusPill status={inquiry.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-body-muted">Belum ada inquiry</p>
          )}
        </section>

        {/* Recent products */}
        <section className="admin-panel p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gold" />
              <h2 className="font-display text-base font-bold tracking-[-0.01em] text-white">
                Produk Terbaru
              </h2>
            </div>
          </div>

          {stats.recentProducts.length > 0 ? (
            <ul className="border-b border-hairline">
              {stats.recentProducts.map((product, i) => (
                <li key={product.id} className="admin-row flex items-start gap-3 py-3">
                  <span className="rail w-6 flex-shrink-0 pt-0.5 text-body-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{product.name}</p>
                    <p className="truncate text-xs text-body-text">{product.category?.name}</p>
                    <p className="mt-0.5 text-xs text-body-muted">{formatDate(product.createdAt)}</p>
                  </div>
                  <span className="flex-shrink-0 font-mono text-sm text-gold">
                    {formatCurrency(product.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-body-muted">Belum ada produk</p>
          )}
        </section>
      </div>
    </div>
  )
}

function SectionMarker({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="rail text-gold">{index}</span>
      <span className="h-px w-8 bg-gold/45" />
      <h2 className="font-display text-base font-bold tracking-[-0.01em] text-white">{title}</h2>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const normalized = status?.toUpperCase()
  const tone =
    normalized === 'PENDING'
      ? 'border-gold/40 bg-gold/10 text-gold'
      : normalized === 'REJECTED' || normalized === 'CLOSED'
        ? 'border-red-500/35 bg-red-500/10 text-red-300'
        : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'

  return (
    <span className={`rail flex-shrink-0 whitespace-nowrap border px-2 py-1 ${tone}`}>
      {status}
    </span>
  )
}
