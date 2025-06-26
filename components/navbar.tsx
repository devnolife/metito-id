"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(3)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HE</span>
            </div>
            <span className="text-xl font-bold text-primary-blue">HeavyEquip Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-blue transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-blue transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-blue transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-blue transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-blue transition-colors">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="Search equipment..." className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/account" className="text-gray-700 hover:text-primary-blue transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-primary-blue transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 primary-blue text-white text-xs">{cartCount}</Badge>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input type="text" placeholder="Search equipment..." className="pl-10 pr-4 py-2 w-full" />
                </div>
              </div>
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-primary-blue">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-primary-blue">
                Products
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-primary-blue">
                Categories
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-blue">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary-blue">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
