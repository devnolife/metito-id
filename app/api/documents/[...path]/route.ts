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
    const filePath = path.join('/')
    const fullPath = join(process.cwd(), 'public', 'documents', filePath)
    
    console.log('Serving document:', fullPath)
    
    if (!existsSync(fullPath)) {
      console.log('Document not found:', fullPath)
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await readFile(fullPath)
    
    // Determine content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream' // default
    
    switch (ext) {
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'doc':
        contentType = 'application/msword'
        break
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'xls':
        contentType = 'application/vnd.ms-excel'
        break
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case 'ppt':
        contentType = 'application/vnd.ms-powerpoint'
        break
      case 'pptx':
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        break
      case 'txt':
        contentType = 'text/plain'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }

    return new NextResponse(fileBuffer as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving document:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}