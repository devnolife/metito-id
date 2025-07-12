import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "./file-upload"
import { Package, DollarSign, Settings, FileText, Image as ImageIcon, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
}

interface ProductCreateFormProps {
  categories: Category[]
  onSuccess: () => void
  onCancel: () => void
}

interface ProductFormData {
  name: string
  description: string
  shortDesc: string
  price: string
  capacity: string
  efficiency: string
  location: string
  application: "Industrial" | "Municipal" | ""
  features: string[]
  warranty: string
  delivery: string
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
}

export function ProductCreateForm({ categories, onSuccess, onCancel }: ProductCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentFeature, setCurrentFeature] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    shortDesc: "",
    price: "",
    capacity: "",
    efficiency: "",
    location: "",
    application: "",
    features: [],
    warranty: "",
    delivery: "",
    images: [],
    documents: [],
    categoryId: "",
    inStock: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  })

  // Format rupiah function
  const formatRupiah = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '')

    if (numericValue === '') return ''

    // Convert to number and format
    const number = parseInt(numericValue, 10)
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number)
  }

  // Parse rupiah to number
  const parseRupiah = (value: string): number => {
    const numericValue = value.replace(/\D/g, '')
    return numericValue ? parseInt(numericValue, 10) : 0
  }

  // Handle price input with formatting
  const handlePriceChange = (value: string) => {
    // Allow empty value or numeric input
    if (value === '' || /^\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        price: value
      }))
    }
  }

  // Format price on blur (when user finishes typing)
  const handlePriceBlur = () => {
    if (formData.price && formData.price !== '') {
      const formattedPrice = formatRupiah(formData.price)
      setFormData(prev => ({
        ...prev,
        price: formattedPrice
      }))
    }
  }

  // Convert back to numeric when focusing (for editing)
  const handlePriceFocus = () => {
    if (formData.price && formData.price !== '') {
      const numericValue = formData.price.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        price: numericValue
      }))
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFeature = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }))
      setCurrentFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.categoryId || parseRupiah(formData.price) <= 0) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API - convert price to number
      const submitData = {
        ...formData,
        price: parseRupiah(formData.price),
        // Ensure application is properly set or undefined
        application: formData.application || undefined
      }

      console.log('Submitting product data:', submitData)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Produk berhasil dibuat",
        })
        onSuccess()
      } else {
        const error = await response.json()
        console.error('API Error:', error)

        // Handle validation errors specifically
        if (response.status === 422 && error.errors) {
          const errorMessages = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')

          toast({
            title: "Validation Error",
            description: errorMessages,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: error.message || "Gagal membuat produk",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Create product error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat produk",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-4 h-4" />
            Informasi Dasar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama produk"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
            <Textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => handleInputChange('shortDesc', e.target.value)}
              placeholder="Deskripsi singkat produk"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi Lengkap</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi lengkap produk"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Price & Specifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-4 h-4" />
            Harga & Spesifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Harga *</Label>
              <Input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={handlePriceBlur}
                onFocus={handlePriceFocus}
                placeholder="Masukkan harga (contoh: 1000000)"
                required
              />
            </div>
            <div>
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Contoh: 1000 L/hr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="efficiency">Efisiensi</Label>
              <Input
                id="efficiency"
                value={formData.efficiency}
                onChange={(e) => handleInputChange('efficiency', e.target.value)}
                placeholder="Contoh: 95%"
              />
            </div>
            <div>
              <Label htmlFor="location">Lokasi/Asal</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Contoh: USA, Jerman"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="application">Aplikasi</Label>
              <Select value={formData.application} onValueChange={(value) => handleInputChange('application', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih aplikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Municipal">Municipal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warranty">Garansi</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => handleInputChange('warranty', e.target.value)}
                placeholder="Contoh: 2 tahun"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="delivery">Waktu Pengiriman</Label>
            <Input
              id="delivery"
              value={formData.delivery}
              onChange={(e) => handleInputChange('delivery', e.target.value)}
              placeholder="Contoh: 2-4 minggu"
            />
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-4 h-4" />
            Fitur Produk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Masukkan fitur produk"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="sm">
              Tambah
            </Button>
          </div>

          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="w-4 h-4" />
            Gambar Produk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            files={formData.images}
            onFilesChange={(files) => handleInputChange('images', files)}
            accept="image/*"
            maxFiles={10}
            type="images"
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-4 h-4" />
            Pengaturan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inStock">Stok Tersedia</Label>
              <p className="text-sm text-gray-500">Produk tersedia untuk pembelian</p>
            </div>
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => handleInputChange('inStock', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isFeatured">Produk Unggulan</Label>
              <p className="text-sm text-gray-500">Tampilkan sebagai produk unggulan</p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Produk"}
        </Button>
      </div>
    </form>
  )
} 
