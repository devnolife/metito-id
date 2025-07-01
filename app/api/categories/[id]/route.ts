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
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { 
        id: params.id,
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
  { params }: { params: { id: string } }
) {
  try {
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
        id: params.id,
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
          id: { not: params.id },
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
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { 
        id: params.id,
        isActive: true 
      },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    })

    if (!existingCategory) {
      return errorResponse('Category not found', 404)
    }

    // Check if category has products
    if (existingCategory.products.length > 0) {
      return errorResponse('Cannot delete category with existing products. Please move or delete the products first.', 400)
    }

    // Soft delete category (set isActive to false)
    await db.category.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return successResponse(null, 'Category deleted successfully')

  } catch (error) {
    console.error('Delete category error:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
