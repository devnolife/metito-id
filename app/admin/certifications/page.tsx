"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, Award, Building, CheckCircle, XCircle } from "lucide-react"

interface Certification {
  id: number
  name: string
  description: string
  issuingBody: string
  issueDate: string
  expirationDate: string
  certificateNumber: string
  certificateImage: string
  status: "active" | "expired" | "pending"
  credentialUrl?: string
  category: string
  level: string
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      name: "ISO 9001:2015 Quality Management System",
      description: "Sertifikasi sistem manajemen mutu internasional yang memastikan standar kualitas tertinggi dalam produk dan layanan.",
      issuingBody: "Bureau Veritas",
      issueDate: "2023-01-15",
      expirationDate: "2026-01-15",
      certificateNumber: "ID-QMS-2023-001",
      certificateImage: "/certificates/iso-9001.jpg",
      status: "active",
      credentialUrl: "https://certificates.bureauveritas.com/verify/ID-QMS-2023-001",
      category: "Quality Management",
      level: "International"
    },
    {
      id: 2,
      name: "ISO 14001:2015 Environmental Management",
      description: "Sertifikasi sistem manajemen lingkungan yang menunjukkan komitmen perusahaan terhadap keberlanjutan lingkungan.",
      issuingBody: "SGS",
      issueDate: "2023-03-20",
      expirationDate: "2026-03-20",
      certificateNumber: "ID-EMS-2023-002",
      certificateImage: "/certificates/iso-14001.jpg",
      status: "active",
      credentialUrl: "https://certificates.sgs.com/verify/ID-EMS-2023-002",
      category: "Environmental",
      level: "International"
    },
    {
      id: 3,
      name: "OHSAS 18001 Occupational Health Safety",
      description: "Sertifikasi keselamatan dan kesehatan kerja yang memastikan standar keamanan terbaik bagi karyawan.",
      issuingBody: "TUV SUD",
      issueDate: "2022-06-10",
      expirationDate: "2025-06-10",
      certificateNumber: "ID-OHS-2022-003",
      certificateImage: "/certificates/ohsas-18001.jpg",
      status: "active",
      credentialUrl: "https://certificates.tuvsud.com/verify/ID-OHS-2022-003",
      category: "Health & Safety",
      level: "International"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    issuingBody: "",
    issueDate: "",
    expirationDate: "",
    certificateNumber: "",
    certificateImage: "",
    status: "active" as "active" | "expired" | "pending",
    credentialUrl: "",
    category: "",
    level: ""
  })

  const categories = ["Quality Management", "Environmental", "Health & Safety", "Technical", "Professional", "Industry Specific"]
  const levels = ["International", "National", "Regional", "Industry"]

  const filteredCertifications = certifications.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuingBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCertification = () => {
    const newCertification: Certification = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      issuingBody: formData.issuingBody,
      issueDate: formData.issueDate,
      expirationDate: formData.expirationDate,
      certificateNumber: formData.certificateNumber,
      certificateImage: formData.certificateImage || "/placeholder.svg?height=300&width=400",
      status: formData.status,
      credentialUrl: formData.credentialUrl,
      category: formData.category,
      level: formData.level
    }
    setCertifications([...certifications, newCertification])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCertification = () => {
    if (!editingCertification) return

    const updatedCertification: Certification = {
      ...editingCertification,
      name: formData.name,
      description: formData.description,
      issuingBody: formData.issuingBody,
      issueDate: formData.issueDate,
      expirationDate: formData.expirationDate,
      certificateNumber: formData.certificateNumber,
      certificateImage: formData.certificateImage || "/placeholder.svg?height=300&width=400",
      status: formData.status,
      credentialUrl: formData.credentialUrl,
      category: formData.category,
      level: formData.level
    }

    setCertifications(certifications.map((cert) => (cert.id === editingCertification.id ? updatedCertification : cert)))
    setIsEditDialogOpen(false)
    setEditingCertification(null)
    resetForm()
  }

  const handleDeleteCertification = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus sertifikasi ini?")) {
      setCertifications(certifications.filter((cert) => cert.id !== id))
    }
  }

  const openEditDialog = (certification: Certification) => {
    setEditingCertification(certification)
    setFormData({
      name: certification.name,
      description: certification.description,
      issuingBody: certification.issuingBody,
      issueDate: certification.issueDate,
      expirationDate: certification.expirationDate,
      certificateNumber: certification.certificateNumber,
      certificateImage: certification.certificateImage,
      status: certification.status,
      credentialUrl: certification.credentialUrl || "",
      category: certification.category,
      level: certification.level
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      issuingBody: "",
      issueDate: "",
      expirationDate: "",
      certificateNumber: "",
      certificateImage: "",
      status: "active",
      credentialUrl: "",
      category: "",
      level: ""
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Calendar className="w-4 h-4 text-yellow-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const CertificationForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nama Sertifikasi</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama sertifikasi"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi singkat tentang sertifikasi"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issuingBody">Lembaga Penerbit</Label>
          <Input
            id="issuingBody"
            value={formData.issuingBody}
            onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
            placeholder="Nama lembaga penerbit"
          />
        </div>

        <div>
          <Label htmlFor="certificateNumber">Nomor Sertifikat</Label>
          <Input
            id="certificateNumber"
            value={formData.certificateNumber}
            onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
            placeholder="Nomor sertifikat"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Tanggal Terbit</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="expirationDate">Tanggal Kadaluarsa</Label>
          <Input
            id="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Pilih level</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="certificateImage">Gambar Sertifikat</Label>
        <Input
          id="certificateImage"
          value={formData.certificateImage}
          onChange={(e) => setFormData({ ...formData, certificateImage: e.target.value })}
          placeholder="URL gambar sertifikat"
        />
      </div>

      <div>
        <Label htmlFor="credentialUrl">URL Verifikasi (Opsional)</Label>
        <Input
          id="credentialUrl"
          value={formData.credentialUrl}
          onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
          placeholder="URL untuk verifikasi sertifikat"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "expired" | "pending" })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="active">Aktif</option>
          <option value="expired">Kadaluarsa</option>
          <option value="pending">Menunggu</option>
        </select>
      </div>

      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
        {submitLabel}
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Manajemen Sertifikasi</h1>
        <p className="text-gray-600">Kelola sertifikasi dan kredensial</p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Certifications Management</h2>
              <p className="text-gray-600">Kelola sertifikasi dan kredensial perusahaan</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Sertifikasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Sertifikasi Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan sertifikasi baru untuk ditampilkan di website. Pastikan semua informasi sertifikat akurat.
                  </DialogDescription>
                </DialogHeader>
                <CertificationForm onSubmit={handleAddCertification} submitLabel="Tambah Sertifikasi" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari sertifikasi, lembaga penerbit, atau nomor sertifikat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={cert.certificateImage}
                      alt={cert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(cert.status)}>
                        {getStatusIcon(cert.status)}
                        <span className="ml-1">
                          {cert.status === "active" ? "Aktif" :
                            cert.status === "expired" ? "Kadaluarsa" : "Menunggu"}
                        </span>
                      </Badge>
                      <Badge variant="outline">{cert.level}</Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{cert.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{cert.description}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{cert.issuingBody}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{cert.certificateNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {cert.issueDate} - {cert.expirationDate}
                      </span>
                    </div>

                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {cert.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      {cert.credentialUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cert.credentialUrl, '_blank')}
                        >
                          Verifikasi
                        </Button>
                      )}
                      <div className="flex gap-1 ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(cert)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCertification(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
                <DialogTitle>Edit Sertifikasi</DialogTitle>
                <DialogDescription>
                  Ubah informasi sertifikasi. Pastikan semua informasi sertifikat akurat.
                </DialogDescription>
              </DialogHeader>
              <CertificationForm onSubmit={handleEditCertification} submitLabel="Simpan Perubahan" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
