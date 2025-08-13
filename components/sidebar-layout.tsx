"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Package,
  ShoppingCart,
  Newspaper,
  Phone,
  Users,
  Award,
  Images,
  Wrench,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

const sidebarItems = [
  {
    label: "Produk",
    href: "/products",
    icon: Package,
    description: "Katalog produk pengolahan air"
  },
  {
    label: "Layanan",
    href: "/services",
    icon: Wrench,
    description: "Layanan teknik dan maintenance"
  },
  {
    label: "Galeri",
    href: "/gallery",
    icon: Images,
    description: "Galeri project dan instalasi"
  },
  {
    label: "Blog",
    href: "/blog",
    icon: Newspaper,
    description: "Artikel dan berita terkini"
  },
  {
    label: "Sertifikasi",
    href: "/certification",
    icon: Award,
    description: "Sertifikat dan penghargaan"
  },
  {
    label: "Pelanggan",
    href: "/customer",
    icon: Users,
    description: "Testimoni dan kasus sukses"
  },
  {
    label: "Keranjang",
    href: "/cart",
    icon: ShoppingCart,
    description: "Keranjang belanja"
  },
  {
    label: "Kontak",
    href: "/contact",
    icon: Phone,
    description: "Hubungi kami"
  }
]

export function SidebarLayout({ children, title, description }: SidebarLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 lg:h-auto lg:shadow-lg
        `}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Metito ID</h3>
                  <p className="text-sm text-gray-500">Water Treatment Solutions</p>
                </div>
              </div>
              <Separator />
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Butuh Bantuan?</h4>
                  <p className="text-sm text-blue-100 mb-3">
                    Tim ahli kami siap membantu Anda 24/7
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    Hubungi Sekarang
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-80">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {title}
              </Badge>
            </div>
          </div>

          {/* Page header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="px-6 py-12">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                {description && (
                  <p className="text-lg text-blue-100 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 
