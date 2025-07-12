import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Eye, Download, FileText, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  files: string[]
  onFilesChange: (files: string[]) => void
  accept?: string
  maxFiles?: number
  type?: "images" | "documents"
  className?: string
}

interface UploadedFile {
  url: string
  name: string
  size: number
  type: string
}

export function FileUpload({
  files,
  onFilesChange,
  accept = "image/*",
  maxFiles = 10,
  type = "images",
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewing, setPreviewing] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const remainingSlots = maxFiles - files.length
    if (selectedFiles.length > remainingSlots) {
      toast({
        title: "Terlalu banyak file",
        description: `Maksimal ${maxFiles} file. Anda dapat menambah ${remainingSlots} file lagi.`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', type === 'images' ? 'products' : 'documents')

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            let errorMessage = `Failed to upload ${file.name}`

            try {
              const errorData = await response.json()
              errorMessage = errorData.message || errorData.error || errorMessage
            } catch (parseError) {
              // If can't parse JSON, use status text
              errorMessage = `${response.status} ${response.statusText}: ${file.name}`
            }

            throw new Error(errorMessage)
          }

          const result = await response.json()

          if (!result.success || !result.data?.filePath) {
            throw new Error(`Invalid response for ${file.name}`)
          }

          return result.data.filePath
        } catch (fileError) {
          console.error(`Upload error for ${file.name}:`, fileError)
          throw fileError
        }
      })

      const uploadResults = await Promise.allSettled(uploadPromises)

      const successfulUploads = uploadResults
        .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
        .map(result => result.value)

      const failedUploads = uploadResults
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason.message)

      if (successfulUploads.length > 0) {
        onFilesChange([...files, ...successfulUploads])

        if (failedUploads.length === 0) {
          toast({
            title: "Berhasil",
            description: `${successfulUploads.length} file berhasil diupload`,
          })
        } else {
          toast({
            title: "Sebagian berhasil",
            description: `${successfulUploads.length} file berhasil, ${failedUploads.length} file gagal`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Upload gagal",
          description: failedUploads[0] || "Semua file gagal diupload",
          variant: "destructive",
        })
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengupload file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-6 h-6" />
    }

    return <FileText className="w-6 h-6" />
  }

  const isImage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown file'
  }

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${uploading ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {uploading ? 'Mengupload...' : `Upload ${type === 'images' ? 'Gambar' : 'Dokumen'}`}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop file atau klik untuk memilih
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maksimal {maxFiles} file. {files.length}/{maxFiles} terpakai
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || files.length >= maxFiles}
          >
            {uploading ? 'Mengupload...' : 'Pilih File'}
          </Button>
        </div>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            File yang diupload ({files.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((fileUrl, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  {type === 'images' && isImage(fileUrl) ? (
                    <div className="relative">
                      <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={fileUrl}
                          alt={`Upload ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => setPreviewing(fileUrl)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getFileIcon(fileUrl)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getFileName(fileUrl)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {type === 'images' ? 'Gambar' : 'Dokumen'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(fileUrl, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={() => setPreviewing(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="relative w-full h-full">
              <Image
                src={previewing}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
