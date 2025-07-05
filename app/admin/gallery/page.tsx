"use client"

import { PageManagement } from "@/components/admin/gallery/page-management"

export default function AdminGalleryPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Manajemen Galeri</h1>
        <p className="text-gray-600">Kelola galeri foto dan dokumentasi</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <PageManagement pageType="gallery" title="Manajemen Galeri" />
      </div>
    </div>
  )
}
