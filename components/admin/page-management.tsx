"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
      title: `Sample ${pageType} Item 1`,
      content: `This is a sample content for ${pageType}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      title: `Sample ${pageType} Item 2`,
      content: `Another sample content for ${pageType}. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
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
    if (confirm(`Are you sure you want to delete this ${pageType} item?`)) {
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={`Enter ${pageType} title`}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={`Enter ${pageType} content`}
          rows={6}
        />
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
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
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
          <p className="text-gray-600">Manage your {pageType} content</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="primary-blue hover:bg-blue-800" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}</DialogTitle>
            </DialogHeader>
            <ItemForm
              onSubmit={handleAddItem}
              submitLabel={`Add ${pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}`}
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
              placeholder={`Search ${pageType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {item.image && (
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${item.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {item.status}
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary-blue mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.content}</p>

              <div className="text-xs text-gray-500 mb-4">Created: {new Date(item.date).toLocaleDateString()}</div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(item)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
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
            <DialogTitle>Edit {pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}</DialogTitle>
          </DialogHeader>
          <ItemForm
            onSubmit={handleEditItem}
            submitLabel={`Update ${pageType.charAt(0).toUpperCase() + pageType.slice(1, -1)}`}
          />
        </DialogContent>
      </Dialog>

      {filteredItems.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-primary-blue mb-2">No {pageType} Found</h3>
            <p className="text-gray-600">Try adjusting your search or add new content</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
