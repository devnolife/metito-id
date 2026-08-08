import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
})

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = subscribeSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const { email, name } = result.data

    // Check if email already subscribed
    const existingSubscription = await db.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return errorResponse('Email is already subscribed to our newsletter', 409)
      } else {
        // Reactivate subscription
        const subscription = await db.newsletter.update({
          where: { email },
          data: {
            isActive: true,
            name: name || existingSubscription.name
          }
        })
        return successResponse(subscription, 'Successfully resubscribed to newsletter!')
      }
    }

    // Create new subscription
    const subscription = await db.newsletter.create({
      data: {
        email,
        name,
        isActive: true,
        isConfirmed: false,
      }
    })

    // TODO: Send confirmation email
    // await sendNewsletterConfirmation(subscription)

    return successResponse(subscription, 'Successfully subscribed to newsletter! Please check your email to confirm.', 201)

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return errorResponse('Failed to subscribe to newsletter', 500)
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return errorResponse('Email is required', 400)
    }

    // Validate email format
    const emailValidation = z.string().email().safeParse(email)
    if (!emailValidation.success) {
      return errorResponse('Invalid email format', 400)
    }

    // Find and deactivate subscription
    const subscription = await db.newsletter.findUnique({
      where: { email }
    })

    if (!subscription) {
      return errorResponse('Email not found in our newsletter list', 404)
    }

    await db.newsletter.update({
      where: { email },
      data: { isActive: false }
    })

    return successResponse(null, 'Successfully unsubscribed from newsletter')

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return errorResponse('Failed to unsubscribe from newsletter', 500)
  }
} 
