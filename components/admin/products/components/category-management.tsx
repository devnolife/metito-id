import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { IconPicker } from "@/components/ui/icon-picker"
import { Plus, Edit, Trash2, Tag, Palette } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryManagementProps {
  categories: Category[]
  onCategoryChange: () => void
  className?: string
}

export function CategoryManagement({ categories, onCategoryChange, className }: CategoryManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#3B82F6"
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Kategori berhasil dibuat",
        })
        setIsCreateOpen(false)
        resetForm()
        onCategoryChange()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Gagal membuat kategori",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat kategori",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Kategori berhasil diperbarui",
        })
        setIsEditOpen(false)
        setEditingCategory(null)
        resetForm()
        onCategoryChange()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Gagal memperbarui kategori",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui kategori",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Kategori berhasil dihapus",
        })
        onCategoryChange()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Gagal menghapus kategori",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus kategori",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "#3B82F6"
    })
    setIsEditOpen(true)
  }

  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
  ]

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Kelola Kategori
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kategori Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nama Kategori</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama kategori"
                      required
                      minLength={2}
                      title="Nama kategori harus minimal 2 karakter"
                    />
                    {formData.name.length > 0 && formData.name.length < 2 && (
                      <p className="text-sm text-red-500 mt-1">Nama kategori harus minimal 2 karakter</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi kategori (opsional)"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Icon</label>
                    <IconPicker
                      value={formData.icon}
                      onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                      color={formData.color}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Warna</label>
                    <div className="flex gap-2 mb-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              // Get icon component if exists
              const IconComponent = category.icon ? (LucideIcons as any)[category.icon] : null

              return (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {IconComponent ? (
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  )}
                  {category.icon && (
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Icon: {category.icon}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(category.id, category.name)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nama Kategori</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kategori"
                required
                minLength={2}
                title="Nama kategori harus minimal 2 karakter"
              />
              {formData.name.length > 0 && formData.name.length < 2 && (
                <p className="text-sm text-red-500 mt-1">Nama kategori harus minimal 2 karakter</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kategori (opsional)"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <IconPicker
                value={formData.icon}
                onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                color={formData.color}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Warna</label>
              <div className="flex gap-2 mb-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
