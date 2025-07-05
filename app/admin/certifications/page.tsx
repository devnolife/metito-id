"use client"

import { PageManagement } from "@/components/admin/certifications/page-management"

export default function AdminCertificationsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Manajemen Sertifikasi</h1>
        <p className="text-gray-600">Kelola sertifikasi dan kredensial</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <PageManagement pageType="certifications" title="Manajemen Sertifikasi" />
      </div>
    </div>
  )
}
