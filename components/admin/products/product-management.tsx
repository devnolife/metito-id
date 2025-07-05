"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Import sub-components
import { ProductAnalytics } from "./product/product-analytics"
import { ProductTabNavigation } from "./product/product-tab-navigation"
import { ProductTabContent } from "./product/product-tab-content"
import { ProductDialogs } from "./product/product-dialogs"
import { LoadingOverlay } from "./ui/loading-overlay"

// Import hooks
import { useProductManagement } from "./product/use-product-management"
import { useProductHandlers } from "./product/use-product-handlers"
import { useFileUploadHandlers } from "./product/use-file-upload-handlers"
import { useProductDialogHandlers } from "./product/use-product-dialog-handlers"

export function ProductManagement() {
  // Use our custom hooks
  const productManagement = useProductManagement()
  const {
    isAuthenticated,
    isLoading,
    isUploading,
    isSubmitting,
    isSubmittingCategory,
    isDeleting,
    loadingMessage,
    selectedImage,
    isImageModalOpen,
    activeTab,
    isEditDialogOpen,
    editingProduct,
    isDeleteDialogOpen,
    productToDelete,
    isDeleteCategoryDialogOpen,
    categoryToDelete,
    products,
    categories,
    searchTerm,
    selectedCategory,
    productImages,
    formData,
    setSearchTerm,
    setSelectedCategory,
    setActiveTab,
    setFormData,
    handleAuthError,
    resetForm,
    loadProducts,
    loadCategories,
    ...managementRest
  } = productManagement

  // Product handlers
  const productHandlers = useProductHandlers({
    formData,
    productImages,
    editingProduct,
    isSubmitting,
    handleAuthError,
    resetForm,
    loadProducts,
    loadCategories,
    setActiveTab,
    ...managementRest
  })

  // File upload handlers
  const fileUploadHandlers = useFileUploadHandlers({
    setIsUploading: managementRest.setIsUploading,
    setIsAuthenticated: managementRest.setIsAuthenticated,
    setProductImages: managementRest.setProductImages,
    setSelectedImage: managementRest.setSelectedImage,
    setIsImageModalOpen: managementRest.setIsImageModalOpen,
  })

  // Dialog handlers
  const dialogHandlers = useProductDialogHandlers({
    setEditingProduct: managementRest.setEditingProduct,
    setFormData,
    setProductImages: managementRest.setProductImages,
    setIsEditDialogOpen: managementRest.setIsEditDialogOpen,
    resetForm,
    setActiveTab,
  })

  // Show loading state until authentication is complete
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Show authentication error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-primary-blue mb-2">Akses Ditolak</h3>
          <p className="text-gray-600 mb-4">Anda memerlukan akses admin untuk melihat halaman ini</p>
          <Button
            onClick={() => window.location.href = '/admin'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login Admin
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoadingOverlay
        isLoading={isDeleting || (isSubmitting && !isUploading)}
        message={loadingMessage || (isSubmitting ? "Memproses data produk..." : "Memproses...")}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary-blue">Manajemen Produk</h2>
            <p className="text-gray-600">Kelola katalog produk pengolahan air Anda</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={dialogHandlers.handleTambahProdukClick}
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>

        {/* Analytics Section - Always Visible Above Tabs */}
        <ProductAnalytics products={products} categories={categories} />

        {/* Tab Navigation */}
        <ProductTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <ProductTabContent
          activeTab={activeTab}
          products={products}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onEdit={dialogHandlers.openEditDialog}
          onDelete={(id: string) => {
            const product = products.find(p => p.id === id)
            if (product) {
              productHandlers.openDeleteDialog(product)
            }
          }}
          formData={formData}
          setFormData={setFormData}
          productImages={productImages}
          handleFileUpload={fileUploadHandlers.handleFileUpload}
          handleImageDelete={fileUploadHandlers.handleImageDelete}
          handleImageClick={fileUploadHandlers.handleImageClick}
          handleAddProduct={productHandlers.handleAddProduct}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          handleAddCategory={productHandlers.handleAddCategory}
          handleEditCategory={productHandlers.handleEditCategory}
          handleDeleteCategory={async (id: string) => {
            const category = categories.find(c => c.id === id)
            if (category) {
              productHandlers.openDeleteCategoryDialog(category)
            }
          }}
          isSubmittingCategory={isSubmittingCategory}
        />

        {/* Dialogs */}
        <ProductDialogs
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={managementRest.setIsEditDialogOpen}
          isImageModalOpen={isImageModalOpen}
          setIsImageModalOpen={managementRest.setIsImageModalOpen}
          selectedImage={selectedImage}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={managementRest.setIsDeleteDialogOpen}
          productToDelete={productToDelete}
          isDeleteCategoryDialogOpen={isDeleteCategoryDialogOpen}
          setIsDeleteCategoryDialogOpen={managementRest.setIsDeleteCategoryDialogOpen}
          categoryToDelete={categoryToDelete}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          productImages={productImages}
          handleFileUpload={fileUploadHandlers.handleFileUpload}
          handleImageDelete={fileUploadHandlers.handleImageDelete}
          handleImageClick={fileUploadHandlers.handleImageClick}
          handleEditProduct={productHandlers.handleEditProduct}
          handleDeleteProduct={productHandlers.handleDeleteProduct}
          handleDeleteCategory={productHandlers.handleDeleteCategory}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
        />
      </div>
    </>
  )
}
