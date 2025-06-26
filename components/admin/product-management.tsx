"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react"

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

export function ProductManagement() {
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

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      application: formData.application,
      capacity: formData.capacity,
      efficiency: formData.efficiency,
      location: formData.location,
      image: formData.image || "/placeholder.svg?height=300&width=400",
      specs: formData.specs.split(",").map((s) => s.trim()),
      description: formData.description,
    }
    setProducts([...products, newProduct])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditProduct = () => {
    if (!editingProduct) return

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      category: formData.category,
      price: formData.price,
      application: formData.application,
      capacity: formData.capacity,
      efficiency: formData.efficiency,
      location: formData.location,
      image: formData.image || "/placeholder.svg?height=300&width=400",
      specs: formData.specs.split(",").map((s) => s.trim()),
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

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Enter image URL or leave blank for placeholder"
        />
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
    </div>
  )
}
