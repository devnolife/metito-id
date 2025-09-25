"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/components/product-form'
import { useProducts } from '@/components/admin/products/hooks/use-products'
import { Product } from '@/components/admin/products/types/product'
import { LoadingOverlay } from '@/components/admin/ui/loading-overlay'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { getProduct, updateProduct } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getProduct(id)
        if (isMounted) setProduct(data)
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat produk')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (id) fetchData()
    return () => { isMounted = false }
  }, [id, getProduct])

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      setSaving(true)
      await updateProduct(id, data)
      router.push('/admin/products')
    } catch (e) {
      // error toast handled in hook
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingOverlay message="Memuat produk..." submessage="Mohon tunggu" type="default" />
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8 space-y-4">
            <h1 className="text-xl font-semibold">Produk tidak ditemukan</h1>
            <p className="text-gray-600">{error || 'Data produk tidak tersedia.'}</p>
            <Button asChild>
              <Link href="/admin/products">Kembali ke daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Produk</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <ProductForm
          product={product}
          isEdit
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/products')}
          isLoading={saving}
        />
      </div>
    </div>
  )
}
