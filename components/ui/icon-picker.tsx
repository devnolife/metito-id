"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as LucideIcons from "lucide-react"
import { Search } from "lucide-react"

// Daftar icon yang relevan untuk kategori produk
const AVAILABLE_ICONS = [
  "Package",
  "Droplets",
  "Zap",
  "Filter",
  "Shield",
  "Wrench",
  "Settings",
  "Truck",
  "Hammer",
  "Cog",
  "Tool",
  "Factory",
  "Box",
  "Container",
  "Cylinder",
  "Gauge",
  "Power",
  "Boxes",
  "PackageOpen",
  "PackageCheck",
  "Spray",
  "Waves",
  "Wind",
  "CloudRain",
  "Pipette",
  "TestTube",
  "Beaker",
  "FlaskConical",
  "Lightbulb",
  "Flame",
  "Battery",
  "BatteryCharging",
  "Plug",
  "Radio",
  "Wifi",
  "Activity",
  "BarChart",
  "PieChart",
  "TrendingUp",
  "Target",
  "Award",
  "Star",
  "Heart",
  "ThumbsUp",
  "CheckCircle",
  "XCircle",
  "AlertCircle",
  "Info",
]

interface IconPickerProps {
  value?: string
  onChange: (iconName: string) => void
  color?: string
}

export function IconPicker({ value, onChange, color = "#3B82F6" }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter icons berdasarkan search query
  const filteredIcons = AVAILABLE_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    return (LucideIcons as any)[iconName]
  }

  const SelectedIcon = value ? getIconComponent(value) : null

  return (
    <div className="space-y-3">
      {/* Preview Icon yang Dipilih */}
      {value && SelectedIcon && (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <SelectedIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Icon Terpilih</p>
            <p className="text-xs text-gray-600">{value}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari icon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Icon Grid */}
      <ScrollArea className="h-[300px] border rounded-lg p-3">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = getIconComponent(iconName)
            if (!IconComponent) return null

            const isSelected = value === iconName

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  hover:border-blue-500 hover:bg-blue-50
                  flex flex-col items-center justify-center gap-1
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                  }
                `}
                title={iconName}
              >
                <IconComponent className="w-5 h-5 text-gray-700" />
                <span className="text-[10px] text-gray-500 text-center leading-tight">
                  {iconName}
                </span>
              </button>
            )
          })}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada icon yang ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci lain</p>
          </div>
        )}
      </ScrollArea>

      {/* Info */}
      <p className="text-xs text-gray-500">
        Pilih icon dari grid di atas. Icon akan ditampilkan dengan warna yang Anda pilih.
      </p>
    </div>
  )
}
