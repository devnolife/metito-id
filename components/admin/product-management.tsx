"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, Filter, Upload, X, Eye, Package, Settings, BarChart3 } from "lucide-react"
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

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface ProductImage {
  id: string
  url: string
  fileName: string
}

interface ProductFormProps {
  formData: any
  setFormData: (data: any) => void
  categories: Category[]
  productImages: ProductImage[]
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete: () => void
  handleImageClick: (image: ProductImage) => void
  isUploading: boolean
  isSubmitting: boolean
  onSubmit: () => void
  submitLabel: string
}

const ProductForm = ({ 
  formData, 
  setFormData, 
  categories, 
  productImages, 
  handleFileUpload, 
  handleImageDelete, 
  handleImageClick, 
  isUploading, 
  isSubmitting,
  onSubmit, 
  submitLabel 
}: ProductFormProps) => {
  console.log("=== PRODUCT FORM RENDERED ===")
  console.log("formData:", formData)
  console.log("categories:", categories)
  console.log("submitLabel:", submitLabel)
  console.log("isSubmitting:", isSubmitting)
  
  return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama produk"
        />
      </div>
      <div>
        <Label htmlFor="categoryId">Kategori</Label>
        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price">Harga (IDR)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
          <Input
            id="price"
            type="number"
            step="1"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="45000000"
            className="pl-10"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.price && !isNaN(Number(formData.price)) 
            ? `≈ ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(formData.price))}`
            : 'Masukkan harga dalam Rupiah'
          }
        </p>
      </div>
      <div>
        <Label htmlFor="application">Aplikasi</Label>
        <Select
          value={formData.application}
          onValueChange={(value) => setFormData({ ...formData, application: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih aplikasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Municipal">Municipal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="capacity">Kapasitas</Label>
        <Input
          id="capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="contoh: 1000 GPD"
        />
      </div>
      <div>
        <Label htmlFor="efficiency">Efisiensi</Label>
        <Input
          id="efficiency"
          value={formData.efficiency}
          onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
          placeholder="contoh: 99.5%"
        />
      </div>
      <div>
        <Label htmlFor="location">Asal</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="contoh: USA"
        />
      </div>
    </div>

    {/* Image Upload Area - Fixed Size */}
    <div>
      <Label>Gambar Produk</Label>
      <div className="mt-2 flex justify-center">
        {/* Fixed container to prevent layout shift */}
        <div className="w-full max-w-xs">
          {productImages.length > 0 ? (
            <div className="relative group">
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={productImages[0].url}
                  alt={productImages[0].fileName}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageClick(productImages[0])}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    console.error('Image failed to load:', target.src)
                    console.error('Current URL:', window.location.href)
                    console.error('Image URL:', productImages[0].url)
                    // Try with full URL
                    const fullUrl = window.location.origin + productImages[0].url
                    console.error('Trying full URL:', fullUrl)
                    target.src = fullUrl
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', productImages[0].url)
                  }}
                />
                {/* Delete Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleImageDelete}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Replace Button */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="h-8 px-3"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Ganti
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">{productImages[0].fileName}</p>
            </div>
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload gambar produk</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-blue mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Pilih Gambar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload product image"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="specs">Specifications (JSON format)</Label>
      <Input
        id="specs"
        value={formData.specs}
        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
        placeholder='{"pressure": "1000 PSI", "temperature": "50°C"}'
      />
    </div>

    <div>
      <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
      <Input
        id="features"
        value={formData.features}
        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
        placeholder="Tekanan Tinggi, Pemulihan Energi, Auto Flush"
      />
    </div>

    <div>
      <Label htmlFor="description">Deskripsi</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Masukkan deskripsi produk"
        rows={3}
      />
    </div>

    <div>
      <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
      <Textarea
        id="shortDesc"
        value={formData.shortDesc}
        onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
        placeholder="Masukkan deskripsi singkat"
        rows={2}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="warranty">Garansi</Label>
        <Input
          id="warranty"
          value={formData.warranty}
          onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
          placeholder="contoh: 2 tahun"
        />
      </div>
      <div>
        <Label htmlFor="delivery">Pengiriman</Label>
        <Input
          id="delivery"
          value={formData.delivery}
          onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
          placeholder="contoh: 2-4 minggu"
        />
      </div>
    </div>

    {/* Product Status Controls */}
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Switch
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
        />
        <Label htmlFor="inStock" className="text-sm font-medium">
          Produk Tersedia
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
        />
        <Label htmlFor="isFeatured" className="text-sm font-medium">
          Produk Unggulan
        </Label>
      </div>
    </div>

    <Button 
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("=== PRODUCT FORM SUBMIT BUTTON CLICKED ===")
        console.log("Submit label:", submitLabel)
        console.log("Current formData:", formData)
        console.log("Required fields check:")
        console.log("- name:", formData.name)
        console.log("- categoryId:", formData.categoryId)
        console.log("- price:", formData.price)
        
        if (!formData.name?.trim()) {
          console.log("ERROR: Name is empty")
          return
        }
        if (!formData.categoryId) {
          console.log("ERROR: CategoryId is empty")
          return
        }
        if (!formData.price?.toString().trim()) {
          console.log("ERROR: Price is empty")
          return
        }
        
        console.log("All validations passed, calling onSubmit...")
        try {
          onSubmit()
        } catch (error) {
          console.error("Error calling onSubmit:", error)
        }
      }} 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
      type="button"
      disabled={isUploading || isSubmitting}
    >
      {isSubmitting ? "Sedang menambahkan..." : isUploading ? "Sedang mengupload..." : submitLabel}
    </Button>
  </div>
  )
}

