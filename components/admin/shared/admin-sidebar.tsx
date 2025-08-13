"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Package,
  Users,
  MessageSquare,
  FileText,
  Award,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Phone,
  Cog
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", color: "text-blue-600" },
    { id: "products", label: "Produk", icon: Package, href: "/admin/products", color: "text-green-600" },
    { id: "services", label: "Layanan", icon: Settings, href: "/admin/services", color: "text-purple-600" },
    { id: "gallery", label: "Galeri", icon: Image, href: "/admin/gallery", color: "text-teal-600" },
    { id: "customers", label: "Pelanggan", icon: Users, href: "/admin/customers", color: "text-orange-600" },
    { id: "certifications", label: "Sertifikasi", icon: Award, href: "/admin/certifications", color: "text-yellow-600" },
    { id: "blog", label: "Blog", icon: FileText, href: "/admin/blog", color: "text-indigo-600" },
    { id: "contact", label: "Kontak", icon: Phone, href: "/admin/contact", color: "text-pink-600" },
    { id: "settings", label: "Pengaturan", icon: Cog, href: "/admin/settings", color: "text-gray-600" },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      // Ignore logout errors
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
      }
      router.push('/admin')
    }
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-gray-900">Metito Admin</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto text-left transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                collapsed ? "px-3" : "px-4"
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-blue-600" : item.color,
                collapsed ? "mr-0" : "mr-3"
              )} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Button>
          )
        })}
      </nav>

    </div>
  )
} 
