"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/shared/admin-sidebar"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AdminLayoutWrapper({ children, title, description }: AdminLayoutWrapperProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="admin-theme admin-shell flex h-screen">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex flex-col h-full">
          <div className="border-b border-hairline bg-navy/85 backdrop-blur-md px-6 py-4">
            <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">{title}</h1>
            <p className="text-sm text-body-muted">{description}</p>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