export function ProductManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("products")

  // Product data
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  
  // Category management states
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  })
  
  const [formData, setFormData] = useState({
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

  // Check authentication and load data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (authResponse.ok) {
          const authData = await authResponse.json()
          if (authData.success && authData.data?.role === 'ADMIN') {
            setIsAuthenticated(true)

            // Load categories
            const categoriesResponse = await fetch('/api/categories')
            if (categoriesResponse.ok) {
              const categoriesData = await categoriesResponse.json()
              setCategories(categoriesData.data || [])
            }

            // Load products
            await loadProducts()
          } else {
            toast.error('Memerlukan akses admin')
          }
        } else {
          toast.error('Memerlukan autentikasi')
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        toast.error('Gagal menginisialisasi data')
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Debug activeTab changes
  useEffect(() => {
    console.log("ActiveTab changed to:", activeTab)
    console.log("Current formData:", formData)
    console.log("Current productImages:", productImages)
  }, [activeTab, formData, productImages])

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

  const handleTambahProdukClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("=== TOMBOL TAMBAH PRODUK DIKLIK ===")
    e.preventDefault()
    e.stopPropagation()
    console.log("Event prevented and stopped")
    console.log("Current tab before change:", activeTab)
    
    // Reset form first
    console.log("Calling resetForm...")
    resetForm()
    console.log("Form reset completed")
    
    // Then change tab
    console.log("Setting activeTab to 'add'...")
    setActiveTab("add")
    console.log("ActiveTab set to 'add'")
    
    console.log("=== HANDLER COMPLETED ===")
  }, [resetForm])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data?.products || [])
      } else {
        toast.error('Gagal memuat produk')
      }
    } catch (error) {
      console.error('Load products error:', error)
      toast.error('Gagal memuat produk')
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      } else {
        toast.error('Gagal memuat kategori')
      }
    } catch (error) {
      console.error('Load categories error:', error)
      toast.error('Gagal memuat kategori')
    }
  }

  // Show loading state until authentication is complete
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Show authentication error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-primary-blue mb-2">Akses Ditolak</h3>
          <p className="text-gray-600">Anda memerlukan akses admin untuk melihat halaman ini</p>
        </div>
      </div>
    )
  }

  const handleAddProduct = async () => {
    console.log("=== HANDLE ADD PRODUCT CALLED ===")
    console.log("Current formData:", formData)
    console.log("Current productImages:", productImages)
    
    if (isSubmitting) {
      console.log("Already submitting, ignoring click")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        console.log("Validation failed: name is empty")
        toast.error("Nama produk wajib diisi")
        return
      }
      if (!formData.categoryId) {
        console.log("Validation failed: categoryId is empty")
        toast.error("Kategori wajib dipilih")
        return
      }
      if (!formData.price.trim()) {
        console.log("Validation failed: price is empty")
        toast.error("Harga wajib diisi")
        return
      }

      console.log("All required validations passed")

      // Validate specs field if provided
      let specsData = undefined
      if (formData.specs && formData.specs.trim()) {
        try {
          specsData = JSON.parse(formData.specs)
          console.log("Specs parsed successfully:", specsData)
        } catch (error) {
          console.log("Specs validation failed:", error)
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

      console.log("Sending product data:", productData)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      })

      console.log("API response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Product added successfully:", result)
        toast.success("Produk berhasil ditambahkan!")
        setIsAddDialogOpen(false)
        resetForm()
        await loadProducts() // Reload products from database
        // Navigate back to products tab after successful addition
        setActiveTab("products")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error("API error:", errorData)
        toast.error(errorData.message || "Gagal menambahkan produk")
      }
    } catch (error) {
      console.error('Add product error:', error)
      toast.error("Gagal menambahkan produk")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    if (isSubmitting) {
      console.log("Already submitting, ignoring click")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error("Nama produk wajib diisi")
        setIsSubmitting(false)
        return
      }
      if (!formData.categoryId) {
        toast.error("Kategori wajib dipilih")
        setIsSubmitting(false)
        return
      }
      if (!formData.price.trim()) {
        toast.error("Harga wajib diisi")
        setIsSubmitting(false)
        return
      }

      // Validate specs field if provided
      let specsData = undefined
      if (formData.specs && formData.specs.trim()) {
        try {
          specsData = JSON.parse(formData.specs)
        } catch (error) {
          toast.error("Format specifications tidak valid. Gunakan format JSON yang benar, contoh: {\"tekanan\": \"1000 PSI\"}")
          setIsSubmitting(false)
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

      if (response.ok) {
        toast.success("Produk berhasil diperbarui!")
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        resetForm()
        await loadProducts() // Reload products from database
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Gagal memperbarui produk")
      }
    } catch (error) {
      console.error('Update product error:', error)
      toast.error("Gagal memperbarui produk")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success("Product berhasil dihapus!")
        await loadProducts() // Reload products from database
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to delete product")
      }
    } catch (error) {
      console.error('Delete product error:', error)
      toast.error("Failed to delete product")
    }
  }

  const handleAddCategory = async () => {
    console.log('handleAddCategory called with:', categoryFormData)
    
    if (!categoryFormData.name.trim()) {
      toast.error("Nama kategori wajib diisi")
      return
    }

    // Validate minimum character length
    if (categoryFormData.name.trim().length < 2) {
      toast.error("Nama kategori harus minimal 2 karakter")
      return
    }

    // Check if user is still authenticated before making the request
    if (!isAuthenticated) {
      toast.error("Sesi telah berakhir, silakan login kembali")
      return
    }

    try {
      const requestBody = {
        name: categoryFormData.name,
        description: categoryFormData.description,
      }
      
      console.log('Making request to /api/categories:', requestBody)

      // Get auth token from cookie
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];
      
      if (!authToken) {
        toast.error("Token autentikasi tidak ditemukan, silakan login kembali")
        return
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      const responseText = await response.text()

      if (response.ok) {
        let result
        try {
          result = responseText ? JSON.parse(responseText) : {}
          console.log('Success response:', result)
          toast.success("Kategori berhasil ditambahkan")
          setIsAddCategoryDialogOpen(false)
          resetCategoryForm()
          await loadCategories()
        } catch (parseError) {
          console.error('Failed to parse success response:', parseError)
          // Still close dialog and reload categories as it might have worked
          toast.success("Kategori berhasil ditambahkan")
          setIsAddCategoryDialogOpen(false)
          resetCategoryForm()
          await loadCategories()
        }
      } else {
        // Handle different error scenarios
        let errorMessage = `Gagal menambahkan kategori (${response.status})`
        
        try {
          if (responseText && responseText.trim()) {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorData.error || errorMessage
          }
        } catch (parseError) {
          // If it's not JSON, use the raw text or status
          if (responseText && !responseText.includes('<html>')) {
            errorMessage = responseText
          }
        }
        
        // Handle specific error codes
        if (response.status === 401) {
          errorMessage = "Sesi telah berakhir, silakan login kembali"
        } else if (response.status === 403) {
          errorMessage = "Akses admin diperlukan"
        } else if (response.status === 409) {
          errorMessage = "Kategori dengan nama ini sudah ada"
        }
        
        console.error('Add category failed:', response.status, errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Add category error:', error)
      toast.error("Gagal menambahkan kategori - Network error")
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    if (!categoryFormData.name.trim()) {
      toast.error("Nama kategori wajib diisi")
      return
    }

    // Validate minimum character length
    if (categoryFormData.name.trim().length < 2) {
      toast.error("Nama kategori harus minimal 2 karakter")
      return
    }

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: categoryFormData.name,
          description: categoryFormData.description,
        }),
      })

      if (response.ok) {
        toast.success("Kategori berhasil diperbarui")
        setIsEditCategoryDialogOpen(false)
        setEditingCategory(null)
        resetCategoryForm()
        await loadCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Gagal memperbarui kategori")
      }
    } catch (error) {
      console.error('Update category error:', error)
      toast.error("Gagal memperbarui kategori")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success("Kategori berhasil dihapus")
        await loadCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Gagal menghapus kategori")
      }
    } catch (error) {
      console.error('Delete category error:', error)
      toast.error("Gagal menghapus kategori")
    }
  }

  const openEditDialog = (product: Product) => {
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
  }

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsEditCategoryDialogOpen(true)
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', files[0])
      uploadFormData.append('category', 'products')

      console.log('Uploading file:', files[0].name, 'to category: products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Upload failed with status:', response.status, 'Error:', errorData)
        throw new Error(errorData.message || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)

      // Ensure URL starts with forward slash and is properly formatted
      let imageUrl = result.data.filePath

      // Remove any leading slashes and add a single one
      imageUrl = imageUrl.replace(/^\/+/, '')
      imageUrl = `/${imageUrl}`

      console.log('Original filePath:', result.data.filePath)
      console.log('Processed imageUrl:', imageUrl)
      console.log('Full URL would be:', window.location.origin + imageUrl)

      const newImage: ProductImage = {
        id: Date.now().toString(),
        url: imageUrl,
        fileName: files[0].name
      }

      setProductImages([newImage])
      toast.success("Gambar berhasil diupload!")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Gagal upload gambar: ${error instanceof Error ? error.message : 'Error tidak dikenal'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = () => {
    setProductImages([])
    toast.success("Gambar berhasil dihapus")
  }

  const handleImageClick = (image: ProductImage) => {
    setSelectedImage(image)
    setIsImageModalOpen(true)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const CategoryForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="categoryName">Nama Kategori</Label>
        <Input
          id="categoryName"
          value={categoryFormData.name}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
          placeholder="Masukkan nama kategori"
        />
      </div>

      <div>
        <Label htmlFor="categoryDescription">Deskripsi (Opsional)</Label>
        <Textarea
          id="categoryDescription"
          value={categoryFormData.description}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
          placeholder="Masukkan deskripsi kategori"
          rows={3}
        />
      </div>

      <Button onClick={onSubmit} className="w-full primary-blue hover:bg-blue-800">
        {submitLabel}
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary-blue">Manajemen Produk</h2>
          <p className="text-gray-600">Kelola katalog produk pengolahan air Anda</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={(e) => {
            console.log("=== HEADER TAMBAH PRODUK BUTTON CLICKED ===")
            handleTambahProdukClick(e)
          }}
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Analytics Section - Always Visible Above Tabs */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-primary-blue mb-4">Analitik Produk</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Produk</p>
                    <p className="text-2xl font-bold text-primary-blue">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Kategori</p>
                    <p className="text-2xl font-bold text-primary-blue">{categories.length}</p>
                  </div>
                  <Settings className="w-8 h-8 text-primary-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produk Unggulan</p>
                    <p className="text-2xl font-bold text-primary-blue">
                      {products.filter(p => p.isFeatured).length}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-primary-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tersedia</p>
                    <p className="text-2xl font-bold text-primary-blue">
                      {products.filter(p => p.inStock).length}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary-blue" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Produk
          </button>
          <button
            onClick={() => {
              console.log("Tab navigation - Setting to 'add'")
              setActiveTab("add")
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "add"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Tambah Produk
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "categories"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Kategori
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2 text-primary-blue font-semibold">
                    <Filter className="w-5 h-5" />
                    <span>Filter Produk:</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        console.error('Product grid image failed to load:', target.src)
                        target.src = '/placeholder.svg'
                      }}
                      onLoad={() => {
                        console.log('Product grid image loaded successfully:', product.images?.[0])
                      }}
                    />
                    <Badge className="absolute top-3 left-3 primary-blue text-white">{product.application}</Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-primary-blue mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features && product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kapasitas:</span>
                        <span className="font-medium">{product.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efisiensi:</span>
                        <span className="font-medium">{product.efficiency}</span>
                      </div>
                    </div>

                    <div className="text-xl font-bold text-accent-orange mb-4">
                      {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(Number(product.price))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)} className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-primary-blue mb-2">Produk Tidak Ditemukan</h3>
                  <p className="text-gray-600">Coba sesuaikan filter pencarian atau tambahkan produk baru</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-primary-blue mb-2">Tambah Produk Baru</h3>
                  <p className="text-gray-600">Isi formulir di bawah ini untuk menambahkan produk baru ke katalog Anda</p>
                </div>
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
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-primary-blue mb-2">Kategori Produk</h3>
                  <p className="text-gray-600">Kelola kategori produk Anda</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-primary-blue">{category.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{category.description || 'Tidak ada deskripsi'}</p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => openEditCategoryDialog(category)}>
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <Button 
                    className="primary-blue hover:bg-blue-800" 
                    onClick={(e) => {
                      e.preventDefault()
                      resetCategoryForm()
                      setIsAddCategoryDialogOpen(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kategori
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
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
            onSubmit={handleEditProduct} 
            submitLabel="Perbarui Produk" 
          />
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pratinjau Gambar</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.jpg'
                  }}
                />
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Nama File</Label>
                  <p className="text-sm text-gray-600">{selectedImage.fileName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">URL Gambar</Label>
                  <p className="text-sm text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                    {selectedImage.url}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog 
        open={isAddCategoryDialogOpen} 
        onOpenChange={(open) => {
          setIsAddCategoryDialogOpen(open)
          if (!open) {
            resetCategoryForm()
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="addCategoryName">Nama Kategori</Label>
              <Input
                id="addCategoryName"
                value={categoryFormData.name}
                onChange={(e) => {
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }}
                placeholder="Masukkan nama kategori"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="addCategoryDescription">Deskripsi (Opsional)</Label>
              <Textarea
                id="addCategoryDescription"
                value={categoryFormData.description}
                onChange={(e) => {
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }}
                placeholder="Masukkan deskripsi kategori"
                rows={3}
              />
            </div>

            <Button 
              onClick={handleAddCategory} 
              className="w-full primary-blue hover:bg-blue-800"
            >
              Tambah Kategori
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={(open) => {
        setIsEditCategoryDialogOpen(open)
        if (!open) {
          setEditingCategory(null)
          resetCategoryForm()
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCategoryName">Nama Kategori</Label>
              <Input
                id="editCategoryName"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <Label htmlFor="editCategoryDescription">Deskripsi (Opsional)</Label>
              <Textarea
                id="editCategoryDescription"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                placeholder="Masukkan deskripsi kategori"
                rows={3}
              />
            </div>

            <Button onClick={handleEditCategory} className="w-full primary-blue hover:bg-blue-800">
              Perbarui Kategori
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


