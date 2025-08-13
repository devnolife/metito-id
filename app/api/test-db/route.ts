import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Test DB API: Starting...')

    // Test database connection
    console.log('Test DB API: Testing database connection...')
    await prisma.$connect()
    console.log('Test DB API: Database connected successfully')

    // Test basic queries
    const results = {
      userCount: 0,
      productCount: 0,
      inquiryCount: 0,
      categoryCount: 0
    }

    try {
      results.userCount = await prisma.user.count()
      console.log('Test DB API: User count:', results.userCount)
    } catch (error) {
      console.error('Test DB API: Error counting users:', error)
    }

    try {
      results.productCount = await prisma.product.count()
      console.log('Test DB API: Product count:', results.productCount)
    } catch (error) {
      console.error('Test DB API: Error counting products:', error)
    }

    try {
      results.inquiryCount = await prisma.inquiry.count()
      console.log('Test DB API: Inquiry count:', results.inquiryCount)
    } catch (error) {
      console.error('Test DB API: Error counting inquiries:', error)
    }

    try {
      results.categoryCount = await prisma.category.count()
      console.log('Test DB API: Category count:', results.categoryCount)
    } catch (error) {
      console.error('Test DB API: Error counting categories:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Database test successful',
      data: results
    })

  } catch (error) {
    console.error('Test DB API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Test DB API: Error disconnecting:', error)
    }
  }
} 
