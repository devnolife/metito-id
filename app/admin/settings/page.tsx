"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Database, Mail, Globe } from "lucide-react"

export default function AdminSettingsPage() {
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
                Pengaturan Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="show-prices" />
                <Label htmlFor="show-prices">Tampilkan Harga</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-stock" />
                <Label htmlFor="show-stock">Tampilkan Stok</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-orders" />
                <Label htmlFor="allow-orders">Izinkan Pemesanan</Label>
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
