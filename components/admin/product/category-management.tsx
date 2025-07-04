"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Settings } from "lucide-react"
import { toast } from "sonner"
import { LoadingButton } from "../ui/loading-state"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface CategoryFormData {
  name: string
  description: string
}

interface CategoryFormProps {
  formData: CategoryFormData
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: () => void
  submitLabel: string
  isSubmitting: boolean
}

function CategoryForm({
  formData,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  submitLabel,
  isSubmitting
}: CategoryFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="categoryName">Nama Kategori</Label>
        <Input
          id="categoryName"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Masukkan nama kategori"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="categoryDescription">Deskripsi (Opsional)</Label>
        <Textarea
          id="categoryDescription"
          value={formData.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Masukkan deskripsi kategori"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <LoadingButton
        onClick={onSubmit}
        className="w-full"
        variant="primary"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {submitLabel}
      </LoadingButton>
    </div>
  )
}

interface CategoryManagementProps {
  categories: Category[]
  onAdd: (data: CategoryFormData) => Promise<void>
  onEdit: (id: string, data: CategoryFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isSubmitting: boolean
}

export function CategoryManagement({
  categories,
  onAdd,
  onEdit,
  onDelete,
  isSubmitting
}: CategoryManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  })

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
    })
  }, [])

  // Stable input handlers to prevent re-renders
  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, name: value }))
  }, [])

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
  }, [])

  const handleAdd = async () => {
    if (!formData.name?.trim()) {
      toast.error("Nama kategori wajib diisi")
      return
    }

    if (formData.name.trim().length < 2) {
      toast.error("Nama kategori harus minimal 2 karakter")
      return
    }

    try {
      await onAdd(formData)
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      // Error handling already done in parent component
    }
  }

  const handleEdit = async () => {
    if (!editingCategory) return

    if (!formData.name?.trim()) {
      toast.error("Nama kategori wajib diisi")
      return
    }

    if (formData.name.trim().length < 2) {
      toast.error("Nama kategori harus minimal 2 karakter")
      return
    }

    try {
      await onEdit(editingCategory.id, formData)
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      resetForm()
    } catch (error) {
      // Error handling already done in parent component
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-primary-blue">Manajemen Kategori</h3>
          <p className="text-gray-600">Kelola kategori produk</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-primary-blue">{category.name}</h4>
                  <p className="text-sm text-gray-500">/{category.slug}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Aktif
                </Badge>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(category)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600 mb-2">
            Belum ada kategori
          </h3>
          <p className="text-gray-500">
            Tambahkan kategori pertama untuk mengelompokkan produk
          </p>
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setIsAddDialogOpen(open)
            if (!open) resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Buat kategori baru untuk mengelompokkan produk. Nama kategori wajib diisi dan minimal 2 karakter.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={handleAdd}
            submitLabel="Tambah Kategori"
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setIsEditDialogOpen(open)
            if (!open) {
              setEditingCategory(null)
              resetForm()
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Ubah informasi kategori sesuai kebutuhan. Nama kategori wajib diisi dan minimal 2 karakter.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={handleEdit}
            submitLabel="Simpan Perubahan"
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
