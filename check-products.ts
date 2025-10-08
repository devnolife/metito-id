import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
    }
  })

  console.log('\n=== Products in Database ===\n')
  products.forEach((p, i) => {
    console.log(`${i + 1}. ID: ${p.id}`)
    console.log(`   Name: ${p.name}`)
    console.log(`   Slug: ${p.slug}`)
    console.log(`   URL: /products/${p.id}`)
    console.log('')
  })

  console.log(`Total products found: ${products.length}\n`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
