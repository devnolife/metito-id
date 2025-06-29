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
      label: 'Show Product Prices',
      description: 'Display product prices on the website and landing pages'
    },
    {
      key: 'show_prices_landing',
      value: true,
      type: 'boolean',
      category: 'display',
      label: 'Show Prices on Landing Page',
      description: 'Display product prices specifically on the landing page featured products section'
    },
    {
      key: 'contact_email',
      value: 'info@metito-water.com',
      type: 'string',
      category: 'contact',
      label: 'Contact Email',
      description: 'Main contact email address'
    },
    {
      key: 'contact_phone',
      value: '+1-555-0123',
      type: 'string',
      category: 'contact',
      label: 'Contact Phone',
      description: 'Main contact phone number'
    },
    {
      key: 'company_address',
      value: '123 Water Treatment St, Industrial Zone',
      type: 'string',
      category: 'contact',
      label: 'Company Address',
      description: 'Main company address'
    },
    {
      key: 'site_maintenance',
      value: false,
      type: 'boolean',
      category: 'general',
      label: 'Maintenance Mode',
      description: 'Enable maintenance mode for the website'
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
        description: "Failed to load settings",
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
        title: "No Changes",
        description: "No changes to save",
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
          title: "Success",
          description: "Settings saved successfully",
        })
        setChanges({})
        fetchSettings() // Refresh settings
      } else {
        throw new Error(data.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
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
      description: "Changes have been reset",
    })
  }

  const renderSettingInput = (setting: Setting) => {
    const currentValue = getCurrentValue(setting)

    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={currentValue}
              onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
            />
            <Label className="text-sm">
              {currentValue ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        )

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.description}
            rows={3}
          />
        )

      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.description}
            type={setting.type === 'number' ? 'number' : 'text'}
          />
        )
    }
  }

  const getSettingsByCategory = () => {
    const allSettings = [...settings]

    // Add default settings that don't exist yet
    defaultSettings.forEach(defaultSetting => {
      if (!allSettings.find(s => s.key === defaultSetting.key)) {
        allSettings.push(defaultSetting as Setting)
      }
    })

    const categories = allSettings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    }, {} as Record<string, Setting[]>)

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
        return 'Display Settings'
      case 'contact':
        return 'Contact Information'
      case 'general':
        return 'General Settings'
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    )
  }

  const categories = getSettingsByCategory()
  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your website settings and configuration</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={resetChanges}
              disabled={saving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button
            onClick={saveSettings}
            disabled={saving || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                You have {Object.keys(changes).length} unsaved change(s)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings by Category */}
      {Object.entries(categories).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {getCategoryTitle(category)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categorySettings.map((setting, index) => (
              <div key={setting.key}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {setting.label || setting.key}
                    </Label>
                    {changes.hasOwnProperty(setting.key) && (
                      <Badge variant="outline" className="text-xs">
                        Modified
                      </Badge>
                    )}
                  </div>
                  {setting.description && (
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  )}
                  {renderSettingInput(setting)}
                </div>
                {index < categorySettings.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Price Display Preview */}
      {changes.hasOwnProperty('show_prices') || changes.hasOwnProperty('show_prices_landing') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <DollarSign className="w-5 h-5" />
              Price Display Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Product Pages:</span>
                <Badge variant={getCurrentValue(settings.find(s => s.key === 'show_prices') || defaultSettings[0]) ? 'default' : 'secondary'}>
                  {getCurrentValue(settings.find(s => s.key === 'show_prices') || defaultSettings[0]) ? 'Prices Shown' : 'Prices Hidden'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Landing Page:</span>
                <Badge variant={getCurrentValue(settings.find(s => s.key === 'show_prices_landing') || defaultSettings[1]) ? 'default' : 'secondary'}>
                  {getCurrentValue(settings.find(s => s.key === 'show_prices_landing') || defaultSettings[1]) ? 'Prices Shown' : 'Prices Hidden'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
