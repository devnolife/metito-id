import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

// GET /api/categories/[id] - Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: {
        id,
        isActive: true
      },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isFeatured: true,
          }
        }
      }
    })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(category)

  } catch (error) {
    console.error('Get category error:', error)
    return errorResponse('Failed to fetch category', 500)
  }
}

// PUT /api/categories/[id] - Update category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = updateCategorySchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { name, description, icon, color } = result.data

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: {
        id,
        isActive: true
      }
    })

    if (!existingCategory) {
      return errorResponse('Category not found', 404)
    }

    // Generate new slug if name is being updated
    let slug = existingCategory.slug
    if (name && name !== existingCategory.name) {
      slug = slugify(name, { lower: true, strict: true })

      // Check if new name/slug already exists
      const duplicateCategory = await db.category.findFirst({
        where: {
          id: { not: id },
          OR: [
            { name },
            { slug }
          ]
        }
      })

      if (duplicateCategory) {
        return errorResponse('Category with this name already exists', 409)
      }
    }

    // Update category
    const category = await db.category.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      }
    })

    return successResponse(category, 'Category updated successfully')

  } catch (error) {
    console.error('Update category error:', error)
    return errorResponse('Failed to update category', 500)
  }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Attempting to delete category:', id)

    // Check admin permission
    if (!(await isAdmin(request))) {
      console.log('Admin permission denied')
      return unauthorizedResponse('Admin access required')
    }

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: {
        id,
        isActive: true
      },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    })

    if (!existingCategory) {
      console.log('Category not found:', id)
      return errorResponse('Category not found', 404)
    }

    console.log('Found category:', existingCategory.name, 'with', existingCategory.products.length, 'products')

    // Check if category has products and handle them
    if (existingCategory.products.length > 0) {
      // Option 1: Move products to a default category or set categoryId to null
      // For now, we'll just soft delete the category and let products keep their categoryId
      // (they will show as "No Category" in the UI)

      console.log(`Category has ${existingCategory.products.length} products. Proceeding with soft delete.`)
    }

    // Soft delete category (set isActive to false)
    await db.category.update({
      where: { id },
      data: { isActive: false }
    })

    console.log('Category successfully deleted:', id)
    return successResponse(null, 'Category deleted successfully')

  } catch (error) {
    console.error('Delete category error:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
