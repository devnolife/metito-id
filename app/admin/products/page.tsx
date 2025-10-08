"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/components/admin/products/hooks/use-products"
import { useCategories } from "@/components/admin/products/hooks/use-categories"
import { ProductList } from "@/components/admin/products/components/product-list"
import { ProductDialogs } from "@/components/admin/products/components/product-dialogs"
import { ProductStats } from "@/components/admin/products/components/product-stats"
import { ProductFilters } from "@/components/admin/products/components/product-filters"
import { CategoryManagement } from "@/components/admin/products/components/category-management"
import { ProductCreateForm } from "@/components/admin/products/components/product-create-form"
import { Plus, Package, Tag, BarChart3, Filter } from "lucide-react"
import { Product } from "@/components/admin/products/types/product"

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<string>("all")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Dialog states
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

  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()

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
    // Redirect ke halaman detail produk
    window.location.href = `/admin/products/${product.id}`
  }

  const handleEdit = (product: Product) => {
    // Redirect ke halaman edit produk
    window.location.href = `/admin/products/${product.id}/edit`
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

  const handleCreateSuccess = () => {
    setShowCreateDialog(false)
    fetchProducts()
    toast({
      title: "Berhasil",
      description: "Produk berhasil ditambahkan"
    })
  }

  // Calculate statistics
  const totalValue = products.reduce((sum, p) => {
    // Try to parse price as number, otherwise skip it
    const priceNum = p.price ? parseFloat(p.price.replace(/[^\d.-]/g, '')) : 0
    return sum + (isNaN(priceNum) ? 0 : priceNum * (p.inStock ? 1 : 0))
  }, 0)
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen Produk</h1>
                <p className="text-gray-600 mt-1">Kelola katalog produk pengolahan air Anda</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-fit">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader className="flex-shrink-0 border-b pb-4">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Package className="w-5 h-5" />
                      Tambah Produk Baru
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-1">
                    <ProductCreateForm
                      categories={categories}
                      onSuccess={handleCreateSuccess}
                      onCancel={() => setShowCreateDialog(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-700" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Statistik Produk</h2>
          </div>
          <ProductStats
            activeProducts={activeProducts}
            categoriesCount={categories.length}
            inStockProducts={inStockProducts}
            totalValue={totalValue}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Tabs defaultValue="products" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 m-4 sm:m-6 mb-0">
                <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Package className="w-4 h-4" />
                  Produk
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Tag className="w-4 h-4" />
                  Kategori
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="products" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Filters Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                </div>
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <ProductFilters
                      searchTerm={searchTerm}
                      selectedCategory={selectedCategory}
                      selectedApplication={selectedApplication}
                      showOnlyInStock={showOnlyInStock}
                      showOnlyFeatured={showOnlyFeatured}
                      categories={categories}
                      categoriesLoading={categoriesLoading}
                      onSearch={handleSearch}
                      onCategoryChange={handleCategoryChange}
                      onApplicationChange={handleApplicationChange}
                      onStockFilter={handleStockFilter}
                      onFeaturedFilter={handleFeaturedFilter}
                      onReset={resetFilters}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Product List Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daftar Produk</h3>
                  <div className="text-sm text-gray-500">
                    {pagination.total > 0 && `${pagination.total} produk ditemukan`}
                  </div>
                </div>
                <ProductList
                  products={products}
                  loading={productsLoading}
                  pagination={pagination}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onPageChange={handlePageChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Manajemen Kategori</h3>
                <CategoryManagement
                  categories={categories}
                  onCategoryChange={fetchCategories}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

      {/* Dialogs */}
      <ProductDialogs
        deleteDialog={deleteDialog}
        onDeleteClose={() => setDeleteDialog({ open: false, productId: null, productName: null })}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
      />
    </div>
  )
}
