export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  price?: string
  capacity?: string
  efficiency?: string
  location?: string
  application?: 'Industrial' | 'Municipal'
  specs?: Record<string, any>
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
  category: {
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
  icon?: string
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  products?: {
    id: string
    name: string
    slug: string
    price?: string
    images: string[]
    isFeatured: boolean
  }[]
}

export interface ProductFilters {
  search?: string
  category?: string
  application?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  page?: number
  limit?: number
}

export interface ProductResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} 
