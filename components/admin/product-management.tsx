"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export function ProductManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
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
            toast.error('Admin access required')
          }
        } else {
          toast.error('Authentication required')
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        toast.error('Failed to initialize data')
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data?.products || [])
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Load products error:', error)
      toast.error('Failed to load products')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-primary-blue mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    )
  }

  const handleAddProduct = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Product name is required")
      return
    }
    if (!formData.categoryId) {
      toast.error("Category is required")
      return
    }
    if (!formData.price.trim()) {
      toast.error("Price is required")
      return
    }

    try {
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
        specs: formData.specs ? JSON.parse(formData.specs) : undefined,
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

      if (response.ok) {
        const result = await response.json()
        toast.success("Product berhasil ditambahkan!")
        setIsAddDialogOpen(false)
        resetForm()
        await loadProducts() // Reload products from database
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to add product")
      }
    } catch (error) {
      console.error('Add product error:', error)
      toast.error("Failed to add product")
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Product name is required")
      return
    }
    if (!formData.categoryId) {
      toast.error("Category is required")
      return
    }
    if (!formData.price.trim()) {
      toast.error("Price is required")
      return
    }

    try {
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
        specs: formData.specs ? JSON.parse(formData.specs) : undefined,
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
        toast.success("Product berhasil diperbarui!")
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        resetForm()
        await loadProducts() // Reload products from database
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update product")
      }
    } catch (error) {
      console.error('Update product error:', error)
      toast.error("Failed to update product")
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

  const resetForm = () => {
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
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('category', 'products')

      console.log('Uploading file:', files[0].name, 'to category: products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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
      toast.error(`Gagal upload gambar: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = () => {
    setProductImages([])
    toast.success("Gambar dihapus")
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

  const ProductForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., 45000"
          />
        </div>
        <div>
          <Label htmlFor="application">Application</Label>
          <Select
            value={formData.application}
            onValueChange={(value) => setFormData({ ...formData, application: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select application" />
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
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="e.g., 1000 GPD"
          />
        </div>
        <div>
          <Label htmlFor="efficiency">Efficiency</Label>
          <Input
            id="efficiency"
            value={formData.efficiency}
            onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
            placeholder="e.g., 99.5%"
          />
        </div>
        <div>
          <Label htmlFor="location">Origin</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., USA"
          />
        </div>
      </div>

      {/* Simple Image Upload Area */}
      <div>
        <Label>Product Image</Label>
        <div className="mt-2">
          {productImages.length > 0 ? (
            <div className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
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
            </div>
          ) : (
            <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
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
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="High Pressure, Energy Recovery, Auto Flush"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea
          id="shortDesc"
          value={formData.shortDesc}
          onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          placeholder="Enter short description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="warranty">Warranty</Label>
          <Input
            id="warranty"
            value={formData.warranty}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            placeholder="e.g., 2 years"
          />
        </div>
        <div>
          <Label htmlFor="delivery">Delivery</Label>
          <Input
            id="delivery"
            value={formData.delivery}
            onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
            placeholder="e.g., 2-4 weeks"
          />
        </div>
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
          <h2 className="text-3xl font-bold text-primary-blue">Product Management</h2>
          <p className="text-gray-600">Kelola katalog produk water treatment Anda</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-primary-blue font-semibold">
                  <Filter className="w-5 h-5" />
                  <span>Filter Products:</span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{product.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className="font-medium">{product.efficiency}</span>
                    </div>
                  </div>

                  <div className="text-xl font-bold text-accent-orange mb-4">${product.price.toLocaleString()}</div>

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
                <h3 className="text-xl font-bold text-primary-blue mb-2">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your search filters or add a new product</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Add Product Tab */}
        <TabsContent value="add" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary-blue mb-2">Add New Product</h3>
                <p className="text-gray-600">Fill in the form below to add a new product to your catalog</p>
              </div>
              <ProductForm onSubmit={handleAddProduct} submitLabel="Add Product" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary-blue mb-2">Product Categories</h3>
                <p className="text-gray-600">Manage your product categories</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-primary-blue">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.description || 'No description'}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <Button className="primary-blue hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
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
                    <p className="text-sm font-medium text-gray-600">Categories</p>
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
                    <p className="text-sm font-medium text-gray-600">Featured Products</p>
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
                    <p className="text-sm font-medium text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold text-primary-blue">
                      {products.filter(p => p.inStock).length}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary-blue" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary-blue mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product added</p>
                    <p className="text-xs text-gray-600">New product "Industrial RO System" was added</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product updated</p>
                    <p className="text-xs text-gray-600">Product "Municipal Filter" was updated</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleEditProduct} submitLabel="Update Product" />
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
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
                  <Label className="text-sm font-medium">File Name</Label>
                  <p className="text-sm text-gray-600">{selectedImage.fileName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Image URL</Label>
                  <p className="text-sm text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                    {selectedImage.url}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


