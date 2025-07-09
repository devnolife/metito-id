"use client"

import { SidebarLayout } from "@/components/sidebar-layout"
import { ProductManagement } from "./components/product-management"

export default function ProductsPage() {
  return (
    <SidebarLayout
      title="Produk Pengolahan Air"
      description="Temukan solusi lengkap pengolahan air untuk kebutuhan industri dan municipal. Produk berkualitas tinggi dengan teknologi terdepan."
    >
      <ProductManagement />
    </SidebarLayout>
  )
}
