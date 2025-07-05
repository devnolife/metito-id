"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Settings,
  Eye,
  EyeOff,
  DollarSign,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface Setting {
  id: string
  key: string
  value: any
  type: string
  category: string
  label?: string
  description?: string
  isActive: boolean
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changes, setChanges] = useState<Record<string, any>>({})

  // Default settings structure
  const defaultSettings = [
    {
      key: 'show_prices',
      value: true,
      type: 'boolean',
      category: 'display',
      label: 'Tampilkan Harga Produk',
      description: 'Tampilkan harga produk di website dan landing page'
    },
    {
      key: 'show_prices_landing',
      value: true,
      type: 'boolean',
      category: 'display',
      label: 'Tampilkan Harga di Landing Page',
      description: 'Tampilkan harga produk khusus di bagian produk unggulan landing page'
    },
    {
      key: 'contact_email',
      value: 'info@metito-water.com',
      type: 'string',
      category: 'contact',
      label: 'Email Kontak',
      description: 'Alamat email kontak utama'
    },
    {
      key: 'contact_phone',
      value: '+1-555-0123',
      type: 'string',
      category: 'contact',
      label: 'Telepon Kontak',
      description: 'Nomor telepon kontak utama'
    },
    {
      key: 'company_address',
      value: '123 Water Treatment St, Industrial Zone',
      type: 'string',
      category: 'contact',
      label: 'Alamat Perusahaan',
      description: 'Alamat perusahaan utama'
    },
    {
      key: 'site_maintenance',
      value: false,
      type: 'boolean',
      category: 'general',
      label: 'Mode Pemeliharaan',
      description: 'Aktifkan mode pemeliharaan untuk website'
    }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.data)
      } else {
        // If no settings exist, initialize with defaults
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan",
        variant: "destructive"
      })
      // Use defaults on error
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setChanges(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getCurrentValue = (setting: Setting) => {
    return changes.hasOwnProperty(setting.key) ? changes[setting.key] : setting.value
  }

  const saveSettings = async () => {
    if (Object.keys(changes).length === 0) {
      toast({
        title: "Tidak Ada Perubahan",
        description: "Tidak ada perubahan untuk disimpan",
      })
      return
    }

    try {
      setSaving(true)

      const settingsToUpdate = Object.entries(changes).map(([key, value]) => {
        const setting = settings.find(s => s.key === key) || defaultSettings.find(s => s.key === key)
        return {
          key,
          value,
          type: setting?.type || 'string',
          category: setting?.category || 'general',
          label: setting?.label,
          description: setting?.description
        }
      })

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToUpdate })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Pengaturan berhasil disimpan",
        })
        setChanges({})
        fetchSettings() // Refresh settings
      } else {
        throw new Error(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const resetChanges = () => {
    setChanges({})
    toast({
      title: "Reset",
      description: "Perubahan telah direset",
    })
  }

  const getSettingsByCategory = () => {
    const categories: Record<string, Setting[]> = {}
    const allSettings = [...settings, ...defaultSettings.filter(ds => !settings.find(s => s.key === ds.key))]

    allSettings.forEach(setting => {
      if (!categories[setting.category]) {
        categories[setting.category] = []
      }
      categories[setting.category].push(setting)
    })

    return categories
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'display':
        return <Eye className="w-5 h-5" />
      case 'contact':
        return <Phone className="w-5 h-5" />
      case 'general':
        return <Settings className="w-5 h-5" />
      default:
        return <Settings className="w-5 h-5" />
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'display':
        return 'Tampilan'
      case 'contact':
        return 'Kontak'
      case 'general':
        return 'Umum'
      default:
        return category
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  const settingsByCategory = getSettingsByCategory()
  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary-blue mb-2">Manajemen Pengaturan</h2>
          <p className="text-gray-600">Kelola pengaturan website dan aplikasi</p>
        </div>

        <div className="flex space-x-2">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={resetChanges}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
            className="primary-blue hover:bg-blue-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-orange-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Anda memiliki {Object.keys(changes).length} perubahan yang belum disimpan
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(settingsByCategory).map(([category, categorySettings]) => (
          <Card key={category} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-blue">
                {getCategoryIcon(category)}
                <span className="ml-2">{getCategoryTitle(category)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categorySettings.map((setting, index) => (
                <div key={setting.key}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium text-gray-900">
                          {setting.label || setting.key}
                        </Label>
                        {hasChanges && changes.hasOwnProperty(setting.key) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Diubah
                          </Badge>
                        )}
                      </div>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {setting.type === 'boolean' ? (
                        <Switch
                          checked={getCurrentValue(setting)}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                        />
                      ) : setting.type === 'string' ? (
                        <Input
                          value={getCurrentValue(setting)}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="w-64"
                          placeholder={`Masukkan ${setting.label?.toLowerCase() || setting.key}`}
                        />
                      ) : (
                        <Input
                          type="number"
                          value={getCurrentValue(setting)}
                          onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value))}
                          className="w-64"
                          placeholder={`Masukkan ${setting.label?.toLowerCase() || setting.key}`}
                        />
                      )}
                    </div>
                  </div>
                  {index < categorySettings.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
