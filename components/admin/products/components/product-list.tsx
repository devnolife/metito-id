"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Edit, Trash2, Eye, Package } from "lucide-react"
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
              <p className="mt-2 text-sm text-gray-500">Memuat produk...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada produk</h3>
            <p className="mt-1 text-sm text-gray-500">
              Mulai dengan menambahkan produk pertama Anda
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          {product.isFeatured && (
                            <Badge variant="default" className="text-xs">
                              Unggulan
                            </Badge>
                          )}
                        </div>
                        {product.shortDesc && (
                          <span className="text-sm text-gray-500 mt-1">
                            {product.shortDesc.length > 50
                              ? `${product.shortDesc.substring(0, 50)}...`
                              : product.shortDesc
                            }
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className="w-fit"
                        >
                          {product.inStock ? "Tersedia" : "Habis"}
                        </Badge>
                        <Badge
                          variant={product.isActive ? "default" : "destructive"}
                          className="w-fit"
                        >
                          {product.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} produk
          </div>

          <Pagination>
            <PaginationContent>
              {pagination.hasPrev && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pagination.page - 1)}
                    className="cursor-pointer"
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
                      className="cursor-pointer"
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
                    className="cursor-pointer"
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
