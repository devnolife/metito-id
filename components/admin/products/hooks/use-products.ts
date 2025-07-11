import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Product, ProductFilters, ProductResponse } from '../types/product'

export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {})
  const { toast } = useToast()

  // Fetch products
  const fetchProducts = useCallback(async (newFilters?: ProductFilters) => {
    try {
      setLoading(true)
      setError(null)

      const currentFilters = newFilters || filters
      const params = new URLSearchParams()

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data: { success: boolean; data: ProductResponse } = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setPagination(data.data.pagination)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  // Create product
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'category' | 'isActive'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create product')
      }

      toast({
        title: "Success",
        description: "Product created successfully",
        variant: "default",
      })

      // Refresh products list
      await fetchProducts()

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchProducts, toast])

  // Update product
  const updateProduct = useCallback(async (id: string, productData: Partial<Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'category' | 'isActive'>>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product')
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
        variant: "default",
      })

      // Refresh products list
      await fetchProducts()

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchProducts, toast])

  // Delete product
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product')
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      })

      // Refresh products list
      await fetchProducts()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchProducts, toast])

  // Get single product
  const getProduct = useCallback(async (id: string): Promise<Product> => {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch product')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }, [filters, fetchProducts])

  // Reset filters
  const resetFilters = useCallback(() => {
    const resetFilters = { page: 1, limit: 12 }
    setFilters(resetFilters)
    fetchProducts(resetFilters)
  }, [fetchProducts])

  // Initial load
  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    updateFilters,
    resetFilters,
  }
} 
