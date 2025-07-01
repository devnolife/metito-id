"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { ProductManagement } from "./product-management"
import { PageManagement } from "./page-management"
import { DashboardOverview } from "./dashboard-overview"
import { SettingsManagement } from "./settings-management"

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "products":
        return <ProductManagement />
      case "services":
        return <PageManagement pageType="services" title="Manajemen Layanan" />
      case "gallery":
        return <PageManagement pageType="gallery" title="Manajemen Galeri" />
      case "customers":
        return <PageManagement pageType="customers" title="Manajemen Pelanggan" />
      case "certifications":
        return <PageManagement pageType="certifications" title="Manajemen Sertifikasi" />
      case "blog":
        return <PageManagement pageType="blog" title="Manajemen Blog" />
      case "contact":
        return <PageManagement pageType="contact" title="Manajemen Kontak" />
      case "settings":
        return <SettingsManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <AdminHeader onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
