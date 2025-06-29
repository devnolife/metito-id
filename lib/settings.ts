// Settings utility functions for client-side usage

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

// Cache for settings to avoid repeated API calls
let settingsCache: Record<string, any> = {}
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Default settings values
const DEFAULT_SETTINGS = {
  show_prices: true,
  show_prices_landing: true,
  contact_email: 'info@metito-water.com',
  contact_phone: '+1-555-0123',
  company_address: '123 Water Treatment St, Industrial Zone',
  site_maintenance: false
}

/**
 * Fetch a specific setting by key
 */
export async function getSetting(key: string): Promise<any> {
  // Check cache first
  const now = Date.now()
  if (settingsCache[key] !== undefined && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache[key]
  }

  try {
    const response = await fetch(`/api/settings?key=${encodeURIComponent(key)}`)
    const data = await response.json()

    if (data.success) {
      settingsCache[key] = data.data.value
      cacheTimestamp = now
      return data.data.value
    } else {
      // Return default value if setting not found
      return DEFAULT_SETTINGS[key] ?? null
    }
  } catch (error) {
    console.error('Error fetching setting:', error)
    // Return default value on error
    return DEFAULT_SETTINGS[key] ?? null
  }
}

/**
 * Fetch all settings
 */
export async function getAllSettings(): Promise<Record<string, any>> {
  // Check cache first
  const now = Date.now()
  if (Object.keys(settingsCache).length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache
  }

  try {
    const response = await fetch('/api/settings')
    const data = await response.json()

    if (data.success) {
      const settings = {}
      data.data.forEach((setting: Setting) => {
        settings[setting.key] = setting.value
      })

      // Merge with defaults for any missing settings
      settingsCache = { ...DEFAULT_SETTINGS, ...settings }
      cacheTimestamp = now
      return settingsCache
    } else {
      // Return defaults if no settings found
      settingsCache = DEFAULT_SETTINGS
      cacheTimestamp = now
      return settingsCache
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return defaults on error
    settingsCache = DEFAULT_SETTINGS
    cacheTimestamp = now
    return settingsCache
  }
}

/**
 * Clear settings cache (useful after updates)
 */
export function clearSettingsCache(): void {
  settingsCache = {}
  cacheTimestamp = 0
}

/**
 * Get setting with fallback to default
 */
export function getSettingWithDefault(key: string, defaultValue: any = null): any {
  return settingsCache[key] ?? DEFAULT_SETTINGS[key] ?? defaultValue
}

/**
 * Check if prices should be shown
 */
export async function shouldShowPrices(): Promise<boolean> {
  const showPrices = await getSetting('show_prices')
  return showPrices !== false // Default to true if not set
}

/**
 * Check if prices should be shown on landing page
 */
export async function shouldShowPricesOnLanding(): Promise<boolean> {
  const showPricesLanding = await getSetting('show_prices_landing')
  return showPricesLanding !== false // Default to true if not set
}

/**
 * Hook for React components to use settings
 * Note: This should be used in a separate hook file for better organization
 */
// export function useSettings() {
//   const [settings, setSettings] = useState<Record<string, any>>(settingsCache)
//   const [loading, setLoading] = useState(false)

//   const refreshSettings = async () => {
//     setLoading(true)
//     try {
//       const newSettings = await getAllSettings()
//       setSettings(newSettings)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(settingsCache).length === 0) {
//       refreshSettings()
//     }
//   }, [])

//   return {
//     settings,
//     loading,
//     refreshSettings,
//     getSetting: (key: string) => settings[key] ?? DEFAULT_SETTINGS[key],
//     shouldShowPrices: () => settings.show_prices !== false,
//     shouldShowPricesOnLanding: () => settings.show_prices_landing !== false
//   }
// } 
