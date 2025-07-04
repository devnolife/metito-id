import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price: number
  capacity?: string
  efficiency?: string
  location?: string
  application?: 'Industrial' | 'Municipal'
  specs?: any
  features: string[]
  warranty?: string
  delivery?: string
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ProductImage {
  id: string
  url: string
  fileName: string
}

export interface ProductFormData {
  name: string
  categoryId: string
  price: string
  application: string
  capacity: string
  efficiency: string
  location: string
  specs: string
  description: string
  shortDesc: string
  features: string
  warranty: string
  delivery: string
  inStock: boolean
  isFeatured: boolean
}

export interface CategoryFormData {
  name: string
  description: string
}

export function useProductManagement() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Loading states
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  // UI state
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [productImages, setProductImages] = useState<ProductImage[]>([])

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryId: "",
    price: "",
    application: "",
    capacity: "",
    efficiency: "",
    location: "",
    specs: "",
    description: "",
    shortDesc: "",
    features: "",
    warranty: "",
    delivery: "",
    inStock: true,
    isFeatured: false,
  })

  // Utility function to handle authentication errors
  const handleAuthError = useCallback(async (response: Response, errorData: any) => {
    if (response.status === 401) {
      // Token expired or invalid - clear session and redirect to login
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (logoutError) {
        console.error('Logout error:', logoutError)
      }

      setIsAuthenticated(false)
      toast.error("Sesi telah berakhir, silakan login kembali")

      // Redirect to admin login page
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
      }
      return true
    }
    return false
  }, [])

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data?.products || [])
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))
        console.error('Failed to load products, status:', response.status)

        // Handle authentication errors first
        const isAuthError = await handleAuthError(response, errorData)
        if (isAuthError) {
          return // Exit early if it's an auth error
        }

        toast.error('Gagal memuat data produk')
      }
    } catch (error) {
      console.error('Load products error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah saat memuat produk")
      } else {
        toast.error('Gagal memuat data produk')
      }
    }
  }, [handleAuthError])

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))
        console.error('Failed to load categories, status:', response.status)

        // Handle authentication errors first
        const isAuthError = await handleAuthError(response, errorData)
        if (isAuthError) {
          return // Exit early if it's an auth error
        }

        toast.error('Gagal memuat data kategori')
      }
    } catch (error) {
      console.error('Load categories error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah saat memuat kategori")
      } else {
        toast.error('Gagal memuat data kategori')
      }
    }
  }, [handleAuthError])

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      categoryId: "",
      price: "",
      application: "",
      capacity: "",
      efficiency: "",
      location: "",
      specs: "",
      description: "",
      shortDesc: "",
      features: "",
      warranty: "",
      delivery: "",
      inStock: true,
      isFeatured: false,
    })
    setProductImages([])
  }, [])

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (authResponse.ok) {
          const authData = await authResponse.json()
          if (authData.success && authData.data?.role === 'ADMIN') {
            setIsAuthenticated(true)
            await loadCategories()
            await loadProducts()
          } else {
            toast.error('Memerlukan akses admin')
            setIsAuthenticated(false)
          }
        } else {
          toast.error('Memerlukan autentikasi')
          setIsAuthenticated(false)
        }
      } catch (error) {
        toast.error('Gagal menginisialisasi data')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [loadCategories, loadProducts])

  return {
    // State
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

    // Setters
    setIsAuthenticated,
    setIsUploading,
    setIsSubmitting,
    setIsSubmittingCategory,
    setIsDeleting,
    setLoadingMessage,
    setSelectedImage,
    setIsImageModalOpen,
    setActiveTab,
    setIsEditDialogOpen,
    setEditingProduct,
    setIsDeleteDialogOpen,
    setProductToDelete,
    setIsDeleteCategoryDialogOpen,
    setCategoryToDelete,
    setProducts,
    setSearchTerm,
    setSelectedCategory,
    setProductImages,
    setFormData,

    // Functions
    handleAuthError,
    loadProducts,
    loadCategories,
    resetForm,
  }
}
