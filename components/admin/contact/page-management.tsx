"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react"

interface PageItem {
  id: number
  title: string
  content: string
  image?: string
  date: string
  status: "published" | "draft"
}

interface PageManagementProps {
  pageType: string
  title: string
}

export function PageManagement({ pageType, title }: PageManagementProps) {
  const [items, setItems] = useState<PageItem[]>([
    {
      id: 1,
      title: `Contoh Item ${pageType} 1`,
      content: `Ini adalah konten contoh untuk ${pageType}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      title: `Contoh Item ${pageType} 2`,
      content: `Konten contoh lain untuk ${pageType}. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-01-10",
      status: "draft",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PageItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    status: "published" as "published" | "draft",
  })

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    const newItem: PageItem = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      image: formData.image || "/placeholder.svg?height=200&width=300",
      date: new Date().toISOString().split("T")[0],
      status: formData.status,
    }
    setItems([...items, newItem])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditItem = () => {
    if (!editingItem) return

    const updatedItem: PageItem = {
      ...editingItem,
      title: formData.title,
      content: formData.content,
      image: formData.image || "/placeholder.svg?height=200&width=300",
      status: formData.status,
    }

    setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    setIsEditDialogOpen(false)
    setEditingItem(null)
    resetForm()
  }

  const handleDeleteItem = (id: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus item ${pageType} ini?`)) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const openEditDialog = (item: PageItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      image: item.image || "",
      status: item.status,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
      status: "published",
    })
  }

  const ItemForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={`Masukkan judul ${pageType}`}
        />
      </div>

      <div>
        <Label htmlFor="content">Konten</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={`Masukkan konten ${pageType}`}
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="image">Tambahkan Gambar</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Masukkan gambar atau kosongkan untuk placeholder"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="published">Diterbitkan</option>
          <option value="draft">Draf</option>
        </select>
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
          <h2 className="text-3xl font-bold text-primary-blue">{title}</h2>
          <p className="text-gray-600">Kelola konten {pageType} Anda</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="primary-blue hover:bg-blue-800" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)} Baru</DialogTitle>
              <DialogDescription>
                Buat {pageType} baru untuk ditampilkan di website. Pastikan semua field yang wajib diisi telah terisi dengan benar.
              </DialogDescription>
            </DialogHeader>
            <ItemForm
              onSubmit={handleAddItem}
              submitLabel={`Tambah ${pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}`}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Cari ${pageType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {item.status === "published" ? "Diterbitkan" : "Draf"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-primary-blue mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.content}</p>
                <p className="text-xs text-gray-500 mb-4">{item.date}</p>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}</DialogTitle>
            <DialogDescription>
              Ubah informasi {pageType} sesuai kebutuhan. Pastikan semua field yang wajib diisi telah terisi dengan benar.
            </DialogDescription>
          </DialogHeader>
          <ItemForm
            onSubmit={handleEditItem}
            submitLabel={`Perbarui ${pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
