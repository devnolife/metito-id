import { toast } from "sonner"
import { ProductFormData, CategoryFormData, Product, ProductImage, Category } from "./use-product-management"

interface ProductHandlersProps {
  formData: ProductFormData
  productImages: ProductImage[]
  editingProduct: Product | null
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  setIsSubmittingCategory: (value: boolean) => void
  setIsDeleting: (value: boolean) => void
  setLoadingMessage: (value: string) => void
  setIsEditDialogOpen: (value: boolean) => void
  setEditingProduct: (value: Product | null) => void
  setIsDeleteDialogOpen: (value: boolean) => void
  setProductToDelete: (value: Product | null) => void
  setIsDeleteCategoryDialogOpen: (value: boolean) => void
  setCategoryToDelete: (value: Category | null) => void
  setIsAuthenticated: (value: boolean) => void
  handleAuthError: (response: Response, errorData: any) => Promise<boolean>
  resetForm: () => void
  loadProducts: () => Promise<void>
  loadCategories: () => Promise<void>
  setActiveTab: (tab: string) => void
}

export function useProductHandlers({
  formData,
  productImages,
  editingProduct,
  isSubmitting,
  setIsSubmitting,
  setIsSubmittingCategory,
  setIsDeleting,
  setLoadingMessage,
  setIsEditDialogOpen,
  setEditingProduct,
  setIsDeleteDialogOpen,
  setProductToDelete,
  setIsDeleteCategoryDialogOpen,
  setCategoryToDelete,
  setIsAuthenticated,
  handleAuthError,
  resetForm,
  loadProducts,
  loadCategories,
  setActiveTab,
}: ProductHandlersProps) {

  const handleAddProduct = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error("Nama produk wajib diisi")
        return
      }
      if (!formData.categoryId) {
        toast.error("Kategori wajib dipilih")
        return
      }
      if (!formData.price.trim()) {
        toast.error("Harga wajib diisi")
        return
      }

      // Show loading toast
      const loadingToast = toast.loading("Menambahkan produk...")

      // Validate specs field if provided
      let specsData = undefined
      if (formData.specs && formData.specs.trim()) {
        try {
          specsData = JSON.parse(formData.specs)
        } catch (error) {
          toast.dismiss(loadingToast)
          toast.error("Format specifications tidak valid. Gunakan format JSON yang benar, contoh: {\"tekanan\": \"1000 PSI\"}")
          return
        }
      }

      const productData = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        application: formData.application || undefined,
        capacity: formData.capacity || undefined,
        efficiency: formData.efficiency || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined,
        shortDesc: formData.shortDesc || undefined,
        specs: specsData,
        features: formData.features ? formData.features.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        warranty: formData.warranty || undefined,
        delivery: formData.delivery || undefined,
        images: productImages.map(img => img.url),
        documents: [],
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      })

      toast.dismiss(loadingToast)

      if (response.ok) {
        const result = await response.json()
        toast.success("Produk berhasil ditambahkan!")
        resetForm()
        await loadProducts()
        setActiveTab("products")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))

        // Handle specific error codes
        if (await handleAuthError(response, errorData)) {
          // Handled by handleAuthError
        } else if (response.status === 403) {
          toast.error("Akses admin diperlukan")
        } else if (response.status === 422) {
          toast.error("Data produk tidak valid: " + (errorData.message || "Periksa kembali form"))
        } else {
          toast.error(errorData.message || "Gagal menambahkan produk")
        }
      }
    } catch (error) {
      console.error('Add product error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error("Nama produk wajib diisi")
        return
      }
      if (!formData.categoryId) {
        toast.error("Kategori wajib dipilih")
        return
      }
      if (!formData.price.trim()) {
        toast.error("Harga wajib diisi")
        return
      }

      // Show loading toast
      const loadingToast = toast.loading("Memperbarui produk...")

      // Validate specs field if provided
      let specsData = undefined
      if (formData.specs && formData.specs.trim()) {
        try {
          specsData = JSON.parse(formData.specs)
        } catch (error) {
          toast.dismiss(loadingToast)
          toast.error("Format specifications tidak valid. Gunakan format JSON yang benar, contoh: {\"tekanan\": \"1000 PSI\"}")
          return
        }
      }

      const productData = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        application: formData.application || undefined,
        capacity: formData.capacity || undefined,
        efficiency: formData.efficiency || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined,
        shortDesc: formData.shortDesc || undefined,
        specs: specsData,
        features: formData.features ? formData.features.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        warranty: formData.warranty || undefined,
        delivery: formData.delivery || undefined,
        images: productImages.map(img => img.url),
        documents: [],
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
      }

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      })

      toast.dismiss(loadingToast)

      if (response.ok) {
        toast.success("Produk berhasil diperbarui!")
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        resetForm()
        await loadProducts()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))

        // Handle specific error codes
        if (await handleAuthError(response, errorData)) {
          // Handled by handleAuthError
        } else if (response.status === 403) {
          toast.error("Akses admin diperlukan")
        } else if (response.status === 422) {
          toast.error("Data produk tidak valid: " + (errorData.message || "Periksa kembali form"))
        } else {
          toast.error(errorData.message || "Gagal memperbarui produk")
        }
      }
    } catch (error) {
      console.error('Update product error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const openDeleteCategoryDialog = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteCategoryDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(true)
    setLoadingMessage("Menghapus produk...")

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success("Produk berhasil dihapus!")
        setIsDeleteDialogOpen(false)
        setProductToDelete(null)
        await loadProducts()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))

        if (await handleAuthError(response, errorData)) {
          // Handled by handleAuthError
        } else if (response.status === 403) {
          toast.error("Akses admin diperlukan")
        } else if (response.status === 404) {
          toast.error("Produk tidak ditemukan")
        } else {
          toast.error(errorData.message || "Gagal menghapus produk")
        }
      }
    } catch (error) {
      console.error('Delete product error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    } finally {
      setIsDeleting(false)
      setLoadingMessage("")
    }
  }

  const handleAddCategory = async (categoryData: CategoryFormData) => {
    setIsSubmittingCategory(true)

    // Show loading toast
    const loadingToast = toast.loading("Menambahkan kategori...")

    try {
      const requestBody = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || undefined,
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      toast.dismiss(loadingToast)

      if (response.ok) {
        const result = await response.json()
        toast.success("Kategori berhasil ditambahkan!")
        await loadCategories()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))

        // Handle authentication errors first
        const isAuthError = await handleAuthError(response, errorData)
        if (isAuthError) {
          return // Exit early if it's an auth error
        }

        if (response.status === 403) {
          toast.error("Akses admin diperlukan")
        } else if (response.status === 409) {
          toast.error("Kategori dengan nama ini sudah ada")
        } else if (response.status === 422) {
          toast.error("Data kategori tidak valid: " + (errorData.message || "Periksa kembali form"))
        } else {
          toast.error(errorData.message || "Gagal menambahkan kategori")
        }
      }
    } catch (error) {
      if (loadingToast) toast.dismiss(loadingToast)
      console.error('Add category error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  const handleEditCategory = async (id: string, categoryData: CategoryFormData) => {
    setIsSubmittingCategory(true)

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: categoryData.name,
          description: categoryData.description,
        }),
      })

      if (response.ok) {
        toast.success("Kategori berhasil diperbarui")
        await loadCategories()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))
        toast.error(errorData.message || "Gagal memperbarui kategori")
      }
    } catch (error) {
      console.error('Update category error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    setIsDeleting(true)
    setLoadingMessage("Menghapus kategori...")

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success("Kategori berhasil dihapus")
        setIsDeleteCategoryDialogOpen(false)
        setCategoryToDelete(null)
        await loadCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Gagal menghapus kategori")
      }
    } catch (error) {
      console.error('Delete category error:', error)
      toast.error("Gagal menghapus kategori")
    } finally {
      setIsDeleting(false)
      setLoadingMessage("")
    }
  }

  return {
    handleAddProduct,
    handleEditProduct,
    openDeleteDialog,
    handleDeleteProduct,
    handleAddCategory,
    handleEditCategory,
    openDeleteCategoryDialog,
    handleDeleteCategory,
  }
}
