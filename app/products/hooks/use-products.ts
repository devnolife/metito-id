"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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

interface Category {
  id: string
  name: string
  slug: string
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

interface UseProductsReturn {
  // State
  products: Product[]
  categories: Category[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null

  // Actions
  loadProducts: () => Promise<void>
  loadCategories: () => Promise<void>
  createProduct: (data: ProductFormData) => Promise<Product | null>
  updateProduct: (id: string, data: ProductFormData) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  getProduct: (id: string) => Promise<Product | null>
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load products
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      if (data.success) {
        setProducts(data.data.products || [])
      } else {
        throw new Error(data.message || 'Failed to fetch products')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch categories')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      toast.error(errorMessage)
    }
  }, [])

  // Create product
  const createProduct = useCallback(async (data: ProductFormData): Promise<Product | null> => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product')
      }

      if (result.success) {
        const newProduct = result.data
        setProducts(prev => [newProduct, ...prev])
        toast.success('Produk berhasil dibuat')
        return newProduct
      } else {
        throw new Error(result.message || 'Failed to create product')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  // Update product
  const updateProduct = useCallback(async (id: string, data: ProductFormData): Promise<Product | null> => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update product')
      }

      if (result.success) {
        const updatedProduct = result.data
        setProducts(prev => prev.map(product =>
          product.id === id ? updatedProduct : product
        ))
        toast.success('Produk berhasil diperbarui')
        return updatedProduct
      } else {
        throw new Error(result.message || 'Failed to update product')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete product')
      }

      if (result.success) {
        setProducts(prev => prev.filter(product => product.id !== id))
        toast.success('Produk berhasil dihapus')
        return true
      } else {
        throw new Error(result.message || 'Failed to delete product')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  // Get single product
  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch product')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
      toast.error(errorMessage)
      return null
    }
  }, [])

  // Load initial data
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [loadProducts, loadCategories])

  return {
    // State
    products,
    categories,
    isLoading,
    isSubmitting,
    error,

    // Actions
    loadProducts,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  }
} 
