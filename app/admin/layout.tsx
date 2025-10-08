"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/shared/admin-sidebar"
import { AdminHeader } from "@/components/admin/shared/admin-header"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
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
      window.location.href = '/admin/login?redirect=' + encodeURIComponent(pathname)
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
      window.location.href = '/admin/login?redirect=' + encodeURIComponent(pathname)
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
      window.location.href = '/admin/login'
    }
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
    return <>{children}</>
  }

  // Private pages - require authentication
  if (!isAuthenticated || !user) {
    return null // Will redirect to login
  }

  // Authenticated admin - render with sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AdminHeader
          title={getPageTitle(pathname)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const titleMap: { [key: string]: string } = {
    '/admin': 'Dashboard Admin',
    '/admin/products': 'Manajemen Produk',
    '/admin/services': 'Manajemen Layanan',
    '/admin/customers': 'Manajemen Pelanggan',
    '/admin/gallery': 'Manajemen Galeri',
    '/admin/blog': 'Manajemen Blog',
    '/admin/certifications': 'Manajemen Sertifikasi',
    '/admin/contact': 'Manajemen Kontak',
    '/admin/settings': 'Pengaturan',
  }

  return titleMap[pathname] || 'Dashboard Admin'
}
