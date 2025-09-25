"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Search, Phone, Mail, Clock, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { name: "Beranda", href: "/", matchPaths: ["/"] },
    { name: "Produk", href: "/products", matchPaths: ["/products"] },
    { name: "Layanan", href: "/services", matchPaths: ["/services"] },
    { name: "Galeri", href: "/gallery", matchPaths: ["/gallery"] },
    { name: "Pelanggan", href: "/customer", matchPaths: ["/customer"] },
    { name: "Sertifikasi", href: "/certification", matchPaths: ["/certification"] },
    { name: "Blog", href: "/blog", matchPaths: ["/blog"] },
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
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <Phone className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">+62 812-1760-3950</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Mail className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">info@metito.id</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 group">
                <MapPin className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">Makassar, Indonesia</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Sen - Jum: 08:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
              <span className="text-base md:text-lg font-extrabold text-gray-900 group-hover:text-blue-600 leading-tight whitespace-nowrap">
                MULTI ENVIRO TIRTA TEKNOLOGI
              </span>
              <span className="text-xs text-gray-500 font-medium leading-tight whitespace-nowrap">
                Innovation for water solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-end gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative font-medium transition-all duration-200 px-3 py-2 rounded-lg group ${isActive(item)
                  ? "text-blue-600 bg-blue-50 shadow-sm border border-blue-100"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {item.name}
                {isActive(item) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-3 flex-1 max-w-sm mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Cari solusi..."
                className="pl-10 pr-3 py-2 w-full text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
          </div>

          {/* Admin Login Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/admin"
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              title="Login Admin"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Cari solusi..."
                  className="pl-10 pr-3 py-2 w-full text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${isActive(item)
                      ? "text-blue-600 bg-blue-50 shadow-sm border border-blue-100"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {isActive(item) && (
                      <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA Section */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Link
                  href="/admin"
                  className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-semibold border-2 border-blue-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard Admin
                </Link>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg shadow-lg text-sm">
                  Dapatkan Penawaran Gratis
                </Button>
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Telepon Kami</p>
                      <p className="text-xs text-gray-500">+62 812-1760-3950</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Email Kami</p>
                      <p className="text-xs text-gray-500">info@metito.id</p>
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
