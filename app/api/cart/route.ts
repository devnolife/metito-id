import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response'

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
})

const updateCartItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
})

// GET /api/cart - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return unauthorizedResponse('Please login to access cart')
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            inStock: true,
            capacity: true,
            efficiency: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    return successResponse({
      items: cartItems,
      total,
      itemCount: cartItems.length,
      totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    })

  } catch (error) {
    console.error('Get cart error:', error)
    return errorResponse('Failed to fetch cart', 500)
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return unauthorizedResponse('Please login to add items to cart')
    }

    const body = await request.json()

    // Validate input
    const result = addToCartSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { productId, quantity } = result.data

    // Verify product exists and is in stock
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true }
    })

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    if (!product.inStock) {
      return errorResponse('Product is out of stock', 400)
    }

    // Check if item already in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: true,
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: true,
            }
          }
        }
      })
    }

    return successResponse(cartItem, 'Item added to cart successfully', 201)

  } catch (error) {
    console.error('Add to cart error:', error)
    return errorResponse('Failed to add item to cart', 500)
  }
} 
