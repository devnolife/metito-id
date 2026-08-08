import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    const fullPath = join(process.cwd(), 'public', 'images', imagePath)
    
    console.log('Serving image:', fullPath)
    
    if (!existsSync(fullPath)) {
      console.log('Image not found:', fullPath)
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await readFile(fullPath)
    
    // Determine content type based on file extension
    const ext = imagePath.split('.').pop()?.toLowerCase()
    let contentType = 'image/jpeg' // default
    
    switch (ext) {
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
    }

    return new NextResponse(imageBuffer as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}