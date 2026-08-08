import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API: Starting request...')

    // Test database connection first
    try {
      await prisma.$connect()
      console.log('Dashboard API: Database connected successfully')
    } catch (dbError) {
      console.error('Dashboard API: Database connection failed:', dbError)
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    console.log('Dashboard API: Auth result:', authResult)

    if (!authResult.success) {
      console.log('Dashboard API: Auth failed:', authResult.message)
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      )
    }

    console.log('Dashboard API: Auth successful, fetching data...')

    // Simple test queries first
    let totalProducts = 0
    let totalCustomers = 0
    let totalOrders = 0

    try {
      totalProducts = await prisma.product.count({
        where: { isActive: true }
      })
      console.log('Dashboard API: Products count:', totalProducts)
    } catch (error) {
      console.error('Dashboard API: Error counting products:', error)
    }

    try {
      totalCustomers = await prisma.user.count({
        where: {
          role: 'CUSTOMER',
          isActive: true
        }
      })
      console.log('Dashboard API: Customers count:', totalCustomers)
    } catch (error) {
      console.error('Dashboard API: Error counting customers:', error)
    }

    try {
      totalOrders = await prisma.inquiry.count()
      console.log('Dashboard API: Inquiries count:', totalOrders)
    } catch (error) {
      console.error('Dashboard API: Error counting inquiries:', error)
    }

    // Calculate revenue (mock calculation)
    const revenue = totalOrders * 50000

    // Simple dashboard stats
    const dashboardStats = {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: revenue,
      recentInquiries: [],
      recentProducts: [],
      monthlyStats: {
        productsAdded: 0,
        customersAdded: 0,
        inquiriesReceived: totalOrders
      }
    }

    console.log('Dashboard API: Success, returning data')

    return NextResponse.json({
      success: true,
      data: dashboardStats
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Dashboard API: Error disconnecting from database:', error)
    }
  }
} 
