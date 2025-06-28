"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Search, Phone, Mail, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Customer", href: "/customer" },
    { name: "Certification", href: "/certification" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <Phone className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Mail className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">info@metito.id</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 group">
                <MapPin className="w-4 h-4 group-hover:text-blue-200 transition-colors" />
                <span className="font-medium">Jakarta, Indonesia</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Mon - Fri: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
              <Image src="/images/logo.png" alt="Metito Water" fill className="object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg md:text-xl font-extrabold text-gray-900 group-hover:text-blue-600 leading-tight whitespace-nowrap">
                Metito Water
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-medium leading-tight whitespace-nowrap">
                Water Treatment Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-end gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 group"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-3 flex-1 max-w-sm mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search equipment..."
                className="pl-10 pr-3 py-2 w-full text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
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
                  placeholder="Search equipment..."
                  className="pl-10 pr-3 py-2 w-full text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
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
                  Admin Dashboard
                </Link>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg shadow-lg text-sm">
                  Get Free Quote
                </Button>
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Call Us</p>
                      <p className="text-xs text-gray-500">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Email Us</p>
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
