import { toast } from "sonner"
import { ProductImage } from "./use-product-management"

interface FileUploadHandlersProps {
  setIsUploading: (value: boolean) => void
  setIsAuthenticated: (value: boolean) => void
  setProductImages: (images: ProductImage[]) => void
  setSelectedImage: (image: ProductImage | null) => void
  setIsImageModalOpen: (value: boolean) => void
}

export function useFileUploadHandlers({
  setIsUploading,
  setIsAuthenticated,
  setProductImages,
  setSelectedImage,
  setIsImageModalOpen,
}: FileUploadHandlersProps) {

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (files[0].size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB.")
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(files[0].type)) {
      toast.error("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.")
      return
    }

    setIsUploading(true)
    const loadingToast = toast.loading(`Mengupload ${files[0].name}...`)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', files[0])
      uploadFormData.append('category', 'products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
      })

      toast.dismiss(loadingToast)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }))

        if (response.status === 401) {
          toast.error("Sesi telah berakhir, silakan login kembali")
          setIsAuthenticated(false)
        } else if (response.status === 413) {
          toast.error("File terlalu besar untuk diupload")
        } else if (response.status === 415) {
          toast.error("Format file tidak didukung")
        } else {
          toast.error(errorData.message || `Upload gagal dengan status ${response.status}`)
        }
        throw new Error(errorData.message || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()

      // Ensure URL starts with forward slash and is properly formatted
      let imageUrl = result.data.filePath
      imageUrl = imageUrl.replace(/^\/+/, '')
      imageUrl = `/${imageUrl}`

      const newImage: ProductImage = {
        id: Date.now().toString(),
        url: imageUrl,
        fileName: files[0].name
      }

      setProductImages([newImage])
      toast.success(`${files[0].name} berhasil diupload!`)
    } catch (error) {
      if (loadingToast) toast.dismiss(loadingToast)
      console.error('Upload error:', error)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error("Koneksi bermasalah. Periksa koneksi internet Anda.")
      } else if (error instanceof Error && !error.message.includes('Upload failed')) {
        toast.error("Terjadi kesalahan saat mengupload file")
      } else if (typeof error === 'string') {
        toast.error(error)
      }
    } finally {
      setIsUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleImageDelete = () => {
    setProductImages([])
    toast.success("Gambar berhasil dihapus")
  }

  const handleImageClick = (image: ProductImage) => {
    setSelectedImage(image)
    setIsImageModalOpen(true)
  }

  return {
    handleFileUpload,
    handleImageDelete,
    handleImageClick,
  }
}
