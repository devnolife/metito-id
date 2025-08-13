"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Building, Phone, Mail, MapPin, Star, User, Globe } from "lucide-react"

interface Customer {
  id: number
  name: string
  company: string
  email: string
  phone: string
  address: string
  industry: string
  projectType: string
  testimonial: string
  rating: number
  avatar: string
  website?: string
  contactDate: string
  projectValue: string
  status: "active" | "completed" | "potential"
  isPublicTestimonial: boolean
  featured: boolean
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Dr. Ahmad Surya",
      company: "PT Industri Kimia Nusantara",
      email: "ahmad.surya@ikn.co.id",
      phone: "+62 812-1760-3950",
      address: "Jl. Industri Raya No. 123, Cikarang, Bekasi",
      industry: "Kimia & Petrokimia",
      projectType: "Sistem Pengolahan Air Limbah",
      testimonial: "Layanan Metito sangat profesional dan berkualitas tinggi. Sistem yang diinstal bekerja dengan sempurna dan memenuhi standar lingkungan yang ketat. Tim teknis sangat berpengalaman dan responsif.",
      rating: 5,
      avatar: "/images/testimonials/customer-1.jpg",
      website: "https://ikn.co.id",
      contactDate: "2023-02-15",
      projectValue: "Rp 2.5 Miliar",
      status: "completed",
      isPublicTestimonial: true,
      featured: true
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      company: "Hotel Grand Majestic",
      email: "siti.nurhaliza@grandmajestic.com",
      phone: "+62 21 5555 5678",
      address: "Jl. Sudirman No. 456, Jakarta Pusat",
      industry: "Hospitality & Tourism",
      projectType: "Sistem Water Treatment Hotel",
      testimonial: "Instalasi sistem air bersih untuk hotel kami sangat memuaskan. Kualitas air menjadi lebih baik dan tamu-tamu memberikan feedback positif. Pelayanan after-sales juga sangat baik.",
      rating: 5,
      avatar: "/images/testimonials/customer-2.jpg",
      website: "https://grandmajestic.com",
      contactDate: "2023-04-20",
      projectValue: "Rp 1.8 Miliar",
      status: "completed",
      isPublicTestimonial: true,
      featured: false
    },
    {
      id: 3,
      name: "Bambang Wijaya",
      company: "PT Perumahan Griya Indah",
      email: "bambang.wijaya@griyaindah.co.id",
      phone: "+62 21 5555 9012",
      address: "Jl. Raya Serpong No. 789, Tangerang Selatan",
      industry: "Real Estate & Construction",
      projectType: "Sistem Distribusi Air Bersih",
      testimonial: "Sistem distribusi air untuk kompleks perumahan kami sangat efisien. Instalasi cepat dan tidak mengganggu aktivitas penghuni. Kualitas air yang dihasilkan sesuai standar kesehatan.",
      rating: 4,
      avatar: "/images/testimonials/customer-3.jpg",
      contactDate: "2023-06-10",
      projectValue: "Rp 3.2 Miliar",
      status: "active",
      isPublicTestimonial: false,
      featured: false
    },
    {
      id: 4,
      name: "Lisa Permata",
      company: "PT Tekstil Mandiri",
      email: "lisa.permata@tekstilmandiri.com",
      phone: "+62 21 5555 3456",
      address: "Jl. Industri Tekstil No. 321, Bandung",
      industry: "Textile & Fashion",
      projectType: "Sistem Pengolahan Air Proses",
      testimonial: "Solusi pengolahan air proses untuk produksi tekstil kami sangat efektif. Membantu mengurangi limbah dan meningkatkan efisiensi produksi. Investasi yang sangat berharga.",
      rating: 5,
      avatar: "/images/testimonials/customer-4.jpg",
      website: "https://tekstilmandiri.com",
      contactDate: "2023-08-05",
      projectValue: "Rp 4.1 Miliar",
      status: "completed",
      isPublicTestimonial: true,
      featured: true
    },
    {
      id: 5,
      name: "Robert Tanaka",
      company: "Manufacturing Excellence Corp",
      email: "robert.tanaka@mexcel.com",
      phone: "+62 21 5555 7890",
      address: "Kawasan Industri MM2100, Cikarang Barat",
      industry: "Manufacturing",
      projectType: "Sistem RO Industrial",
      testimonial: "",
      rating: 0,
      avatar: "/images/testimonials/customer-5.jpg",
      website: "https://mexcel.com",
      contactDate: "2024-01-15",
      projectValue: "Rp 5.5 Miliar",
      status: "potential",
      isPublicTestimonial: false,
      featured: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    projectType: "",
    testimonial: "",
    rating: 5,
    avatar: "",
    website: "",
    contactDate: "",
    projectValue: "",
    status: "potential" as "active" | "completed" | "potential",
    isPublicTestimonial: false,
    featured: false
  })

  const industries = [
    "Kimia & Petrokimia",
    "Hospitality & Tourism",
    "Real Estate & Construction",
    "Textile & Fashion",
    "Manufacturing",
    "Food & Beverage",
    "Healthcare",
    "Education",
    "Government",
    "Others"
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.projectType.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "" || customer.status === selectedStatus) &&
      (selectedIndustry === "" || customer.industry === selectedIndustry)
  )

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: Date.now(),
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      industry: formData.industry,
      projectType: formData.projectType,
      testimonial: formData.testimonial,
      rating: formData.rating,
      avatar: formData.avatar || "/placeholder-user.jpg",
      website: formData.website,
      contactDate: formData.contactDate,
      projectValue: formData.projectValue,
      status: formData.status,
      isPublicTestimonial: formData.isPublicTestimonial,
      featured: formData.featured
    }
    setCustomers([...customers, newCustomer])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCustomer = () => {
    if (!editingCustomer) return

    const updatedCustomer: Customer = {
      ...editingCustomer,
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      industry: formData.industry,
      projectType: formData.projectType,
      testimonial: formData.testimonial,
      rating: formData.rating,
      avatar: formData.avatar || "/placeholder-user.jpg",
      website: formData.website,
      contactDate: formData.contactDate,
      projectValue: formData.projectValue,
      status: formData.status,
      isPublicTestimonial: formData.isPublicTestimonial,
      featured: formData.featured
    }

    setCustomers(customers.map((customer) => (customer.id === editingCustomer.id ? updatedCustomer : customer)))
    setIsEditDialogOpen(false)
    setEditingCustomer(null)
    resetForm()
  }

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) {
      setCustomers(customers.filter((customer) => customer.id !== id))
    }
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      industry: customer.industry,
      projectType: customer.projectType,
      testimonial: customer.testimonial,
      rating: customer.rating,
      avatar: customer.avatar,
      website: customer.website || "",
      contactDate: customer.contactDate,
      projectValue: customer.projectValue,
      status: customer.status,
      isPublicTestimonial: customer.isPublicTestimonial,
      featured: customer.featured
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      projectType: "",
      testimonial: "",
      rating: 5,
      avatar: "",
      website: "",
      contactDate: "",
      projectValue: "",
      status: "potential",
      isPublicTestimonial: false,
      featured: false
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "potential":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "completed":
        return "Selesai"
      case "potential":
        return "Prospek"
      default:
        return "Unknown"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const CustomerForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Kontak</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama lengkap kontak"
          />
        </div>
        <div>
          <Label htmlFor="company">Nama Perusahaan</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Nama perusahaan"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@perusahaan.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+62 812-1760-3950"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Alamat lengkap perusahaan"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industri</Label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            aria-label="Pilih industri"
          >
            <option value="">Pilih industri</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="projectType">Jenis Proyek</Label>
          <Input
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            placeholder="Sistem Pengolahan Air Limbah"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactDate">Tanggal Kontak</Label>
          <Input
            id="contactDate"
            type="date"
            value={formData.contactDate}
            onChange={(e) => setFormData({ ...formData, contactDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="projectValue">Nilai Proyek</Label>
          <Input
            id="projectValue"
            value={formData.projectValue}
            onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })}
            placeholder="Rp 2.5 Miliar"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website (Opsional)</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://perusahaan.com"
          />
        </div>
        <div>
          <Label htmlFor="avatar">Foto Profil</Label>
          <Input
            id="avatar"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            placeholder="URL foto profil"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="testimonial">Testimoni</Label>
        <Textarea
          id="testimonial"
          value={formData.testimonial}
          onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
          placeholder="Tulis testimoni pelanggan (opsional)"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
            placeholder="5"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "completed" | "potential" })}
            className="w-full p-2 border border-gray-300 rounded-md"
            aria-label="Pilih status pelanggan"
          >
            <option value="potential">Prospek</option>
            <option value="active">Aktif</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublicTestimonial"
            checked={formData.isPublicTestimonial}
            onChange={(e) => setFormData({ ...formData, isPublicTestimonial: e.target.checked })}
            className="w-4 h-4"
            aria-label="Tampilkan testimoni di website"
          />
          <Label htmlFor="isPublicTestimonial">Tampilkan testimoni di website</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
            aria-label="Pelanggan unggulan"
          />
          <Label htmlFor="featured">Pelanggan unggulan</Label>
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
        {submitLabel}
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Manajemen Pelanggan</h1>
        <p className="text-gray-600">Kelola data pelanggan dan testimoni</p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Customer Management</h2>
              <p className="text-gray-600">Kelola data pelanggan dan testimoni</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pelanggan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan data pelanggan baru beserta informasi proyek dan testimoni.
                  </DialogDescription>
                </DialogHeader>
                <CustomerForm onSubmit={handleAddCustomer} submitLabel="Tambah Pelanggan" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama, perusahaan, email, atau jenis proyek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[120px]"
              aria-label="Filter berdasarkan status"
            >
              <option value="">Semua Status</option>
              <option value="potential">Prospek</option>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
            </select>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[150px]"
              aria-label="Filter berdasarkan industri"
            >
              <option value="">Semua Industri</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusLabel(customer.status)}
                      </Badge>
                      {customer.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Unggulan
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{customer.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 line-clamp-1">{customer.address}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium text-gray-700">Jenis Proyek:</p>
                    <p className="text-sm text-gray-600">{customer.projectType}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">Nilai Proyek:</p>
                    <p className="text-sm text-gray-600">{customer.projectValue}</p>
                  </div>

                  {customer.testimonial && (
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(customer.rating)}
                        </div>
                        {customer.isPublicTestimonial && (
                          <Badge variant="outline" className="text-xs">
                            Publik
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">{customer.testimonial}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{customer.contactDate}</span>
                    </div>
                    <div className="flex gap-1">
                      {customer.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(customer.website, '_blank')}
                        >
                          <Globe className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Data Pelanggan</DialogTitle>
                <DialogDescription>
                  Ubah informasi pelanggan beserta data proyek dan testimoni.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm onSubmit={handleEditCustomer} submitLabel="Simpan Perubahan" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
