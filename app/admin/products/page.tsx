"use client"

import { ProductManagement } from "@/components/admin/products/product-management"

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Manajemen Produk</h1>
        <p className="text-gray-600">Kelola produk dan katalog</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <ProductManagement />
      </div>
    </div>
  )
}
