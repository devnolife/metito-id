"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { useToast } from "@/hooks/use-toast"
import { Plus, Users, Search, Mail, Phone, MapPin } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  status: 'active' | 'inactive'
  totalOrders: number
  createdAt: string
}

export function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Mock data - replace with actual API calls
      const mockCustomers: Customer[] = [
        {
          id: "1",
          name: "PT Industri Maju",
          email: "info@industrimaju.com",
          phone: "+62-21-12345678",
          company: "PT Industri Maju",
          address: "Jakarta Pusat, DKI Jakarta",
          status: "active",
          totalOrders: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "CV Sukses Mandiri",
          email: "contact@suksesmandiri.co.id",
          phone: "+62-31-87654321",
          company: "CV Sukses Mandiri",
          address: "Surabaya, Jawa Timur",
          status: "active",
          totalOrders: 8,
          createdAt: new Date().toISOString()
        }
      ]

      setCustomers(mockCustomers)

      toast({
        title: "Data Berhasil Dimuat",
        description: `${mockCustomers.length} pelanggan ditemukan`,
        variant: "default",
      })
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Kesalahan",
        description: "Gagal memuat data pelanggan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <LoadingOverlay
        message="Memuat data pelanggan..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pelanggan</h1>
          <p className="text-gray-600">Kelola data pelanggan dan kontak bisnis</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => toast({ title: "Coming Soon", description: "Fitur tambah pelanggan akan segera hadir" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pelanggan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Pelanggan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan Aktif</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Sedang aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            <p className="text-xs text-muted-foreground">Pesanan keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari pelanggan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                  {customer.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{customer.address}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Pesanan:</span>
                    <span className="font-semibold">{customer.totalOrders}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming Soon", description: "Fitur edit akan segera hadir" })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming Soon", description: "Fitur hapus akan segera hadir" })}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada pelanggan</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Tidak ada pelanggan yang sesuai dengan pencarian"
              : "Mulai dengan menambahkan pelanggan pertama Anda"
            }
          </p>
        </div>
      )}
    </div>
  )
} 
