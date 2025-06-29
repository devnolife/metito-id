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
        return <PageManagement pageType="services" title="Services Management" />
      case "gallery":
        return <PageManagement pageType="gallery" title="Gallery Management" />
      case "customers":
        return <PageManagement pageType="customers" title="Customer Management" />
      case "certifications":
        return <PageManagement pageType="certifications" title="Certification Management" />
      case "blog":
        return <PageManagement pageType="blog" title="Blog Management" />
      case "contact":
        return <PageManagement pageType="contact" title="Contact Management" />
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
