"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(3)
  const [wishlistCount] = useState(2)

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">ME</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Metito Water Solution
              </span>
              <span className="text-xs text-gray-500 -mt-1">Solusi Teknik Air</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 px-1 group">
              Beranda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 px-1 group">
              Produk
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/services" className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 px-1 group">
              Layanan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/gallery" className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 px-1 group">
              Galeri
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 px-1 group">
              Kontak
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Cari peralatan pengolahan air..."
                className="pl-12 pr-4 py-3 w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Link href="/wishlist" className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full border-2 border-white">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <Link href="/account" className="group">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              >
                <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full border-2 border-white animate-pulse">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ?
                <X className="w-6 h-6 text-gray-600" /> :
                <Menu className="w-6 h-6 text-gray-600" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Cari peralatan pengolahan air..."
                  className="pl-12 pr-4 py-3 w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/products"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Produk
                </Link>
                <Link
                  href="/services"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Layanan
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galeri
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontak
                </Link>
              </div>

              {/* Mobile Quick Actions */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
                <Link href="/wishlist" className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Favorit ({wishlistCount})</span>
                </Link>
                <Link href="/account" className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Akun</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
