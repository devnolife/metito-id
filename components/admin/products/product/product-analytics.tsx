"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, Settings, Eye, BarChart3 } from "lucide-react"

interface Product {
  id: string
  name: string
  inStock: boolean
  isFeatured: boolean
  isActive: boolean
}

interface Category {
  id: string
  name: string
}

interface ProductAnalyticsProps {
  products: Product[]
  categories: Category[]
}

export function ProductAnalytics({ products, categories }: ProductAnalyticsProps) {
  const totalProducts = products.length
  const totalCategories = categories.length
  const featuredProducts = products.filter(p => p.isFeatured).length
  const inStockProducts = products.filter(p => p.inStock).length

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-primary-blue mb-4">Analitik Produk</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-blue">{totalProducts}</p>
                  <p className="text-gray-600 text-sm">Total Produk</p>
                </div>
                <Package className="w-8 h-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-blue">{totalCategories}</p>
                  <p className="text-gray-600 text-sm">Total Kategori</p>
                </div>
                <Settings className="w-8 h-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-blue">{featuredProducts}</p>
                  <p className="text-gray-600 text-sm">Produk Unggulan</p>
                </div>
                <Eye className="w-8 h-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-blue">{inStockProducts}</p>
                  <p className="text-gray-600 text-sm">Stok Tersedia</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
