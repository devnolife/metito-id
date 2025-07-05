"use client"

import { SettingsManagement } from "@/components/admin/settings/settings-management"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Pengaturan</h1>
        <p className="text-gray-600">Kelola pengaturan sistem dan konfigurasi</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <SettingsManagement />
      </div>
    </div>
  )
}
