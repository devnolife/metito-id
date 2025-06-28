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
import { Plus, Edit, Trash2, Search, Filter, CheckCircle } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  category: string
  price: string
  application: string
  capacity: string
  efficiency: string
  location: string
  image: string
  specs: string[]
  description: string
}

interface UploadedImage {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  title?: string
  description?: string
  altText?: string
}

export function ProductManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.role === 'ADMIN') {
            setIsAuthenticated(true)
          } else {
            toast.error('Admin access required')
          }
        } else {
          toast.error('Authentication required')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        toast.error('Authentication check failed')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "RO Membrane System 1000 GPD",
      category: "membrane",
      price: "$45,000",
      application: "Industrial",
      capacity: "1000 GPD",
      efficiency: "99.5%",
      location: "USA",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["High Pressure", "Energy Recovery", "Auto Flush"],
      description: "Advanced reverse osmosis membrane system designed for industrial water treatment applications.",
    },
    {
      id: 2,
      name: "Ultrafiltration Module UF-500",
      category: "filtration",
      price: "$28,000",
      application: "Municipal",
      capacity: "500 m³/day",
      efficiency: "99.9%",
      location: "Germany",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Hollow Fiber", "Backwash System", "PLC Control"],
      description: "High-performance ultrafiltration system for municipal water treatment.",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productImages, setProductImages] = useState<UploadedImage[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    application: "",
    capacity: "",
    efficiency: "",
    location: "",
    image: "",
    specs: "",
    description: "",
  })

  const categories = [
    { value: "membrane", label: "Membrane Systems" },
    { value: "filtration", label: "Filtration Units" },
    { value: "disinfection", label: "Disinfection" },
    { value: "pumps", label: "Pumps & Motors" },
    { value: "monitoring", label: "Monitoring" },
    { value: "chemical", label: "Chemical Dosing" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const handleAddProduct = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert("Product name is required")
      return
    }
    if (!formData.category) {
      alert("Category is required")
      return
    }
    if (!formData.price.trim()) {
      alert("Price is required")
      return
    }

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      application: formData.application,
      capacity: formData.capacity,
      efficiency: formData.efficiency,
      location: formData.location,
      image: productImages.length > 0 ? productImages[0].filePath : formData.image || "/placeholder.svg?height=300&width=400",
      specs: formData.specs.split(",").map((s) => s.trim()).filter(s => s.length > 0),
      description: formData.description,
    }
    setProducts([...products, newProduct])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditProduct = () => {
    if (!editingProduct) return

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Product name is required")
      return
    }
    if (!formData.category) {
      alert("Category is required")
      return
    }
    if (!formData.price.trim()) {
      alert("Price is required")
      return
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      category: formData.category,
      price: formData.price,
      application: formData.application,
      capacity: formData.capacity,
      efficiency: formData.efficiency,
      location: formData.location,
      image: productImages.length > 0 ? productImages[0].filePath : formData.image || "/placeholder.svg?height=300&width=400",
      specs: formData.specs.split(",").map((s) => s.trim()).filter(s => s.length > 0),
      description: formData.description,
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    setIsEditDialogOpen(false)
    setEditingProduct(null)
    resetForm()
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      application: product.application,
      capacity: product.capacity,
      efficiency: product.efficiency,
      location: product.location,
      image: product.image,
      specs: product.specs.join(", "),
      description: product.description,
    })

    // Convert existing product image to UploadedImage format for display
    if (product.image && product.image !== "/placeholder.svg?height=300&width=400") {
      const existingImage: UploadedImage = {
        id: `existing-${product.id}`,
        fileName: product.name,
        filePath: product.image,
        fileSize: 0,
        fileType: 'image/jpeg',
        title: product.name,
        altText: product.name
      }
      setProductImages([existingImage])
    } else {
      setProductImages([])
    }

    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      application: "",
      capacity: "",
      efficiency: "",
      location: "",
      image: "",
      specs: "",
      description: "",
    })
    setProductImages([])
  }

  const handleImageUpload = (images: UploadedImage[]) => {
    setIsUploading(false)
    setProductImages(prev => [...prev, ...images])

    // Show success notification with image details
    if (images.length === 1) {
      toast.success(`Image "${images[0].fileName}" uploaded successfully!`, {
        description: "The image is now ready to use as your product image.",
        duration: 4000,
      })
    } else {
      toast.success(`${images.length} images uploaded successfully!`, {
        description: `The first image will be used as the main product image.`,
        duration: 4000,
      })
    }
  }

  const handleImageDelete = (imageId: string) => {
    const imageToDelete = productImages.find(img => img.id === imageId)
    setProductImages(prev => prev.filter(img => img.id !== imageId))

    if (imageToDelete) {
      toast.success(`Image "${imageToDelete.fileName}" removed`, {
        description: "The image has been removed from the product.",
        duration: 3000,
      })
    }
  }

  const handleUploadStart = () => {
    setIsUploading(true)
    toast.info("Uploading images...", {
      description: "Please wait while your images are being processed.",
      duration: 2000,
    })
  }

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image)
    setIsImageModalOpen(true)
  }

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
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
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
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., $45,000"
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

      {/* Product Images Upload */}
      <div>
        <Label>Product Images</Label>
        {isUploading && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Uploading images...</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Please wait while your images are being processed and uploaded.
            </p>
          </div>
        )}
        <ImageUpload
          category="products"
          productId={editingProduct?.id?.toString() || undefined}
          onUploadComplete={handleImageUpload}
          onUploadStart={handleUploadStart}
          onImageDelete={handleImageDelete}
          existingImages={productImages}
          maxFiles={5}
          className="mt-2"
        />

        {/* Main Image Preview */}
        {productImages.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Main Product Image Preview
            </Label>
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={productImages[0].filePath}
                    alt={productImages[0].altText || productImages[0].fileName}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(productImages[0])}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-800">
                    {productImages[0].title || productImages[0].fileName}
                  </p>
                  <p className="text-sm text-blue-600">
                    This image will be displayed as the main product image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    File: {productImages[0].fileName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Section */}
        {productImages.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              All Product Images ({productImages.length})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-blue-400' : 'border-gray-200'
                    }`}>
                    <img
                      src={image.filePath}
                      alt={image.altText || image.fileName}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(image)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                    {/* Main Image Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-600 text-white text-xs">
                          Main Image
                        </Badge>
                      </div>
                    )}
                    {/* Delete Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleImageDelete(image.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-600 truncate" title={image.fileName}>
                      {image.fileName}
                    </p>
                    {image.title && (
                      <p className="text-xs text-blue-600 font-medium truncate" title={image.title}>
                        {image.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Image Order Info */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Image Information</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                The first image will be used as the main product image. You can reorder images by deleting and re-uploading them in the desired order.
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="specs">Specifications (comma-separated)</Label>
        <Input
          id="specs"
          value={formData.specs}
          onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
          placeholder="e.g., High Pressure, Energy Recovery, Auto Flush"
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
          <p className="text-gray-600">Manage your water treatment equipment catalog</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="primary-blue hover:bg-blue-800" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} submitLabel="Add Product" />
          </DialogContent>
        </Dialog>
      </div>

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
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
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
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-3 left-3 primary-blue text-white">{product.application}</Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary-blue mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {product.specs.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec}
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

              <div className="text-xl font-bold text-accent-orange mb-4">{product.price}</div>

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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleEditProduct} submitLabel="Update Product" />
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-primary-blue mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search filters or add a new product</p>
          </CardContent>
        </Card>
      )}

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
                  src={selectedImage.filePath}
                  alt={selectedImage.altText || selectedImage.fileName}
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
                {selectedImage.title && (
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-gray-600">{selectedImage.title}</p>
                  </div>
                )}
                {selectedImage.altText && (
                  <div>
                    <Label className="text-sm font-medium">Alt Text</Label>
                    <p className="text-sm text-gray-600">{selectedImage.altText}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">File Size</Label>
                  <p className="text-sm text-gray-600">
                    {selectedImage.fileSize > 0
                      ? `${(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB`
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">File Type</Label>
                  <p className="text-sm text-gray-600">{selectedImage.fileType}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
