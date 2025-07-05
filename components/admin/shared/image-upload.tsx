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
  products: 'Produk',
  gallery: 'Galeri',
  customers: 'Pelanggan',
  testimonials: 'Testimoni',
  blog: 'Blog',
  certificates: 'Sertifikat',
  documents: 'Dokumen'
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
      toast.error('Kategori diperlukan untuk upload')
      return
    }

    // Check if we have space for more files
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} file diizinkan. Anda dapat mengupload ${maxFiles - uploadedFiles.length} file lagi.`)
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
          throw new Error(errorData.message || `Upload gagal dengan status ${response.status}`)
        }

        const result = await response.json()
        console.log('Upload successful:', result)

        // Update progress
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100)

        return result.data
      } catch (error) {
        console.error('Upload error for file:', file.name, error)
        toast.error(`Gagal mengupload ${file.name}: ${error instanceof Error ? error.message : 'Error tidak dikenal'}`)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(result => result !== null) as UploadedImage[]

    if (successfulUploads.length > 0) {
      setUploadedFiles(prev => [...prev, ...successfulUploads])
      onUploadComplete?.(successfulUploads)
      toast.success(`Berhasil mengupload ${successfulUploads.length} file`)
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
        throw new Error(error.message || 'Gagal menghapus')
      }

      setUploadedFiles(prev => prev.filter(file => file.id !== imageId))
      onImageDelete?.(imageId)
      toast.success(`Berhasil menghapus ${fileName}`)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Gagal menghapus ${fileName}: ${error instanceof Error ? error.message : 'Error tidak dikenal'}`)
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
            <ImageIcon className="w-5 h-5" />
            Upload Gambar - {CATEGORY_LABELS[category]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Lepas file di sini...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Seret dan lepas file gambar di sini, atau klik untuk memilih
                </p>
                <p className="text-sm text-gray-500">
                  Mendukung: JPG, PNG, WebP, GIF (maksimal 5MB)
                </p>
                <p className="text-sm text-gray-500">
                  {uploadedFiles.length}/{maxFiles} file
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mengupload...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File yang Diupload ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                    <img
                      src={file.filePath}
                      alt={file.title || file.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">{file.fileName}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleDeleteFile(file.id, file.fileName)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Success Indicator */}
                  <div className="absolute top-2 left-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Form (if enabled) */}
      {showMetadata && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata Gambar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul gambar"
                  onChange={(e) => handleMetadataChange('default', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi gambar"
                  onChange={(e) => handleMetadataChange('default', 'description', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="altText">Teks Alternatif</Label>
                <Input
                  id="altText"
                  placeholder="Masukkan teks alternatif untuk aksesibilitas"
                  onChange={(e) => handleMetadataChange('default', 'altText', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
