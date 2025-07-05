"use client"

import { PageManagement } from "@/components/admin/services/page-management"

export default function AdminServicesPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Manajemen Layanan</h1>
        <p className="text-gray-600">Kelola layanan dan solusi teknik</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <PageManagement pageType="services" title="Manajemen Layanan" />
      </div>
    </div>
  )
}
