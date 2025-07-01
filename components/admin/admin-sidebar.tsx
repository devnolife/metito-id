"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Settings,
  ImageIcon,
  Users,
  Award,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight,
  Cog,
} from "lucide-react"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AdminSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Produk", icon: Package },
    { id: "services", label: "Layanan", icon: Settings },
    { id: "gallery", label: "Galeri", icon: ImageIcon },
    { id: "customers", label: "Pelanggan", icon: Users },
    { id: "certifications", label: "Sertifikasi", icon: Award },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "contact", label: "Kontak", icon: Phone },
    { id: "settings", label: "Pengaturan", icon: Cog },
  ]

  return (
    <div
      className={`fixed left-0 top-0 h-full primary-blue text-white transition-all duration-300 z-30 ${collapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-600">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 p-1 bg-white rounded-lg">
                <Image src="/images/logo.png" alt="Metito Water Engineer" fill className="object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Panel Admin</h2>
                <p className="text-xs text-blue-200">Metito Water Engineer</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-white hover:bg-blue-600 h-8 w-8"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start text-left h-12 transition-all duration-200 ${activeSection === item.id
              ? "bg-blue-600 text-white shadow-lg"
              : "text-blue-100 hover:bg-blue-600 hover:text-white"
              } ${collapsed ? "px-3" : "px-4"}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-600 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-200 mb-1">Dashboard Admin</p>
            <p className="text-sm font-semibold">v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  )
}
