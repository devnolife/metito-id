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
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex flex-col h-full">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
