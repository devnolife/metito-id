import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminEdge } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'
import slugify from 'slugify'

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true
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
    if (!(await isAdminEdge(request))) {
      return unauthorizedResponse('Admin access required')
    }

    const body = await request.json()

    // Validate input
    const result = updateCategorySchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return errorResponse('Category not found', 404)
    }

    // If name is being updated, generate new slug and check for conflicts
    let updateData = { ...data }
    if (data.name && data.name !== existingCategory.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true })

      // Check if new slug already exists (excluding current category)
      const slugConflict = await db.category.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: params.id }
        }
      })

      if (slugConflict) {
        return errorResponse('Category with this name already exists', 409)
      }

      updateData.slug = newSlug
    }

    // Update category
    const category = await db.category.update({
      where: { id: params.id },
      data: updateData
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
    if (!(await isAdminEdge(request))) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    // Check if category has products
    if (category._count.products > 0) {
      return errorResponse('Cannot delete category with existing products', 400)
    }

    // Delete category
    await db.category.delete({
      where: { id: params.id }
    })

    return successResponse(null, 'Category deleted successfully')

  } catch (error) {
    console.error('Delete category error:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
