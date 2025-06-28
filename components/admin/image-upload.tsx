"use client"

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Trash2, CheckCircle, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface UploadedImage {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  title?: string
  description?: string
  altText?: string
}

interface ImageUploadProps {
  category: 'products' | 'gallery' | 'customers' | 'testimonials' | 'blog' | 'certificates' | 'documents'
  productId?: string
  userId?: string
  onUploadComplete?: (images: UploadedImage[]) => void
  onUploadStart?: () => void
  onImageDelete?: (imageId: string) => void
  maxFiles?: number
  className?: string
  showMetadata?: boolean
  existingImages?: UploadedImage[]
}

const CATEGORY_LABELS = {
  products: 'Products',
  gallery: 'Gallery',
  customers: 'Customers',
  testimonials: 'Testimonials',
  blog: 'Blog',
  certificates: 'Certificates',
  documents: 'Documents'
}

export function ImageUpload({
  category,
  productId,
  userId,
  onUploadComplete,
  onUploadStart,
  onImageDelete,
  maxFiles = 10,
  className = "",
  showMetadata = false,
  existingImages = []
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedImage[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<{ [key: string]: { title: string, description: string, altText: string } }>({})

  useEffect(() => {
    setUploadedFiles(existingImages)
  }, [existingImages])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    // Validate category
    if (!category) {
      toast.error('Category is required for upload')
      return
    }

    // Check if we have space for more files
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed. You can upload ${maxFiles - uploadedFiles.length} more files.`)
      return
    }

    // Notify upload start
    onUploadStart?.()

    setUploading(true)
    setUploadProgress(0)

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      try {
        console.log('Starting upload for file:', file.name)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        // Only add productId if it's a valid string
        if (productId && productId.trim() !== '') {
          formData.append('productId', productId)
        }

        if (userId && userId.trim() !== '') {
          formData.append('userId', userId)
        }

        // Add metadata if available
        const metadata = imageMetadata[file.name]
        if (metadata) {
          formData.append('title', metadata.title)
          formData.append('description', metadata.description)
          formData.append('altText', metadata.altText)
        }

        console.log('Sending upload request to /api/upload')
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include', // Include cookies for authentication
        })

        console.log('Upload response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Upload failed with status:', response.status, 'Error:', errorData)
          throw new Error(errorData.message || `Upload failed with status ${response.status}`)
        }

        const result = await response.json()
        console.log('Upload successful:', result)

        // Update progress
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100)

        return result.data
      } catch (error) {
        console.error('Upload error for file:', file.name, error)
        toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(result => result !== null) as UploadedImage[]

    if (successfulUploads.length > 0) {
      setUploadedFiles(prev => [...prev, ...successfulUploads])
      onUploadComplete?.(successfulUploads)
      toast.success(`Successfully uploaded ${successfulUploads.length} file(s)`)
    }

    setUploading(false)
    setUploadProgress(0)
    setImageMetadata({})
  }, [category, productId, userId, onUploadComplete, onUploadStart, imageMetadata, uploadedFiles.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: maxFiles - uploadedFiles.length
  })

  const handleDeleteFile = async (imageId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/upload?imageId=${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Delete failed')
      }

      setUploadedFiles(prev => prev.filter(file => file.id !== imageId))
      onImageDelete?.(imageId)
      toast.success(`Deleted ${fileName}`)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleMetadataChange = (fileName: string, field: string, value: string) => {
    setImageMetadata(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload Images - {CATEGORY_LABELS[category]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary/50'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPEG, PNG, WebP, GIF (Max 5MB per file)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {uploadedFiles.length}/{maxFiles} files uploaded
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">Uploading images...</span>
                <span className="text-blue-600 font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <div className="text-xs text-gray-500 text-center">
                Please wait while your images are being processed and uploaded to the server.
              </div>
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Uploaded Images ({uploadedFiles.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg p-3 relative group bg-green-50 border-green-200">
                    <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img
                        src={file.filePath}
                        alt={file.altText || file.fileName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate text-green-800" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)} • {file.fileType}
                      </p>
                      {file.title && (
                        <p className="text-xs text-blue-600 font-medium">{file.title}</p>
                      )}
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Successfully Uploaded</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingImage(editingImage === file.id ? null : file.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id, file.fileName)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Image Metadata Editor */}
                    {editingImage === file.id && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor={`title-${file.id}`} className="text-xs">Title</Label>
                            <Input
                              id={`title-${file.id}`}
                              value={imageMetadata[file.fileName]?.title || file.title || ''}
                              onChange={(e) => handleMetadataChange(file.fileName, 'title', e.target.value)}
                              placeholder="Image title"
                              className="h-7 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`alt-${file.id}`} className="text-xs">Alt Text</Label>
                            <Input
                              id={`alt-${file.id}`}
                              value={imageMetadata[file.fileName]?.altText || file.altText || ''}
                              onChange={(e) => handleMetadataChange(file.fileName, 'altText', e.target.value)}
                              placeholder="Alt text for accessibility"
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Summary */}
          {uploadedFiles.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Upload Summary</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {uploadedFiles.length} image(s) successfully uploaded and ready to use.
                {uploadedFiles.length > 1 && ' The first image will be used as the main product image.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
