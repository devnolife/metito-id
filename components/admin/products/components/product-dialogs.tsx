"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Eye, Edit, Trash2, Package, Tag, DollarSign, MapPin, Clock, Shield, Truck, Loader2, Image as ImageIcon, Info } from "lucide-react"
import Image from "next/image"
import { Product } from "../types/product"

interface ProductDialogsProps {
  // View Dialog
  viewDialog: {
    open: boolean
    product: Product | null
  }
  onViewClose: () => void

  // Delete Dialog
  deleteDialog: {
    open: boolean
    productId: string | null
    productName: string | null
  }
  onDeleteClose: () => void
  onDeleteConfirm: (productId: string) => Promise<void>
  deleteLoading?: boolean
}

export function ProductDialogs({
  viewDialog,
  onViewClose,
  deleteDialog,
  onDeleteClose,
  onDeleteConfirm,
  deleteLoading = false
}: ProductDialogsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.productId) {
      await onDeleteConfirm(deleteDialog.productId)
    }
  }

  return (
    <>
      {/* View Product Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={onViewClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detail Produk
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang produk
            </DialogDescription>
          </DialogHeader>

          {viewDialog.product && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Detail Produk
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Gambar Produk ({viewDialog.product.images.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {viewDialog.product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {viewDialog.product.category.name}
                        </Badge>
                        {viewDialog.product.application && (
                          <Badge variant="secondary">
                            {viewDialog.product.application}
                          </Badge>
                        )}
                        {viewDialog.product.isFeatured && (
                          <Badge variant="default">
                            Unggulan
                          </Badge>
                        )}
                        <Badge variant={viewDialog.product.inStock ? "default" : "destructive"}>
                          {viewDialog.product.inStock ? "Tersedia" : "Habis"}
                        </Badge>
                      </div>
                      {viewDialog.product.shortDesc && (
                        <p className="text-gray-600 mb-3">{viewDialog.product.shortDesc}</p>
                      )}
                      <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                        <DollarSign className="w-6 h-6" />
                        {formatCurrency(viewDialog.product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {viewDialog.product.capacity && (
                        <div>
                          <span className="font-medium text-gray-500">Kapasitas:</span>
                          <p className="text-gray-900">{viewDialog.product.capacity}</p>
                        </div>
                      )}
                      {viewDialog.product.efficiency && (
                        <div>
                          <span className="font-medium text-gray-500">Efisiensi:</span>
                          <p className="text-gray-900">{viewDialog.product.efficiency}</p>
                        </div>
                      )}
                      {viewDialog.product.location && (
                        <div className="flex items-start gap-1">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-500">Lokasi:</span>
                            <p className="text-gray-900">{viewDialog.product.location}</p>
                          </div>
                        </div>
                      )}
                      {viewDialog.product.warranty && (
                        <div className="flex items-start gap-1">
                          <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-500">Garansi:</span>
                            <p className="text-gray-900">{viewDialog.product.warranty}</p>
                          </div>
                        </div>
                      )}
                      {viewDialog.product.delivery && (
                        <div className="flex items-start gap-1">
                          <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-500">Pengiriman:</span>
                            <p className="text-gray-900">{viewDialog.product.delivery}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-1">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-500">Dibuat:</span>
                          <p className="text-gray-900">{formatDate(viewDialog.product.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {viewDialog.product.description && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Deskripsi</h4>
                    <p className="text-gray-600 leading-relaxed">{viewDialog.product.description}</p>
                  </div>
                )}

                {/* Features */}
                {viewDialog.product.features.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Fitur Produk</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {viewDialog.product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {viewDialog.product.specs && Object.keys(viewDialog.product.specs).length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Spesifikasi Teknis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(viewDialog.product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">{key}:</span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(viewDialog.product.metaTitle || viewDialog.product.metaDescription) && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">SEO Information</h4>
                    <div className="space-y-2">
                      {viewDialog.product.metaTitle && (
                        <div>
                          <span className="font-medium text-gray-500">Meta Title:</span>
                          <p className="text-gray-900">{viewDialog.product.metaTitle}</p>
                        </div>
                      )}
                      {viewDialog.product.metaDescription && (
                        <div>
                          <span className="font-medium text-gray-500">Meta Description:</span>
                          <p className="text-gray-900">{viewDialog.product.metaDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-6">
                {viewDialog.product && viewDialog.product.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={viewDialog.product.images[selectedImageIndex].startsWith('/api/') ? viewDialog.product.images[selectedImageIndex] : `/api/images/${viewDialog.product.images[selectedImageIndex].replace(/^\/+/, '')}`}
                          alt={`${viewDialog.product.name} - Gambar ${selectedImageIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                      </div>

                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {viewDialog.product.images.length}
                      </div>
                    </div>

                    {viewDialog.product.images.length > 1 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Pilih Gambar:</h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {viewDialog.product.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <Image
                                src={image.startsWith('/api/') ? image : `/api/images/${image.replace(/^\/+/, '')}`}
                                alt={`${viewDialog.product?.name ?? 'Product'} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Gambar</h4>
                      <div className="text-sm text-gray-600">
                        <p>Gambar {selectedImageIndex + 1} dari {viewDialog.product.images.length}</p>
                        <p className="mt-1">Klik thumbnail untuk melihat gambar lainnya</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Gambar</h3>
                    <p className="text-gray-600">Produk ini belum memiliki gambar yang diupload.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button onClick={onViewClose} variant="outline">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={onDeleteClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Hapus Produk
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="font-semibold">{deleteDialog.productName}</span>?
              <br />
              <span className="text-red-600">
                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onDeleteClose} disabled={deleteLoading}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Produk
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 
