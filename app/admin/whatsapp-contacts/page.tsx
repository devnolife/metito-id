"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Save, X, Phone, Mail, ArrowUp, ArrowDown, MessageCircle, Loader2 } from 'lucide-react'
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
  { value: 'bg-emerald-600', label: 'Hijau' },
  { value: 'bg-blue-600', label: 'Biru' },
  { value: 'bg-sky-600', label: 'Biru Langit' },
  { value: 'bg-indigo-600', label: 'Indigo' },
  { value: 'bg-purple-600', label: 'Ungu' },
  { value: 'bg-pink-600', label: 'Pink' },
  { value: 'bg-red-600', label: 'Merah' },
  { value: 'bg-orange-600', label: 'Oranye' },
  { value: 'bg-teal-600', label: 'Teal' },
]

export default function WhatsAppContactsPage() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<WhatsAppContact | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    role: '',
    color: 'bg-emerald-600',
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
        title: 'Kesalahan',
        description: 'Gagal memuat kontak',
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
        color: 'bg-emerald-600',
        isActive: true,
        sortOrder: contacts.length,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
    setSaving(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
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
          title: 'Berhasil',
          description: data.message || (editingContact ? 'Kontak berhasil diperbarui' : 'Kontak berhasil ditambahkan'),
        })
        fetchContacts()
        handleCloseDialog()
      } else {
        toast({
          title: 'Kesalahan',
          description: data.message || 'Gagal menyimpan kontak',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Kesalahan',
        description: 'Gagal menyimpan kontak',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kontak ini?')) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/whatsapp-contacts/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Berhasil',
          description: 'Kontak berhasil dihapus',
        })
        fetchContacts()
      } else {
        toast({
          title: 'Kesalahan',
          description: data.message || 'Gagal menghapus kontak',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Kesalahan',
        description: 'Gagal menghapus kontak',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
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
      setMoving(contact.id)
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
        title: 'Kesalahan',
        description: 'Gagal mengubah urutan kontak',
        variant: 'destructive',
      })
    } finally {
      setMoving(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-500">Memuat kontak...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Kontak WhatsApp</h1>
          <p className="text-gray-500 mt-1">Kelola kontak WhatsApp untuk pertanyaan produk</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Tambah Kontak
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <Card key={contact.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${contact.color} rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0`}>
                  {contact.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold">{contact.name}</h3>
                    {!contact.isActive && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Tidak Aktif</span>
                    )}
                  </div>
                  {contact.role && (
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="break-all">{contact.phoneNumber}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(contact, 'up')}
                      title="Pindah ke atas"
                      disabled={moving === contact.id}
                    >
                      {moving === contact.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  {index < contacts.length - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(contact, 'down')}
                      title="Pindah ke bawah"
                      disabled={moving === contact.id}
                    >
                      {moving === contact.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(contact)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                    title="Hapus"
                    disabled={deleting === contact.id}
                  >
                    {deleting === contact.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada kontak</h3>
              <p className="text-gray-500 mb-4">Tambahkan kontak WhatsApp pertama Anda untuk memulai</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kontak
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Kontak' : 'Tambah Kontak Baru'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Perbarui informasi kontak di bawah ini' : 'Tambahkan kontak penjualan WhatsApp baru'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="081234567890"
                required
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Jabatan</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Manajer Penjualan"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Warna Avatar</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
                disabled={saving}
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
              <Label htmlFor="isActive">Aktif</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={saving}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1"
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingContact ? 'Perbarui' : 'Tambah'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
