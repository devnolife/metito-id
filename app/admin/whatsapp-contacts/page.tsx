"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Save, X, Phone, Mail, ArrowUp, ArrowDown, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WhatsAppContact {
  id: string
  name: string
  phoneNumber: string
  email: string | null
  role: string | null
  color: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  { value: 'bg-emerald-600', label: 'Green' },
  { value: 'bg-blue-600', label: 'Blue' },
  { value: 'bg-sky-600', label: 'Sky Blue' },
  { value: 'bg-indigo-600', label: 'Indigo' },
  { value: 'bg-purple-600', label: 'Purple' },
  { value: 'bg-pink-600', label: 'Pink' },
  { value: 'bg-red-600', label: 'Red' },
  { value: 'bg-orange-600', label: 'Orange' },
  { value: 'bg-teal-600', label: 'Teal' },
]

export default function WhatsAppContactsPage() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<WhatsAppContact | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    role: '',
    color: 'bg-green-600',
    isActive: true,
    sortOrder: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/whatsapp-contacts?includeInactive=true')
      const data = await response.json()
      if (data.success) {
        setContacts(data.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch contacts',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (contact?: WhatsAppContact) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        email: contact.email || '',
        role: contact.role || '',
        color: contact.color,
        isActive: contact.isActive,
        sortOrder: contact.sortOrder,
      })
    } else {
      setEditingContact(null)
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        role: '',
        color: 'bg-green-600',
        isActive: true,
        sortOrder: contacts.length,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingContact
        ? `/api/whatsapp-contacts/${editingContact.id}`
        : '/api/whatsapp-contacts'

      const method = editingContact ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message,
        })
        fetchContacts()
        handleCloseDialog()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save contact',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contact',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/whatsapp-contacts/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Contact deleted successfully',
        })
        fetchContacts()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete contact',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      })
    }
  }

  const handleMove = async (contact: WhatsAppContact, direction: 'up' | 'down') => {
    const currentIndex = contacts.findIndex(c => c.id === contact.id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === contacts.length - 1)
    ) {
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetContact = contacts[targetIndex]

    try {
      // Swap sort orders
      await Promise.all([
        fetch(`/api/whatsapp-contacts/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: targetContact.sortOrder }),
        }),
        fetch(`/api/whatsapp-contacts/${targetContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: contact.sortOrder }),
        }),
      ])

      fetchContacts()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder contacts',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Contacts</h1>
          <p className="text-gray-500 mt-1">Manage sales WhatsApp contacts for product inquiries</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <Card key={contact.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${contact.color} rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
                  {contact.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    {!contact.isActive && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                    )}
                  </div>
                  {contact.role && (
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {contact.phoneNumber}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(contact, 'up')}
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  )}
                  {index < contacts.length - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(contact, 'down')}
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(contact)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contacts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-500 mb-4">Add your first WhatsApp contact to get started</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Update the contact information below' : 'Add a new WhatsApp sales contact'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="081234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@metito.id"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Sales Manager"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Avatar Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${option.value} rounded-full`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editingContact ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
