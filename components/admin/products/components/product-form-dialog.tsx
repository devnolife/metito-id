"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Product } from "../types/product"

interface ProductFormDialogProps {
  open: boolean
  onClose: () => void
  product?: Product | null
  isEdit?: boolean
  onSubmit: (data: Partial<Product>) => Promise<void>
  isLoading?: boolean
}

export function ProductFormDialog({
  open,
  onClose,
  product,
  isEdit = false,
  onSubmit,
  isLoading = false
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ubah informasi produk yang sudah ada'
              : 'Tambahkan produk baru ke katalog Anda'
            }
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          product={product || undefined}
          isEdit={isEdit}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
} 
