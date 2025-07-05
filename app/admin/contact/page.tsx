"use client"

import { PageManagement } from "@/components/admin/contact/page-management"

export default function AdminContactPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Manajemen Kontak</h1>
        <p className="text-gray-600">Kelola pesan dan permintaan kontak</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <PageManagement pageType="contact" title="Manajemen Kontak" />
      </div>
    </div>
  )
}
