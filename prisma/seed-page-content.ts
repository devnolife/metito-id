import { PrismaClient } from '@prisma/client'
import { BUSINESS_LINES, COMPANY, CONTACT } from '../src/lib/company-profile'

const prisma = new PrismaClient()

async function seedPageContent() {
  console.log('🌱 Seeding page content...')

  // Footer Content
  const footerContents = [
    // Company Info
    {
      page: 'footer',
      section: 'company_info',
      key: 'company_name',
      title: COMPANY.brandName,
      subtitle: COMPANY.abbreviationOf,
      description: COMPANY.description,
      imageUrl: '/images/logo.png',
      order: 1,
      isActive: true,
    },
    // Social Media
    {
      page: 'footer',
      section: 'social_media',
      key: 'facebook',
      title: 'Facebook',
      link: '#',
      icon: 'Facebook',
      order: 1,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'social_media',
      key: 'instagram',
      title: 'Instagram',
      link: '#',
      icon: 'Instagram',
      order: 2,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'social_media',
      key: 'twitter',
      title: 'Twitter',
      link: '#',
      icon: 'Twitter',
      order: 3,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'social_media',
      key: 'linkedin',
      title: 'LinkedIn',
      link: '#',
      icon: 'Linkedin',
      order: 4,
      isActive: true,
    },
    // Contact Info
    {
      page: 'footer',
      section: 'contact_info',
      key: 'address',
      title: 'Alamat',
      description: `${CONTACT.address.line1}\n${CONTACT.address.line2}`,
      icon: 'MapPin',
      order: 1,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'phone',
      title: 'Telepon',
      description: CONTACT.phones.join('\n'),
      icon: 'Phone',
      order: 2,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'email',
      title: 'Email',
      description: CONTACT.email,
      icon: 'Mail',
      order: 3,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'website',
      title: 'Website',
      description: CONTACT.website,
      link: CONTACT.websiteUrl,
      icon: 'Globe',
      order: 4,
      isActive: true,
    },
    // Copyright
    {
      page: 'footer',
      section: 'copyright',
      key: 'text',
      description: `© ${new Date().getFullYear()} ${COMPANY.legalName}. Semua hak dilindungi.`,
      order: 1,
      isActive: true,
    },
  ]

  // Home Page Content
  const homeContents = [
    // Stats Section — komitmen dari company profile
    {
      page: 'home',
      section: 'stats',
      key: 'stat_1',
      title: 'Kualitas',
      subtitle: 'Produk dari supplier terpercaya',
      icon: 'BadgeCheck',
      content: { color: 'text-blue-600' },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_2',
      title: 'Tepat Waktu',
      subtitle: 'Komitmen ketepatan pengiriman',
      icon: 'Truck',
      content: { color: 'text-green-600' },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_3',
      title: 'Purna Jual',
      subtitle: 'Dukungan teknis profesional',
      icon: 'Headphones',
      content: { color: 'text-purple-600' },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_4',
      title: '6 Sektor',
      subtitle: 'Industri yang kami layani',
      icon: 'Factory',
      content: { color: 'text-orange-600' },
      order: 4,
      isActive: true,
    },
    // Stats Header
    {
      page: 'home',
      section: 'stats_header',
      key: 'badge',
      title: 'Solusi Terintegrasi',
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats_header',
      key: 'heading',
      title: 'Mitra Terpercaya untuk Air, Industri, dan Pertambangan',
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats_header',
      key: 'description',
      description: COMPANY.description,
      order: 3,
      isActive: true,
    },
    // Services Overview — mengikuti Business Lines pada company profile
    ...BUSINESS_LINES.map((line, index) => ({
      page: 'home',
      section: 'services',
      key: `service_${index + 1}`,
      title: line.title,
      description: line.description,
      icon: line.icon,
      content: { color: ['text-red-600', 'text-blue-600', 'text-amber-600', 'text-green-600'][index % 4] },
      order: index + 1,
      isActive: true,
    })),
    // Services Header
    {
      page: 'home',
      section: 'services_header',
      key: 'heading',
      title: 'Keahlian Kami',
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'services_header',
      key: 'description',
      description: 'Chemical supply, engineering services, equipment supply, dan spare parts supply dalam satu mitra terintegrasi.',
      order: 2,
      isActive: true,
    },
  ]

  const allContents = [...footerContents, ...homeContents]

  for (const content of allContents) {
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: content.page,
          section: content.section,
          key: content.key,
        },
      },
      update: content,
      create: content,
    })
  }

  console.log(`✅ Seeded ${allContents.length} page content items`)
}

seedPageContent()
  .catch((e) => {
    console.error('❌ Error seeding page content:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
