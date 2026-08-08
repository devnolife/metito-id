"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/shared/admin-sidebar"
import { AdminHeader } from "@/components/admin/shared/admin-header"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { Toaster } from "@/components/legacy-ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

/* Modul pengelolaan situs publik lama. Frontend baru tidak membaca konten ini
   lagi, jadi halamannya ditutup dari UI — kode dan API sengaja dibiarkan utuh
   agar bisa dihidupkan kembali bila dibutuhkan. */
const DISABLED_ROUTES = [
  '/admin/customers',
  '/admin/contact',
  '/admin/whatsapp-contacts',
  '/admin/products',
  '/admin/services',
  '/admin/certifications',
  '/admin/gallery',
  '/admin/blog',
  '/admin/page-content',
]

function isDisabledRoute(pathname: string): boolean {
  return DISABLED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Pages that don't require authentication
  const publicPages = ['/admin/login']
  const isPublicPage = publicPages.includes(pathname)
  const isDisabledPage = isDisabledRoute(pathname)

  useEffect(() => {
    if (isDisabledPage) {
      router.replace('/admin')
    }
  }, [isDisabledPage, router])

  useEffect(() => {
    // For /admin page, let the page component handle auth
    if (isPublicPage) {
      setIsLoading(false)
    } else {
      checkAuthStatus()
    }
  }, [pathname, isPublicPage])

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
          setIsAuthenticated(true)
          setUser(data.data)

          // Store user data in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminUser', JSON.stringify(data.data))
          }
          return
        }
      }

      // Not authenticated or token expired, clear everything and redirect
      setIsAuthenticated(false)
      setUser(null)

      // Clear stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
        localStorage.removeItem('authToken')
        sessionStorage.clear()
      }

      // Force redirect to login page
      window.location.href = '/login?redirect=' + encodeURIComponent(pathname)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setUser(null)

      // Clear stored data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
        localStorage.removeItem('authToken')
        sessionStorage.clear()
      }

      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat memverifikasi akses. Silakan login kembali.",
        variant: "destructive",
      })

      // Force redirect to login page
      window.location.href = '/login?redirect=' + encodeURIComponent(pathname)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil logout.",
        variant: "default",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat logout.",
        variant: "destructive",
      })
    } finally {
      // Clear stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
        localStorage.removeItem('authToken')
        sessionStorage.clear()
      }

      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)

      // Force redirect to login page
      window.location.href = '/login'
    }
  }

  // Halaman modul nonaktif: jangan render apa pun selagi redirect ke /admin.
  if (isDisabledPage) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <LoadingOverlay
        message="Memuat halaman admin..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  // Public pages (like login) - render without sidebar
  if (isPublicPage) {
    return (
      <div className="admin-theme admin-shell min-h-screen">
        {children}
        <Toaster />
      </div>
    )
  }

  // Private pages - require authentication
  if (!isAuthenticated || !user) {
    return null // Will redirect to login
  }

  const page = getPageMeta(pathname)

  // Authenticated admin - render with sidebar
  return (
    <div className="admin-theme admin-shell flex h-screen overflow-hidden">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AdminHeader
          title={page.title}
          subtitle={page.subtitle}
          index={page.index}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

interface PageMeta {
  index: string
  title: string
  subtitle: string
}

/* Each route carries its own mono index and caption so the header reads like
   the numbered section markers on the public site. Hanya modul aktif yang
   terdaftar — modul situs lama diblokir lewat DISABLED_ROUTES. */
const PAGE_META: Record<string, PageMeta> = {
  '/admin': { index: '01', title: 'Dashboard', subtitle: 'Ringkasan operasional PT. METITO' },
  '/admin/quotations': { index: '02', title: 'Surat Penawaran', subtitle: 'Susun dan kelola dokumen penawaran' },
  '/admin/letters': { index: '03', title: 'Nomor Surat', subtitle: 'Register penomoran seluruh surat keluar' },
  '/admin/crm/pipeline': { index: '04', title: 'Pipeline Penjualan', subtitle: 'Peluang berjalan dan target closing' },
  '/admin/crm/activities': { index: '05', title: 'Log Aktivitas', subtitle: 'Riwayat interaksi dan tindak lanjut' },
  '/admin/crm': { index: '06', title: 'CRM Pelanggan', subtitle: 'Master pelanggan dan PIC penjualan' },
  '/admin/settings': { index: '07', title: 'Pengaturan', subtitle: 'Konfigurasi sistem dan identitas' },
}

function getPageMeta(pathname: string): PageMeta {
  if (PAGE_META[pathname]) return PAGE_META[pathname]

  // Detail routes (/admin/products/[id]) inherit their section's marker.
  const match = Object.keys(PAGE_META)
    .filter((href) => href !== '/admin' && pathname.startsWith(href))
    .sort((a, b) => b.length - a.length)[0]

  return match ? PAGE_META[match] : { index: '00', title: 'Dashboard Admin', subtitle: 'Kelola katalog solusi teknik air Anda' }
}
