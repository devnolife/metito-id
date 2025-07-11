"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SidebarLayout } from "@/components/sidebar-layout"
import { WhatsAppFloat } from "@/components/whatsapp-float"

interface LayoutProviderProps {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname()

  // Define different layout types based on routes
  const getLayoutType = () => {
    // Admin routes have their own layout
    if (pathname.startsWith('/admin')) {
      return 'admin'
    }

    // Auth routes (login, register, etc.) - no sidebar
    if (pathname === '/login' || pathname === '/register' || pathname === '/unauthorized') {
      return 'auth'
    }

    // Landing page - no sidebar
    if (pathname === '/') {
      return 'landing'
    }

    // Public pages with sidebar
    if (pathname.startsWith('/products') ||
      pathname.startsWith('/services') ||
      pathname.startsWith('/blog') ||
      pathname.startsWith('/gallery') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/customer') ||
      pathname.startsWith('/certification') ||
      pathname.startsWith('/cart')) {
      return 'public-with-sidebar'
    }

    // Default - minimal layout
    return 'minimal'
  }

  const layoutType = getLayoutType()

  // Admin layout - handled by admin layout component
  if (layoutType === 'admin') {
    return <>{children}</>
  }

  // Auth layout - minimal, no sidebar
  if (layoutType === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Landing page layout - Header + Footer, no sidebar
  if (layoutType === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        {children}
        <WhatsAppFloat />
      </div>
    )
  }

  // Public pages with sidebar
  if (layoutType === 'public-with-sidebar') {
    return (
      <div className="min-h-screen bg-gray-50">
        <SidebarLayout
          title={getPageTitle(pathname)}
          description={getPageDescription(pathname)}
        >
          {children}
        </SidebarLayout>
        <WhatsAppFloat />
      </div>
    )
  }

  // Minimal layout - just header and footer
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

// Helper function to get page title based on route
function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/products': 'Produk Pengolahan Air',
    '/services': 'Layanan Teknik',
    '/blog': 'Blog & Artikel',
    '/gallery': 'Galeri Project',
    '/contact': 'Kontak Kami',
    '/customer': 'Pelanggan & Testimoni',
    '/certification': 'Sertifikasi & Penghargaan',
    '/cart': 'Keranjang Belanja'
  }

  return titles[pathname] || 'Metito Water Solution'
}

// Helper function to get page description based on route
function getPageDescription(pathname: string): string {
  const descriptions: Record<string, string> = {
    '/products': 'Temukan solusi lengkap pengolahan air untuk kebutuhan industri dan municipal. Produk berkualitas tinggi dengan teknologi terdepan.',
    '/services': 'Solusi lengkap pengolahan air dengan layanan profesional dari konsultasi hingga maintenance. Dipercaya oleh industri terkemuka.',
    '/blog': 'Wawasan terkini tentang teknologi pengolahan air, tren industri, dan praktik terbaik dari para ahli.',
    '/gallery': 'Galeri project dan instalasi pengolahan air yang telah kami selesaikan untuk berbagai klien.',
    '/contact': 'Hubungi tim ahli kami untuk konsultasi dan penawaran solusi pengolahan air yang tepat untuk kebutuhan Anda.',
    '/customer': 'Temukan mengapa perusahaan terkemuka di seluruh Indonesia mempercayai Metito Water Solution untuk kebutuhan pengolahan air mereka.',
    '/certification': 'Sertifikasi internasional dan penghargaan yang membuktikan komitmen kami terhadap kualitas dan keunggulan.',
    '/cart': 'Kelola produk pilihan Anda dan lakukan pemesanan dengan mudah melalui sistem keranjang belanja kami.'
  }

  return descriptions[pathname] || 'Solusi pengolahan air terpercaya untuk kebutuhan industri dan municipal.'
} 
