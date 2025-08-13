"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "./hooks/use-products"
import { useCategories } from "./hooks/use-categories"
import { ProductList } from "./components/product-list"
import { ProductDialogs } from "./components/product-dialogs"
import { ProductFormDialog } from "./components/product-form-dialog"
import { Plus, Package, Search, TrendingUp, ShoppingCart, DollarSign, Filter } from "lucide-react"
import { Product } from "./types/product"

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<string>("all")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)

  // Dialog states
  const [viewDialog, setViewDialog] = useState<{
    open: boolean
    product: Product | null
  }>({
    open: false,
    product: null
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    productId: string | null
    productName: string | null
  }>({
    open: false,
    productId: null,
    productName: null
  })

  const [deleteLoading, setDeleteLoading] = useState(false)

  const { toast } = useToast()

  // Build filters for products hook
  const filters = {
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    application: selectedApplication !== "all" ? selectedApplication : undefined,
    inStock: showOnlyInStock ? true : undefined,
    featured: showOnlyFeatured ? true : undefined,
    page: 1,
    limit: 12
  }

  const {
    products,
    loading: productsLoading,
    pagination,
    updateFilters,
    deleteProduct,
    fetchProducts
  } = useProducts(filters)

  const { categories, loading: categoriesLoading } = useCategories()

  // Filter handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value || undefined, page: 1 })
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    updateFilters({
      category: categoryId !== "all" ? categoryId : undefined,
      page: 1
    })
  }

  const handleApplicationChange = (application: string) => {
    setSelectedApplication(application)
    updateFilters({
      application: application !== "all" ? application : undefined,
      page: 1
    })
  }

  const handleStockFilter = (inStock: boolean) => {
    setShowOnlyInStock(inStock)
    updateFilters({
      inStock: inStock ? true : undefined,
      page: 1
    })
  }

  const handleFeaturedFilter = (featured: boolean) => {
    setShowOnlyFeatured(featured)
    updateFilters({
      featured: featured ? true : undefined,
      page: 1
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedApplication("all")
    setShowOnlyInStock(false)
    setShowOnlyFeatured(false)
    updateFilters({ page: 1, limit: 12 })
  }

  // Product handlers
  const handleView = (product: Product) => {
    setViewDialog({
      open: true,
      product
    })
  }

  const handleEdit = (product: Product) => {
    toast({
      title: "Coming Soon",
      description: "Fitur edit produk akan segera hadir"
    })
  }

  const handleDelete = (productId: string) => {
    const product = products.find(p => p.id === productId)
    setDeleteDialog({
      open: true,
      productId,
      productName: product?.name || null
    })
  }

  const handleDeleteConfirm = async (productId: string) => {
    try {
      setDeleteLoading(true)
      await deleteProduct(productId)
      setDeleteDialog({
        open: false,
        productId: null,
        productName: null
      })
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate statistics
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.inStock ? 1 : 0)), 0)
  const activeProducts = products.filter(p => p.isActive).length
  const featuredProducts = products.filter(p => p.isFeatured).length
  const inStockProducts = products.filter(p => p.inStock).length

  if (productsLoading && products.length === 0) {
    return (
      <LoadingOverlay
        message="Memuat data produk..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600">Kelola katalog produk pengolahan air Anda</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => toast({ title: "Coming Soon", description: "Fitur tambah produk akan segera hadir" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">Produk aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Kategori produk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Tersedia</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">Unit tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Total nilai produk</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={categoriesLoading}
          >
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedApplication}
            onChange={(e) => handleApplicationChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Aplikasi</option>
            <option value="Industrial">Industrial</option>
            <option value="Municipal">Municipal</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showOnlyInStock}
                onChange={(e) => handleStockFilter(e.target.checked)}
                className="rounded"
              />
              Tersedia
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showOnlyFeatured}
                onChange={(e) => handleFeaturedFilter(e.target.checked)}
                className="rounded"
              />
              Unggulan
            </label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="whitespace-nowrap"
          >
            <Filter className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        loading={productsLoading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onPageChange={handlePageChange}
      />

      {/* Dialogs */}
      <ProductDialogs
        viewDialog={viewDialog}
        onViewClose={() => setViewDialog({ open: false, product: null })}
        deleteDialog={deleteDialog}
        onDeleteClose={() => setDeleteDialog({ open: false, productId: null, productName: null })}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
      />
    </div>
  )
}
