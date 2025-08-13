"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2, Eye, Package, Star, CheckCircle, XCircle } from "lucide-react"
import { Product } from "../types/product"

interface ProductListProps {
  products: Product[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onView: (product: Product) => void
  onPageChange: (page: number) => void
}

export function ProductList({
  products,
  loading,
  pagination,
  onEdit,
  onDelete,
  onView,
  onPageChange
}: ProductListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
                <p className="mt-2 text-sm text-gray-500">Memuat produk...</p>
              </div>
            </div>
            {/* Loading skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Tidak ada produk ditemukan</h3>
            <p className="mt-2 text-sm text-gray-500">
              Coba ubah filter pencarian atau tambahkan produk baru
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900 py-4">Produk</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Kategori</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Harga</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Dibuat</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 truncate">{product.name}</span>
                            {product.isFeatured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                <Star className="w-3 h-3 mr-1" />
                                Unggulan
                              </Badge>
                            )}
                          </div>
                          {product.shortDesc && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.shortDesc.length > 60
                                ? `${product.shortDesc.substring(0, 60)}...`
                                : product.shortDesc
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className={`w-fit ${product.inStock
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                            }`}
                        >
                          {product.inStock ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {product.inStock ? "Tersedia" : "Habis"}
                        </Badge>
                        <Badge
                          variant={product.isActive ? "default" : "destructive"}
                          className={`w-fit ${product.isActive
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                        >
                          {product.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(product)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border-0 shadow-sm p-4">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> - <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari <span className="font-semibold">{pagination.total}</span> produk
          </div>

          <Pagination>
            <PaginationContent>
              {pagination.hasPrev && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pagination.page - 1)}
                    className="cursor-pointer hover:bg-gray-50"
                  />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = pagination.page - 2 + i
                if (pageNum < 1 || pageNum > pagination.totalPages) return null

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onPageChange(pageNum)}
                      isActive={pageNum === pagination.page}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {pagination.hasNext && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(pagination.page + 1)}
                    className="cursor-pointer hover:bg-gray-50"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
} 
