import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse
} from '@/lib/api-response'
import { validateAdminAccess } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Get specific setting
      const setting = await db.setting.findUnique({
        where: { key, isActive: true }
      })

      if (!setting) {
        return notFoundResponse('Setting not found')
      }

      // Parse value based on type
      let parsedValue: any = setting.value
      if (setting.type === 'boolean') {
        parsedValue = setting.value === 'true'
      } else if (setting.type === 'number') {
        parsedValue = parseFloat(setting.value)
      } else if (setting.type === 'json') {
        parsedValue = JSON.parse(setting.value)
      }

      return successResponse({ ...setting, value: parsedValue })
    }

    // Get all settings
    const settings = await db.setting.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    })

    // Parse values based on type
    const parsedSettings = settings.map(setting => {
      let parsedValue: any = setting.value
      if (setting.type === 'boolean') {
        parsedValue = setting.value === 'true'
      } else if (setting.type === 'number') {
        parsedValue = parseFloat(setting.value)
      } else if (setting.type === 'json') {
        parsedValue = JSON.parse(setting.value)
      }
      return { ...setting, value: parsedValue }
    })

    return successResponse(parsedSettings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return errorResponse('Failed to fetch settings')
  }
}

// PUT /api/settings - Update settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await validateAdminAccess(request)

    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return errorResponse('Settings must be an array')
    }

    // Update settings in transaction
    const updatedSettings = await db.$transaction(async (tx) => {
      const results = []

      for (const setting of settings) {
        const { key, value, type = 'string' } = setting

        if (!key) {
          throw new Error('Setting key is required')
        }

        // Convert value to string for storage
        let stringValue = value
        if (type === 'boolean') {
          stringValue = value ? 'true' : 'false'
        } else if (type === 'number') {
          stringValue = value.toString()
        } else if (type === 'json') {
          stringValue = JSON.stringify(value)
        } else {
          stringValue = String(value)
        }

        const result = await tx.setting.upsert({
          where: { key },
          update: {
            value: stringValue,
            type,
            updatedAt: new Date()
          },
          create: {
            key,
            value: stringValue,
            type,
            category: setting.category || 'general',
            label: setting.label,
            description: setting.description
          }
        })

        results.push(result)
      }

      return results
    })

    return successResponse(updatedSettings, 'Settings updated successfully')
  } catch (error) {
    console.error('Settings PUT error:', error)
    if (error instanceof Error) {
      if (error.message === 'Authentication required' || error.message === 'Admin access required') {
        return unauthorizedResponse(error.message)
      }
    }
    return errorResponse('Failed to update settings')
  }
}

// POST /api/settings - Create or update setting (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await validateAdminAccess(request)

    const body = await request.json()
    const { key, value, type = 'string', category = 'general', label, description } = body

    if (!key || value === undefined) {
      return errorResponse('Key and value are required')
    }

    // Convert value to string for storage
    let stringValue = value
    if (type === 'boolean') {
      stringValue = value ? 'true' : 'false'
    } else if (type === 'number') {
      stringValue = value.toString()
    } else if (type === 'json') {
      stringValue = JSON.stringify(value)
    } else {
      stringValue = String(value)
    }

    // Use upsert to create or update
    const setting = await db.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        category,
        label,
        description,
        updatedAt: new Date()
      },
      create: {
        key,
        value: stringValue,
        type,
        category,
        label,
        description
      }
    })

    return successResponse(setting, 'Setting saved successfully')
  } catch (error) {
    console.error('Settings POST error:', error)
    if (error instanceof Error) {
      if (error.message === 'Authentication required' || error.message === 'Admin access required') {
        return unauthorizedResponse(error.message)
      }
    }
    return errorResponse('Failed to save setting')
  }
} 
