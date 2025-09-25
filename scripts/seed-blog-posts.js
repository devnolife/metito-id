#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')
const slugify = require('slugify')

const prisma = new PrismaClient()

const seedPosts = [
  {
    title: 'Teknologi Terbaru dalam Pengolahan Air',
    content: 'Artikel tentang inovasi terbaru dalam teknologi pengolahan air yang ramah lingkungan dan efisien...',
    excerpt: 'Mengenal berbagai teknologi mutakhir untuk pengolahan air yang berkelanjutan',
    category: 'Teknologi',
    tags: ['teknologi', 'pengolahan air', 'inovasi'],
    author: 'Admin',
    featuredImage: '/images/blog/water-technology.jpg',
    publishedDate: '2024-01-15',
    status: 'published',
    seoTitle: 'Teknologi Terbaru dalam Pengolahan Air | Metito',
    seoDescription: 'Pelajari teknologi terbaru dalam pengolahan air yang ramah lingkungan dan efisien dari Metito Indonesia',
    readTime: 5
  },
  {
    title: 'Tips Perawatan Sistem Water Treatment',
    content: 'Panduan lengkap untuk merawat sistem water treatment agar tetap optimal dan tahan lama...',
    excerpt: 'Panduan praktis perawatan sistem water treatment untuk performa optimal',
    category: 'Panduan',
    tags: ['perawatan', 'water treatment', 'maintenance'],
    author: 'Admin',
    featuredImage: '/images/blog/maintenance-guide.jpg',
    publishedDate: '2024-01-10',
    status: 'draft',
    seoTitle: 'Tips Perawatan Sistem Water Treatment | Metito',
    seoDescription: 'Pelajari cara merawat sistem water treatment dengan tips dari ahli Metito Indonesia',
    readTime: 7
  }
]

async function main() {
  for (const p of seedPosts) {
    const slug = slugify(p.title, { lower: true, strict: true })
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      console.log(`Skip existing post: ${p.title}`)
      continue
    }

    // Ensure tags
    const tagConnections = []
    for (const tagName of p.tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true })
      const tag = await prisma.blogTag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug }
      })
      tagConnections.push({ id: tag.id })
    }

    const post = await prisma.blogPost.create({
      data: {
        title: p.title,
        slug,
        content: p.content,
        excerpt: p.excerpt,
        coverImage: p.featuredImage,
        authorName: p.author,
        isPublished: p.status === 'published',
        metaTitle: p.seoTitle,
        metaDescription: p.seoDescription,
        createdAt: new Date(p.publishedDate + 'T00:00:00Z'),
        tags: { connect: tagConnections }
      }
    })

    console.log('Inserted post:', post.title)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
