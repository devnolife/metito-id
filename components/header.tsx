"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Search, Phone, Mail, Globe, MapPin } from "lucide-react"
import { CONTACT } from "@/lib/company-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  const navigationItems = [
    { name: "Beranda", href: "/", matchPaths: ["/"] },
    { name: "Produk", href: "/products", matchPaths: ["/products"] },
    { name: "Layanan", href: "/services", matchPaths: ["/services"] },
    { name: "Galeri", href: "/gallery", matchPaths: ["/gallery"] },
    { name: "Sertifikasi", href: "/certification", matchPaths: ["/certification"] },
    { name: "Kontak", href: "/contact", matchPaths: ["/contact"] },
  ]

  const isActive = (item: typeof navigationItems[0]) => {
    // Exact match for home page
    if (item.href === "/" && pathname === "/") return true

    // For other pages, check if pathname starts with the href (for nested routes)
    if (item.href !== "/" && pathname.startsWith(item.href)) return true

    // Check additional match paths
    return item.matchPaths.some(path =>
      path === "/" ? pathname === path : pathname.startsWith(path)
    )
  }

  return (
    <header
      className={
        isHome
          ? "absolute top-0 left-0 right-0 z-50 bg-transparent pt-4 md:pt-6"
          : "bg-[var(--navy)]/95 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--hairline)]"
      }
    >
      {/* Top Bar */}
      {!isHome && (
        <div className="bg-[var(--navy-deep)] text-white py-2 border-b border-[var(--hairline)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 group">
                  <Phone className="w-4 h-4 text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors" />
                  <span className="font-medium">{CONTACT.phones[0]}</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <Mail className="w-4 h-4 text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors" />
                  <span className="font-medium">{CONTACT.email}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-2 group">
                  <MapPin className="w-4 h-4 text-[var(--gold)] group-hover:text-[var(--gold-bright)] transition-colors" />
                  <span className="font-medium">{CONTACT.address.full}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[var(--gold)]" />
                <span className="font-medium">{CONTACT.website}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group pr-4">
            <Image
              src="/images/logo.png"
              alt="MULTI ENVIRO TIRTA TEKNOLOGI (Metito)"
              width={58}
              height={58}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col justify-center">
              <span className={`text-xl md:text-2xl font-extrabold leading-none tracking-wide text-white group-hover:text-[var(--gold)]`}>
                METITO
              </span>
              <span className={`text-[10px] md:text-xs font-medium leading-tight whitespace-nowrap text-[var(--body-muted)]`}>
                Multi Enviro Tirta Teknologi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-1 ${isHome ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "flex-1 justify-end"}`}>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative font-medium text-sm transition-all duration-200 px-4 py-2 rounded-full ${isActive(item)
                  ? isHome
                    ? "text-[var(--navy)] bg-[var(--lime)] shadow-lg shadow-[var(--lime)]/25"
                    : "text-[var(--navy)] bg-[var(--lime)] shadow-sm"
                  : isHome
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-[var(--body-text)] hover:text-white hover:bg-[var(--surface)]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          {!isHome && (
            <div className="hidden md:flex items-center space-x-3 flex-1 max-w-sm mx-6">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--body-muted)] w-4 h-4 group-focus-within:text-[var(--gold)] transition-colors" />
                <Input
                  type="text"
                  placeholder="Cari solusi..."
                  className="pl-10 pr-3 py-2 w-full text-sm border-[var(--hairline)] rounded-lg text-white placeholder:text-[var(--body-muted)] focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200 bg-[var(--surface)]"
                />
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${isHome ? "text-white hover:bg-white/15" : "text-[var(--body-text)] hover:text-white hover:bg-[var(--surface)]"}`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[var(--hairline)] bg-[var(--navy)]/98 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--body-muted)] w-4 h-4 group-focus-within:text-[var(--gold)] transition-colors" />
                <Input
                  type="text"
                  placeholder="Cari solusi..."
                  className="pl-10 pr-3 py-2 w-full text-sm border-[var(--hairline)] rounded-lg text-white placeholder:text-[var(--body-muted)] focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent bg-[var(--surface)]"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${isActive(item)
                      ? "text-[var(--navy)] bg-[var(--lime)] shadow-sm"
                      : "text-[var(--body-text)] hover:text-white hover:bg-[var(--surface)]"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {isActive(item) && (
                      <div className="ml-2 w-2 h-2 bg-[var(--navy)] rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA Section */}
              <div className="pt-3 border-t border-[var(--hairline)] space-y-2">
                <Button className="w-full bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] font-semibold py-2 rounded-full text-sm">
                  Dapatkan Penawaran Gratis
                </Button>
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-3 border-t border-[var(--hairline)]">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg">
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                    <div>
                      <p className="text-xs font-medium text-white">Telepon Kami</p>
                      <p className="text-xs text-[var(--body-muted)]">{CONTACT.phones[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg">
                    <Mail className="w-4 h-4 text-[var(--gold)]" />
                    <div>
                      <p className="text-xs font-medium text-white">Email Kami</p>
                      <p className="text-xs text-[var(--body-muted)]">{CONTACT.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
