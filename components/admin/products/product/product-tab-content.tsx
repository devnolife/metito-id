import ProductForm from "./product-form"
import { ProductList } from "./product-list"
import { CategoryManagement } from "./category-management"
import { Product, Category, ProductFormData, ProductImage, CategoryFormData } from "./use-product-management"

interface ProductTabContentProps {
  activeTab: string

  // Products tab props
  products: Product[]
  categories: Category[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void

  // Add product tab props
  formData: ProductFormData
  setFormData: (data: ProductFormData | ((prev: ProductFormData) => ProductFormData)) => void
  productImages: ProductImage[]
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete: () => void
  handleImageClick: (image: ProductImage) => void
  handleAddProduct: () => void
  isUploading: boolean
  isSubmitting: boolean

  // Categories tab props
  handleAddCategory: (categoryData: CategoryFormData) => Promise<void>
  handleEditCategory: (id: string, categoryData: CategoryFormData) => Promise<void>
  handleDeleteCategory: (id: string) => Promise<void>
  isSubmittingCategory: boolean
}

export function ProductTabContent({
  activeTab,
  products,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onEdit,
  onDelete,
  formData,
  setFormData,
  productImages,
  handleFileUpload,
  handleImageDelete,
  handleImageClick,
  handleAddProduct,
  isUploading,
  isSubmitting,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
  isSubmittingCategory,
}: ProductTabContentProps) {
  return (
    <div className="mt-6">
      {activeTab === "products" && (
        <ProductList
          products={products}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {activeTab === "add" && (
        <div className="max-w-4xl">
          <h3 className="text-xl font-bold text-primary-blue mb-6">Tambah Produk Baru</h3>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            productImages={productImages}
            handleFileUpload={handleFileUpload}
            handleImageDelete={handleImageDelete}
            handleImageClick={handleImageClick}
            isUploading={isUploading}
            isSubmitting={isSubmitting}
            onSubmit={handleAddProduct}
            submitLabel="Tambah Produk"
          />
        </div>
      )}

      {activeTab === "categories" && (
        <CategoryManagement
          categories={categories}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          isSubmitting={isSubmittingCategory}
        />
      )}
    </div>
  )
}
