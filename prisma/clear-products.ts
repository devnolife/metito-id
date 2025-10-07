import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearProducts() {
  try {
    console.log('🗑️  Menghapus semua produk...')

    // Delete all products
    const result = await prisma.product.deleteMany({})

    console.log(`✅ Berhasil menghapus ${result.count} produk`)

    // Also delete related cart items (if any)
    const cartResult = await prisma.cartItem.deleteMany({})
    console.log(`✅ Berhasil menghapus ${cartResult.count} item di cart`)

    // Also delete related inquiries (if any)
    const inquiryResult = await prisma.inquiry.deleteMany({
      where: {
        productId: { not: null }
      }
    })
    console.log(`✅ Berhasil menghapus ${inquiryResult.count} inquiries terkait produk`)

    console.log('\n✨ Database produk sudah bersih!')
    console.log('Sekarang Anda bisa mulai menambahkan produk baru dari admin panel.\n')
  } catch (error) {
    console.error('❌ Error menghapus produk:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

clearProducts()
