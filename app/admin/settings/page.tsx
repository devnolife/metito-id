"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Database, Mail, Globe, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Settings state
  const [showPrices, setShowPrices] = useState(true)
  const [showStock, setShowStock] = useState(true)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      const data = await response.json()

      if (data.success && data.data) {
        data.data.forEach((setting: any) => {
          if (setting.key === 'show_prices') {
            setShowPrices(setting.value === true || setting.value === 'true')
          } else if (setting.key === 'show_stock') {
            setShowStock(setting.value === true || setting.value === 'true')
          }
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (key: string, value: boolean) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value,
          type: 'boolean',
          category: 'product',
          label: key === 'show_prices' ? 'Tampilkan Harga Produk di Semua Halaman' :
            'Tampilkan Stok'
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to save setting')
      }

      toast({
        title: "Berhasil",
        description: `Pengaturan berhasil disimpan`,
      })
    } catch (error) {
      console.error('Error saving setting:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive"
      })
    }
  }

  const handleShowPricesChange = async (checked: boolean) => {
    setShowPrices(checked)
    await saveSetting('show_prices', checked)
  }

  const handleShowStockChange = async (checked: boolean) => {
    setShowStock(checked)
    await saveSetting('show_stock', checked)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nama Situs</Label>
                <Input id="site-name" placeholder="Masukkan nama situs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Deskripsi Situs</Label>
                <Input id="site-description" placeholder="Masukkan deskripsi situs" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Mode Pemeliharaan</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pengaturan Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Username</Label>
                <Input id="smtp-user" placeholder="your-email@gmail.com" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pengaturan Tampilan Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-prices" className="text-base">
                      Tampilkan Harga Produk
                    </Label>
                    <p className="text-sm text-gray-500">
                      Harga akan ditampilkan di semua halaman
                    </p>
                  </div>
                  <Switch
                    id="show-prices"
                    checked={showPrices}
                    onCheckedChange={handleShowPricesChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-stock" className="text-base">
                    Tampilkan Stok
                  </Label>
                  <p className="text-sm text-gray-500">
                    Status stok akan ditampilkan di semua halaman
                  </p>
                </div>
                <Switch
                  id="show-stock"
                  checked={showStock}
                  onCheckedChange={handleShowStockChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Pengaturan Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status Database</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Terhubung</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Backup Database
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button>Simpan Pengaturan</Button>
        </div>
      </div>
    </div>
  )
}
