import { PrismaClient } from '@prisma/client'

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
      title: 'Metito Water Solutions',
      subtitle: 'Solusi Teknik Pengolahan Air',
      description: 'Penyedia terdepan solusi pengolahan air dan air limbah canggih. Kami menyediakan teknologi pengolahan air yang inovatif, berkelanjutan, dan hemat biaya di seluruh Indonesia.',
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
      description: 'Jl. Barombong\nKab Gowa, Indonesia 12345',
      icon: 'MapPin',
      order: 1,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'phone',
      title: 'Telepon',
      description: '+62 21 1234 5678\n+62 21 9876 5432',
      icon: 'Phone',
      order: 2,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'email',
      title: 'Email',
      description: 'info@metito.id\nsales@metito.id',
      icon: 'Mail',
      order: 3,
      isActive: true,
    },
    {
      page: 'footer',
      section: 'contact_info',
      key: 'working_hours',
      title: 'Jam Kerja',
      description: 'Senin - Jumat: 08:00 - 18:00\nSabtu: 09:00 - 14:00',
      icon: 'Clock',
      order: 4,
      isActive: true,
    },
    // Copyright
    {
      page: 'footer',
      section: 'copyright',
      key: 'text',
      description: '© 2025 Metito Water Solutions. Semua hak dilindungi.',
      order: 1,
      isActive: true,
    },
  ]

  // Home Page Content
  const homeContents = [
    // Stats Section
    {
      page: 'home',
      section: 'stats',
      key: 'stat_1',
      title: '100%',
      subtitle: 'Komitmen Kualitas',
      icon: 'Target',
      content: { color: 'text-blue-600' },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_2',
      title: '24/7',
      subtitle: 'Layanan Siap',
      icon: 'Lightbulb',
      content: { color: 'text-green-600' },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_3',
      title: '∞',
      subtitle: 'Dedikasi Tinggi',
      icon: 'Heart',
      content: { color: 'text-purple-600' },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats',
      key: 'stat_4',
      title: '100%',
      subtitle: 'Jaminan Kualitas',
      icon: 'Shield',
      content: { color: 'text-orange-600' },
      order: 4,
      isActive: true,
    },
    // Stats Header
    {
      page: 'home',
      section: 'stats_header',
      key: 'badge',
      title: 'Solusi Terpercaya',
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats_header',
      key: 'heading',
      title: 'Solusi Pengolahan Air Profesional',
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'stats_header',
      key: 'description',
      description: 'Perusahaan yang berkomitmen memberikan solusi pengolahan air terbaik dengan teknologi modern dan layanan prima.',
      order: 3,
      isActive: true,
    },
    // Services Overview
    {
      page: 'home',
      section: 'services',
      key: 'service_1',
      title: 'Pengolahan Air',
      description: 'Solusi pengolahan air lengkap untuk aplikasi industri dan perkotaan',
      icon: 'Droplets',
      content: { color: 'text-blue-600' },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'services',
      key: 'service_2',
      title: 'Sistem Filtrasi',
      description: 'Teknologi filtrasi canggih untuk pasokan air bersih dan aman',
      icon: 'Filter',
      content: { color: 'text-green-600' },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'services',
      key: 'service_3',
      title: 'Disinfeksi',
      description: 'Sistem disinfeksi UV dan ozon untuk eliminasi patogen',
      icon: 'Zap',
      content: { color: 'text-purple-600' },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'services',
      key: 'service_4',
      title: 'Pemeliharaan',
      description: 'Layanan pemeliharaan dan dukungan profesional untuk performa optimal',
      icon: 'Settings',
      content: { color: 'text-orange-600' },
      order: 4,
      isActive: true,
    },
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
      description: 'Solusi pengolahan air komprehensif yang disesuaikan untuk memenuhi kebutuhan spesifik Anda dan standar industri.',
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
