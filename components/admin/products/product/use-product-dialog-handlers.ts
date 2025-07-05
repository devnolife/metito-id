import { useCallback } from "react"
import { Product, ProductImage, ProductFormData } from "./use-product-management"

interface ProductDialogHandlersProps {
  setEditingProduct: (product: Product | null) => void
  setFormData: (data: ProductFormData | ((prev: ProductFormData) => ProductFormData)) => void
  setProductImages: (images: ProductImage[]) => void
  setIsEditDialogOpen: (value: boolean) => void
  resetForm: () => void
  setActiveTab: (tab: string) => void
}

export function useProductDialogHandlers({
  setEditingProduct,
  setFormData,
  setProductImages,
  setIsEditDialogOpen,
  resetForm,
  setActiveTab,
}: ProductDialogHandlersProps) {

  const openEditDialog = useCallback((product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      application: product.application || "",
      capacity: product.capacity || "",
      efficiency: product.efficiency || "",
      location: product.location || "",
      description: product.description || "",
      shortDesc: product.shortDesc || "",
      specs: product.specs ? JSON.stringify(product.specs) : "",
      features: product.features.join(", "),
      warranty: product.warranty || "",
      delivery: product.delivery || "",
      inStock: product.inStock,
      isFeatured: product.isFeatured,
    })

    // Convert existing product images to ProductImage format for display
    if (product.images && product.images.length > 0) {
      const existingImages: ProductImage[] = product.images.map((url, index) => ({
        id: `existing-${product.id}-${index}`,
        url: url.startsWith('/') ? url : `/${url}`,
        fileName: `Image ${index + 1}`
      }))
      setProductImages(existingImages)
    } else {
      setProductImages([])
    }

    setIsEditDialogOpen(true)
  }, [setEditingProduct, setFormData, setProductImages, setIsEditDialogOpen])

  const handleTambahProdukClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    resetForm()
    setActiveTab("add")
  }, [resetForm, setActiveTab])

  return {
    openEditDialog,
    handleTambahProdukClick,
  }
}
