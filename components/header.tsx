"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Search, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Customer", href: "#customer" },
    { name: "Certification", href: "#certification" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="primary-blue text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@metitowater.com</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Operating Hours: Monday - Friday 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-14 h-14 p-2 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl">
              <Image src="/images/logo.png" alt="Metito Water" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-blue">Metito Water</h1>
              <p className="text-sm text-gray-600">Water Treatment Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-blue font-medium transition-colors px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-gray-700 hover:text-primary-blue font-medium transition-colors px-2 py-1"
            >
              Admin
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search water treatment equipment..."
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-primary-blue rounded-lg"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search equipment..."
                    className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-primary-blue rounded-lg"
                  />
                </div>
              </div>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-blue font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/admin" className="block px-3 py-2 text-gray-700 hover:text-primary-blue font-medium">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
