"use client"

import { DashboardOverview } from "@/components/admin/dashboard/dashboard-overview"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Dashboard</h1>
        <p className="text-gray-600">Ringkasan sistem dan statistik</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <DashboardOverview />
      </div>
    </div>
  )
}
