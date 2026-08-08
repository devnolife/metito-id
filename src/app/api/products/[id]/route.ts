import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response'
import slugify from 'slugify'

const updateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  price: z.string().optional(),
  capacity: z.string().optional(),
  efficiency: z.string().optional(),
  location: z.string().optional(),
  application: z.enum(['Industrial', 'Municipal']).optional(),
  specs: z.record(z.any()).optional(),
  features: z.array(z.string()).default([]),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  images: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  categoryId: z.string().min(1, 'Category is required'),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    if (!product) {
      return errorResponse('Product not found', 404)
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
    const result = updateProductSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      console.log('Validation errors:', JSON.stringify(errors, null, 2))
      console.log('Request body:', JSON.stringify(body, null, 2))
      return validationErrorResponse(errors)
    }

    const data = result.data

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return errorResponse('Product not found', 404)
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug
    if (data.name !== existingProduct.name) {
      slug = slugify(data.name, { lower: true, strict: true })

      // Check if new slug already exists
      const slugExists = await db.product.findUnique({
        where: { slug, NOT: { id } }
      })

      if (slugExists) {
        return errorResponse('Product with this name already exists', 409)
      }
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    // Update product
    const product = await db.product.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check admin permission
    if (!(await isAdmin(request))) {
      return unauthorizedResponse('Admin access required')
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return errorResponse('Product not found', 404)
    }

    // Delete product (this will also delete related cart items and inquiries due to cascade)
    await db.product.delete({
      where: { id }
    })

    return successResponse(null, 'Product deleted successfully')

  } catch (error) {
    console.error('Delete product error:', error)
    return errorResponse('Failed to delete product', 500)
  }
} 
