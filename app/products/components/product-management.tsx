"use client"

import { useState } from "react"
import { ProductList } from "./product-list"
import { ProductForm } from "./product-form"
import { ProductDetail } from "./product-detail"
import { useProducts } from "../hooks/use-products"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

type ViewMode = "list" | "form" | "detail"

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
  application?: "Industrial" | "Municipal"
  features: string[]
  warranty?: string
  delivery?: string
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductFormData {
  name: string
  description: string
  shortDesc: string
  price: number
  capacity: string
  efficiency: string
  location: string
  application: "Industrial" | "Municipal" | ""
  features: string[]
  warranty: string
  delivery: string
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
}

export function ProductManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false)

  const {
    products,
    categories,
    isLoading,
    isSubmitting,
    error,
    loadProducts,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  } = useProducts()

  // Handle view product detail
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewMode("detail")
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormDialogOpen(true)
  }

  // Handle add new product
  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsFormDialogOpen(true)
  }

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId)
    if (success) {
      // If we're viewing the deleted product, go back to list
      if (selectedProduct?.id === productId && viewMode === "detail") {
        setViewMode("list")
        setSelectedProduct(null)
      }
    }
  }

  // Handle form submission
  const handleFormSubmit = async (data: ProductFormData) => {
    if (selectedProduct) {
      // Update existing product
      const updatedProduct = await updateProduct(selectedProduct.id, data)
      if (updatedProduct) {
        setIsFormDialogOpen(false)
        setSelectedProduct(null)
        // If we're in detail view, update the selected product
        if (viewMode === "detail") {
          setSelectedProduct(updatedProduct)
        }
      }
    } else {
      // Create new product
      const newProduct = await createProduct(data)
      if (newProduct) {
        setIsFormDialogOpen(false)
      }
    }
  }

  // Handle inquiry
  const handleInquiry = (product: Product) => {
    setSelectedProduct(product)
    setIsInquiryDialogOpen(true)
  }

  // Handle back to list
  const handleBackToList = () => {
    setViewMode("list")
    setSelectedProduct(null)
  }

  // Get form initial data
  const getFormInitialData = (): Partial<ProductFormData> | undefined => {
    if (!selectedProduct) return undefined

    return {
      name: selectedProduct.name,
      description: selectedProduct.description || "",
      shortDesc: selectedProduct.shortDesc || "",
      price: selectedProduct.price,
      capacity: selectedProduct.capacity || "",
      efficiency: selectedProduct.efficiency || "",
      location: selectedProduct.location || "",
      application: selectedProduct.application || "",
      features: selectedProduct.features,
      warranty: selectedProduct.warranty || "",
      delivery: selectedProduct.delivery || "",
      categoryId: selectedProduct.categoryId,
      inStock: selectedProduct.inStock,
      isFeatured: selectedProduct.isFeatured,
      metaTitle: selectedProduct.metaTitle || "",
      metaDescription: selectedProduct.metaDescription || "",
    }
  }

  // Show loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadProducts} className="bg-blue-600 hover:bg-blue-700">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== "list" && (
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {viewMode === "list" && "Manajemen Produk"}
              {viewMode === "detail" && "Detail Produk"}
              {viewMode === "form" && "Form Produk"}
            </h1>
            <p className="text-gray-600">
              {viewMode === "list" && "Kelola katalog produk pengolahan air"}
              {viewMode === "detail" && "Lihat detail produk"}
              {viewMode === "form" && "Tambah atau edit produk"}
            </p>
          </div>
        </div>

        {viewMode === "list" && (
          <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        )}
      </div>

      {/* Content */}
      {viewMode === "list" && (
        <ProductList
          products={products}
          categories={categories}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
          onAdd={handleAddProduct}
          isLoading={isLoading}
        />
      )}

      {viewMode === "detail" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={handleBackToList}
          onEdit={handleEditProduct}
          onInquiry={handleInquiry}
        />
      )}

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={getFormInitialData()}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
            isLoading={isSubmitting}
            submitLabel={selectedProduct ? "Simpan Perubahan" : "Tambah Produk"}
          />
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Minta Penawaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Anda akan diarahkan ke halaman kontak untuk mengirim permintaan penawaran untuk produk:
            </p>
            {selectedProduct && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600">{selectedProduct.category.name}</p>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsInquiryDialogOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={() => {
                  setIsInquiryDialogOpen(false)
                  // Redirect to contact page with product info
                  window.location.href = `/contact?product=${selectedProduct?.id}`
                }}
              >
                Lanjutkan ke Kontak
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
