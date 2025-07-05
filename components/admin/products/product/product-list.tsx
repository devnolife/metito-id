"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price: number
  capacity?: string
  efficiency?: string
  location?: string
  application?: 'Industrial' | 'Municipal'
  specs?: any
  features: string[]
  warranty?: string
  delivery?: string
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface ProductListProps {
  products: Product[]
  categories: Category[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductList({
  products,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onEdit,
  onDelete
}: ProductListProps) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="min-w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.isFeatured && (
                    <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                      Unggulan
                    </Badge>
                  )}
                  <Badge
                    className={`text-xs px-2 py-1 ${product.inStock
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      }`}
                  >
                    {product.inStock ? 'Tersedia' : 'Habis'}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-primary-blue line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-2xl font-bold text-green-600">
                    ${product.price.toLocaleString()}
                  </p>

                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category.name}
                    </Badge>
                  )}

                  {product.capacity && (
                    <p className="text-sm text-gray-600">
                      Kapasitas: {product.capacity}
                    </p>
                  )}

                  {product.efficiency && (
                    <p className="text-sm text-gray-600">
                      Efisiensi: {product.efficiency}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600 mb-2">
            Tidak ada produk ditemukan
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== "all"
              ? "Coba ubah filter pencarian Anda"
              : "Belum ada produk yang ditambahkan"}
          </p>
        </div>
      )}
    </div>
  )
}
