import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

// Force Node.js runtime to avoid Edge Runtime issues with bcryptjs and jsonwebtoken
export const runtime = 'nodejs'

// Allowed file types by category
const ALLOWED_TYPES = {
  products: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  gallery: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  customers: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  testimonials: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  blog: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  certificates: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif' // Allow images in documents too
  ]
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Upload directories
const UPLOAD_DIRS = {
  products: 'public/images/products',
  gallery: 'public/images/gallery',
  customers: 'public/images/users',
  testimonials: 'public/images/testimonials',
  blog: 'public/images/blog',
  certificates: 'public/certificates',
  documents: 'public/documents/products'
}

// Map category to ImageType
const CATEGORY_TO_IMAGE_TYPE = {
  products: 'PRODUCT',
  gallery: 'GALLERY',
  customers: 'CUSTOMER',
  testimonials: 'TESTIMONIAL',
  blog: 'BLOG',
  certificates: 'CERTIFICATE',
  documents: 'DOCUMENT'
} as const

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')

    // Verify admin authentication
    const user = await getUserFromRequest(request)
    console.log('User from request:', user)

    if (!user || user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const productId = formData.get('productId') as string // Optional, for product-specific uploads
    const userId = formData.get('userId') as string // Optional, for user-specific uploads
    const title = formData.get('title') as string // Optional
    const description = formData.get('description') as string // Optional
    const altText = formData.get('altText') as string // Optional

    console.log('Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      category,
      productId,
      userId
    })

    // Validate file
    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ALLOWED_TYPES[category as keyof typeof ALLOWED_TYPES]
    if (!allowedTypes?.includes(file.type)) {
      console.log('Invalid file type:', file.type, 'for category:', category)
      const allowedExtensions = allowedTypes?.map(type => {
        if (type.startsWith('image/')) return type.replace('image/', '.')
        if (type === 'application/pdf') return '.pdf'
        if (type === 'application/msword') return '.doc'
        if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx'
        if (type === 'application/vnd.ms-excel') return '.xls'
        if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return '.xlsx'
        if (type === 'application/vnd.ms-powerpoint') return '.ppt'
        if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return '.pptx'
        if (type === 'text/plain') return '.txt'
        return type
      }).join(', ')

      return NextResponse.json(
        { success: false, message: `Invalid file type for ${category}. Allowed types: ${allowedExtensions}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size)
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Validate category
    if (!category || !UPLOAD_DIRS[category as keyof typeof UPLOAD_DIRS]) {
      console.log('Invalid category:', category)
      return NextResponse.json(
        { success: false, message: 'Invalid category. Allowed categories: products, gallery, customers, testimonials, blog, certificates, documents' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = UPLOAD_DIRS[category as keyof typeof UPLOAD_DIRS]
    console.log('Upload directory:', uploadDir)

    try {
      if (!existsSync(uploadDir)) {
        console.log('Creating upload directory:', uploadDir)
        await mkdir(uploadDir, { recursive: true })
      }
    } catch (dirError) {
      console.error('Error creating directory:', dirError)
      return NextResponse.json(
        { success: false, message: 'Failed to create upload directory' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`

    // Create product-specific subdirectory if productId is provided
    let finalUploadPath = uploadDir
    if (productId && category === 'products') {
      const productDir = join(uploadDir, productId)
      console.log('Product directory:', productDir)

      try {
        if (!existsSync(productDir)) {
          console.log('Creating product directory:', productDir)
          await mkdir(productDir, { recursive: true })
        }
        finalUploadPath = productDir
      } catch (productDirError) {
        console.error('Error creating product directory:', productDirError)
        return NextResponse.json(
          { success: false, message: 'Failed to create product directory' },
          { status: 500 }
        )
      }
    }

    // Save file
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = join(finalUploadPath, fileName)
      console.log('Saving file to:', filePath)
      await writeFile(filePath, buffer)
      console.log('File saved successfully')
    } catch (fileError) {
      console.error('Error saving file:', fileError)
      return NextResponse.json(
        { success: false, message: 'Failed to save file' },
        { status: 500 }
      )
    }

    // Generate public URL
    const publicUrl = `/${uploadDir.replace('public', '')}/${productId ? `${productId}/` : ''}${fileName}`.replace(/\/+/g, '/')
    console.log('Upload directory:', uploadDir)
    console.log('Product ID:', productId)
    console.log('File name:', fileName)
    console.log('Generated public URL:', publicUrl)

    // Save image metadata to database
    try {
      const imageData = await db.image.create({
        data: {
          fileName,
          originalName: file.name,
          filePath: publicUrl,
          fileSize: file.size,
          fileType: file.type,
          imageType: CATEGORY_TO_IMAGE_TYPE[category as keyof typeof CATEGORY_TO_IMAGE_TYPE],
          title: title || null,
          description: description || null,
          altText: altText || null,
          productId: productId || null,
          userId: userId || null,
        }
      })
      console.log('Image data saved to database:', imageData.id)

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: imageData.id,
          fileName,
          filePath: publicUrl,
          fileSize: file.size,
          fileType: file.type,
          category,
          productId: productId || null,
          userId: userId || null,
          title: imageData.title,
          description: imageData.description,
          altText: imageData.altText
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Failed to save image metadata to database' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    const filePath = searchParams.get('filePath')
    const category = searchParams.get('category')

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Get image data from database
    const image = await db.image.findUnique({
      where: { id: imageId }
    })

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    const fullPath = join(process.cwd(), 'public', image.filePath.replace(/^\//, ''))

    if (existsSync(fullPath)) {
      const { unlink } = await import('fs/promises')
      await unlink(fullPath)
    }

    // Delete from database
    await db.image.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageType = searchParams.get('imageType')
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    if (imageType) where.imageType = imageType
    if (productId) where.productId = productId
    if (userId) where.userId = userId

    const images = await db.image.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    const total = await db.image.count({ where })

    return NextResponse.json({
      success: true,
      data: {
        images,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })

  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 
