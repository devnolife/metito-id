// Export all product management components and hooks
export { useProductManagement } from './use-product-management'
export { useProductHandlers } from './use-product-handlers'
export { useFileUploadHandlers } from './use-file-upload-handlers'
export { useProductDialogHandlers } from './use-product-dialog-handlers'
export { ProductTabNavigation } from './product-tab-navigation'
export { ProductTabContent } from './product-tab-content'
export { ProductDialogs } from './product-dialogs'

// Re-export existing components
export { ProductForm } from './product-form'
export { ProductList } from './product-list'
export { CategoryManagement } from './category-management'
export { ProductAnalytics } from './product-analytics'

// Export types
export type {
  Product,
  Category,
  ProductImage,
  ProductFormData,
  CategoryFormData
} from './use-product-management'
