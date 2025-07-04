import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProductForm from "./product-form"
import { ProductFormData, Category, ProductImage, Product } from "./use-product-management"

interface ProductDialogsProps {
  // Edit Dialog
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (value: boolean) => void

  // Image Modal
  isImageModalOpen: boolean
  setIsImageModalOpen: (value: boolean) => void
  selectedImage: ProductImage | null

  // Delete Dialog
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (value: boolean) => void
  productToDelete: Product | null

  // Delete Category Dialog
  isDeleteCategoryDialogOpen: boolean
  setIsDeleteCategoryDialogOpen: (value: boolean) => void
  categoryToDelete: Category | null

  // Form props
  formData: ProductFormData
  setFormData: (data: ProductFormData | ((prev: ProductFormData) => ProductFormData)) => void
  categories: Category[]
  productImages: ProductImage[]

  // Handlers
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete: () => void
  handleImageClick: (image: ProductImage) => void
  handleEditProduct: () => void
  handleDeleteProduct: (id: string) => void
  handleDeleteCategory: (id: string) => void

  // States
  isUploading: boolean
  isSubmitting: boolean
  isDeleting: boolean
}

export function ProductDialogs({
  isEditDialogOpen,
  setIsEditDialogOpen,
  isImageModalOpen,
  setIsImageModalOpen,
  selectedImage,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  productToDelete,
  isDeleteCategoryDialogOpen,
  setIsDeleteCategoryDialogOpen,
  categoryToDelete,
  formData,
  setFormData,
  categories,
  productImages,
  handleFileUpload,
  handleImageDelete,
  handleImageClick,
  handleEditProduct,
  handleDeleteProduct,
  handleDeleteCategory,
  isUploading,
  isSubmitting,
  isDeleting,
}: ProductDialogsProps) {
  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah informasi produk sesuai kebutuhan Anda. Pastikan semua field yang wajib diisi telah terisi dengan benar.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            productImages={productImages}
            handleFileUpload={handleFileUpload}
            handleImageDelete={handleImageDelete}
            handleImageClick={handleImageClick}
            isUploading={isUploading}
            isSubmitting={isSubmitting}
            onSubmit={handleEditProduct}
            submitLabel="Simpan Perubahan"
          />
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview Gambar</DialogTitle>
            <DialogDescription>
              Gambar produk yang dipilih. Anda dapat melihat detail gambar dengan lebih jelas di sini.
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.fileName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk "{productToDelete?.name}"?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (productToDelete) {
                  await handleDeleteProduct(productToDelete.id)
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori "{categoryToDelete?.name}"?
              <br /><br />
              <strong>⚠️ Peringatan:</strong> Jika kategori ini memiliki produk, produk tersebut akan tetap ada tetapi tidak akan memiliki kategori (akan muncul sebagai "Tanpa Kategori").
              <br /><br />
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (categoryToDelete) {
                  await handleDeleteCategory(categoryToDelete.id)
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
