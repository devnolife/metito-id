"use client"

import { Button } from "@/components/legacy-ui/button"
import { Card, CardContent } from "@/components/legacy-ui/card"
import { Badge } from "@/components/legacy-ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/legacy-ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/legacy-ui/pagination"
import { Skeleton } from "@/components/legacy-ui/skeleton"
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
  const formatCurrency = (amount?: string | number) => {
    if (!amount) return 'Hubungi Kami'

    // If already a string, return as is
    if (typeof amount === 'string') {
      // Try to parse as number
      const numValue = parseFloat(amount.replace(/[^\d.-]/g, ''))
      if (isNaN(numValue)) {
        // If not a number, return the string as-is
        return amount
      }
      // Format as currency
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(numValue)
    }

    // If it's a number, format directly
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
                <Package className="mx-auto h-12 w-12 text-body-muted animate-pulse" />
                <p className="mt-2 text-sm text-body-muted">Memuat produk...</p>
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
            <Package className="mx-auto h-16 w-16 text-body-muted" />
            <h3 className="mt-4 text-lg font-semibold text-white">Tidak ada produk ditemukan</h3>
            <p className="mt-2 text-sm text-body-muted">
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
              <TableHeader className="bg-navy-deep">
                <TableRow className="hover:bg-surface-2">
                  <TableHead className="font-semibold text-white py-4">Produk</TableHead>
                  <TableHead className="font-semibold text-white py-4">Kategori</TableHead>
                  <TableHead className="font-semibold text-white py-4">Harga</TableHead>
                  <TableHead className="font-semibold text-white py-4">Status</TableHead>
                  <TableHead className="font-semibold text-white py-4">Dibuat</TableHead>
                  <TableHead className="font-semibold text-white py-4 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-surface-2/60 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white truncate">{product.name}</span>
                            {product.isFeatured && (
                              <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/30">
                                <Star className="w-3 h-3 mr-1" />
                                Unggulan
                              </Badge>
                            )}
                          </div>
                          {product.shortDesc && (
                            <p className="text-sm text-body-text line-clamp-2">
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
                      <Badge variant="outline" className="bg-navy-deep text-body-text border-hairline">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-white">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className={`w-fit ${product.inStock
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-red-500/10 text-red-300 border-red-500/30"
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
                              ? "bg-gold/10 text-gold border-gold/40"
                              : "bg-surface-2 text-white border-hairline"
                            }`}
                        >
                          {product.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-body-text">
                        {formatDate(product.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(product)}
                          className="h-8 w-8 p-0 hover:bg-gold/15 hover:text-gold-bright"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="h-8 w-8 p-0 hover:bg-gold/15 hover:text-gold-bright"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-200"
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
        <div className="flex items-center justify-between bg-surface rounded-lg border-0 shadow-sm p-4">
          <div className="text-sm text-body-text">
            Menampilkan <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> - <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari <span className="font-semibold">{pagination.total}</span> produk
          </div>

          <Pagination>
            <PaginationContent>
              {pagination.hasPrev && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pagination.page - 1)}
                    className="cursor-pointer hover:bg-surface-2"
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
                      className="cursor-pointer hover:bg-surface-2"
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
                    className="cursor-pointer hover:bg-surface-2"
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
