import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response'
import slugify from 'slugify'

const updateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  capacity: z.string().optional(),
  efficiency: z.string().optional(),
  location: z.string().optional(),
  application: z.enum(['Industrial', 'Municipal']).optional(),
  specs: z.record(z.any()).optional(),
  features: z.array(z.string()).optional(),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: params.id,
        isActive: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    if (!product) {
      return notFoundResponse('Product not found')
    }

    return successResponse(product)

  } catch (error) {
    console.error('Get product error:', error)
    return errorResponse('Failed to fetch product', 500)
  }
}

// PUT /api/products/[id] - Update product (Admin only)
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
    const result = updateProductSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return notFoundResponse('Product not found')
    }

    // If name is being updated, generate new slug
    let slug = existingProduct.slug
    if (data.name && data.name !== existingProduct.name) {
      slug = slugify(data.name, { lower: true, strict: true })

      // Check if new slug already exists
      const slugExists = await db.product.findFirst({
        where: {
          slug,
          id: { not: params.id }
        }
      })

      if (slugExists) {
        return errorResponse('Product with this name already exists', 409)
      }
    }

    // If category is being updated, verify it exists
    if (data.categoryId) {
      const category = await db.category.findUnique({
        where: { id: data.categoryId }
      })

      if (!category) {
        return errorResponse('Category not found', 404)
      }
    }

    // Update product
    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...data,
        slug,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    return successResponse(product, 'Product updated successfully')

  } catch (error) {
    console.error('Update product error:', error)
    return errorResponse('Failed to update product', 500)
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return notFoundResponse('Product not found')
    }

    // Soft delete by setting isActive to false
    await db.product.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return successResponse(null, 'Product deleted successfully')

  } catch (error) {
    console.error('Delete product error:', error)
    return errorResponse('Failed to delete product', 500)
  }
} 
