import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Category } from '../types/product'

export function useCategories(includeProducts = false) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (includeProducts) {
        params.append('includeProducts', 'true')
      }

      const response = await fetch(`/api/categories?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data: { success: boolean; data: Category[] } = await response.json()

      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [includeProducts, toast])

  // Create category
  const createCategory = useCallback(async (categoryData: { name: string; description?: string; icon?: string; color?: string }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create category')
      }

      toast({
        title: "Success",
        description: "Category created successfully",
        variant: "default",
      })

      // Refresh categories list
      await fetchCategories()

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchCategories, toast])

  // Update category
  const updateCategory = useCallback(async (id: string, categoryData: Partial<{ name: string; description?: string; icon?: string; color?: string }>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update category')
      }

      toast({
        title: "Success",
        description: "Category updated successfully",
        variant: "default",
      })

      // Refresh categories list
      await fetchCategories()

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchCategories, toast])

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category')
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
        variant: "default",
      })

      // Refresh categories list
      await fetchCategories()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [fetchCategories, toast])

  // Get single category
  const getCategory = useCallback(async (id: string): Promise<Category> => {
    try {
      const response = await fetch(`/api/categories/${id}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch category')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Initial load
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  }
} 
