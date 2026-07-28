// Mock data fallback used when the database server is unreachable.
// This keeps the public site fully browsable while the DB is offline.

import { PRODUCT_GROUPS } from './company-profile'

export interface MockPageContent {
  id: string
  page: string
  section: string
  key: string
  title: string | null
  subtitle: string | null
  description: string | null
  content: any | null
  imageUrl: string | null
  link: string | null
  icon: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const now = new Date()

function pc(partial: Partial<MockPageContent> & Pick<MockPageContent, 'page' | 'section' | 'key'>): MockPageContent {
  return {
    id: `${partial.page}-${partial.section}-${partial.key}`,
    title: null,
    subtitle: null,
    description: null,
    content: null,
    imageUrl: null,
    link: null,
    icon: null,
    order: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}

// All mock page content, grouped so getMockPageContent can filter by page + section.
const MOCK_PAGE_CONTENT: MockPageContent[] = [
  // Home - stats header
  pc({ page: 'home', section: 'stats_header', key: 'badge', title: 'Solusi Terintegrasi', order: 1 }),
  pc({ page: 'home', section: 'stats_header', key: 'heading', title: 'Mitra Terpercaya untuk Air, Industri, dan Pertambangan', order: 2 }),
  pc({ page: 'home', section: 'stats_header', key: 'description', description: 'PT. METITO (Multi Enviro Tirta Teknologi) menyediakan solusi terintegrasi untuk sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services.', order: 3 }),

  // Home - stats (komitmen dari company profile: kualitas, ketepatan waktu, kepuasan pelanggan)
  pc({ page: 'home', section: 'stats', key: 'stat_1', title: 'Kualitas', subtitle: 'Produk dari supplier terpercaya', icon: 'BadgeCheck', content: { color: 'text-blue-600' }, order: 1 }),
  pc({ page: 'home', section: 'stats', key: 'stat_2', title: 'Tepat Waktu', subtitle: 'Komitmen ketepatan pengiriman', icon: 'Truck', content: { color: 'text-green-600' }, order: 2 }),
  pc({ page: 'home', section: 'stats', key: 'stat_3', title: 'Purna Jual', subtitle: 'Dukungan teknis profesional', icon: 'Headphones', content: { color: 'text-purple-600' }, order: 3 }),
  pc({ page: 'home', section: 'stats', key: 'stat_4', title: '6 Sektor', subtitle: 'Industri yang kami layani', icon: 'Factory', content: { color: 'text-orange-600' }, order: 4 }),

  // Home - services header
  pc({ page: 'home', section: 'services_header', key: 'heading', title: 'Keahlian Kami', order: 1 }),
  pc({ page: 'home', section: 'services_header', key: 'description', description: 'Chemical supply, engineering services, equipment supply, dan spare parts supply dalam satu mitra terintegrasi.', order: 2 }),

  // Home - services (mengikuti Business Lines pada company profile)
  pc({ page: 'home', section: 'services', key: 'service_1', title: 'Chemical Supply', description: 'Penyediaan bahan kimia industri untuk berbagai aplikasi.', icon: 'FlaskConical', content: { color: 'text-red-600' }, order: 1 }),
  pc({ page: 'home', section: 'services', key: 'service_2', title: 'Engineering Services', description: 'Perancangan, instalasi, hingga pemeliharaan sistem dan proses industri.', icon: 'Wrench', content: { color: 'text-blue-600' }, order: 2 }),
  pc({ page: 'home', section: 'services', key: 'service_3', title: 'Equipment Supply', description: 'Equipment dan sistem pendukung berstandar industri dari pemasok terpercaya.', icon: 'Settings', content: { color: 'text-amber-600' }, order: 3 }),
  pc({ page: 'home', section: 'services', key: 'service_4', title: 'Spare Parts Supply', description: 'Suku cadang original dan alternatif berkualitas untuk meminimalkan downtime.', icon: 'Cog', content: { color: 'text-green-600' }, order: 4 }),
]

export function getMockPageContent(page: string, section: string): MockPageContent[] {
  return MOCK_PAGE_CONTENT
    .filter((c) => c.page === page && c.section === section && c.isActive)
    .sort((a, b) => a.order - b.order)
}

// ---------------------------------------------------------------------------
// Categories & Products
// ---------------------------------------------------------------------------

export interface MockCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MockProduct {
  id: string
  name: string
  slug: string
  description: string | null
  shortDesc: string | null
  price: string | null
  capacity: string | null
  efficiency: string | null
  location: string | null
  application: 'Industrial' | 'Municipal' | null
  specs: any | null
  features: string[]
  warranty: string | null
  delivery: string | null
  images: string[]
  documents: string[]
  categoryId: string
  inStock: boolean
  isFeatured: boolean
  isActive: boolean
  metaTitle: string | null
  metaDescription: string | null
  createdAt: Date
  updatedAt: Date
  category: { id: string; name: string; slug: string }
}

// Categories mirror the six product groups in the official company profile.
// Names match the icon map used in components/product-showcase.tsx.
export const MOCK_CATEGORIES: MockCategory[] = PRODUCT_GROUPS.map((group) => ({
  id: `cat-${group.slug}`,
  name: group.title,
  slug: group.slug,
  description: group.description,
  icon: group.icon,
  color: group.color,
  isActive: true,
  createdAt: now,
  updatedAt: now,
}))

const catRef = (id: string) => {
  const c = MOCK_CATEGORIES.find((x) => x.id === id)!
  return { id: c.id, name: c.name, slug: c.slug }
}

function prod(p: Partial<MockProduct> & Pick<MockProduct, 'id' | 'name' | 'slug' | 'categoryId'>): MockProduct {
  return {
    description: null,
    shortDesc: null,
    price: null,
    capacity: null,
    efficiency: null,
    location: null,
    application: null,
    specs: null,
    features: [],
    warranty: null,
    delivery: null,
    images: [],
    documents: [],
    inStock: true,
    isFeatured: false,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    createdAt: now,
    updatedAt: now,
    category: catRef(p.categoryId),
    ...p,
  }
}

export const MOCK_PRODUCTS: MockProduct[] = [
  prod({
    id: 'prod-1', name: 'PAC (Poly Aluminium Chloride)', slug: 'pac-poly-aluminium-chloride', categoryId: 'cat-chemical-supply',
    shortDesc: 'Koagulan utama untuk WTP & WWTP', description: 'Poly Aluminium Chloride sebagai koagulan untuk proses penjernihan air pada Water Treatment Plant dan Waste Water Treatment Plant.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Koagulan efektif', 'Dosis rendah', 'Tersedia bentuk bubuk & cair', 'Untuk WTP dan WWTP'],
    images: ['/images/products/product-1.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-2', name: 'Antiscalant RO & Membrane Cleaner', slug: 'antiscalant-ro-membrane-cleaner', categoryId: 'cat-chemical-supply',
    shortDesc: 'Kimia perawatan membran reverse osmosis', description: 'Antiscalant untuk mencegah pembentukan kerak pada membran RO serta membrane cleaner untuk pembersihan berkala.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Mencegah scaling membran', 'Memperpanjang umur membran', 'Menjaga recovery rate', 'Pembersihan CIP'],
    images: ['/images/products/product-2.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-3', name: 'Ion Exchange Resin Kation & Anion', slug: 'ion-exchange-resin-kation-anion', categoryId: 'cat-water-treatment',
    shortDesc: 'Resin penukar ion untuk demineralisasi', description: 'Resin kation dan anion untuk sistem demineralisasi, softener, dan mixed bed pada pengolahan air industri.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Resin kation & anion', 'Untuk demin plant & softener', 'Kapasitas tukar ion tinggi', 'Regenerasi mudah'],
    images: ['/images/products/product-3.jpeg'],
  }),
  prod({
    id: 'prod-4', name: 'Membrane RO / UF / NF', slug: 'membrane-ro-uf-nf', categoryId: 'cat-water-treatment',
    shortDesc: 'Membran RO, ultrafiltrasi & nanofiltrasi', description: 'Membran reverse osmosis, ultrafiltration, dan nanofiltration untuk berbagai kebutuhan pemurnian air.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Tipe RO, UF, dan NF', 'Rejeksi garam tinggi', 'Beragam ukuran elemen', 'Cocok untuk air payau & air proses'],
    images: ['/images/products/product-4.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-5', name: 'Reverse Osmosis System', slug: 'reverse-osmosis-system', categoryId: 'cat-equipment-supply',
    shortDesc: 'Paket sistem RO lengkap', description: 'Sistem reverse osmosis lengkap dengan membrane housing, pressure vessel, high pressure pump, dan instrumentasi RO.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['RO membrane & housing', 'Pressure vessel', 'High pressure pump', 'Instrumentasi RO'],
    images: ['/images/products/product-5.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-6', name: 'Chlorine Dioxide Generator', slug: 'chlorine-dioxide-generator', categoryId: 'cat-equipment-supply',
    shortDesc: 'Generator ClO₂ dengan dosing & monitoring', description: 'Sistem chlorine dioxide lengkap dengan chemical dosing package dan monitoring system untuk disinfeksi air.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Chlorine dioxide generator', 'Chemical dosing package', 'Monitoring system', 'Disinfeksi efektif'],
    images: ['/images/products/product-6.jpg'],
  }),
  prod({
    id: 'prod-7', name: 'Multi Media Filter & Carbon Filter', slug: 'multi-media-filter-carbon-filter', categoryId: 'cat-equipment-supply',
    shortDesc: 'Unit filtrasi multimedia & karbon aktif', description: 'Multi media filter dan activated carbon filter untuk menghilangkan kekeruhan, klorin, bau, dan senyawa organik.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Multi media filter', 'Activated carbon filter', 'Iron & manganese removal', 'Softener system'],
    images: ['/images/products/product-7.jpg'],
  }),
  prod({
    id: 'prod-8', name: 'Dosing Pump & High Pressure Pump', slug: 'dosing-pump-high-pressure-pump', categoryId: 'cat-equipment-supply',
    shortDesc: 'Pompa dosing, feed, transfer & submersible', description: 'Rangkaian pompa untuk pengolahan air: high pressure pump, feed pump, dosing pump, transfer pump, dan submersible pump.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['High pressure pump', 'Feed & transfer pump', 'Dosing pump presisi', 'Submersible pump'],
    images: ['/images/products/product-8.jpg'],
  }),
  prod({
    id: 'prod-9', name: 'Cartridge Filter & Bag Filter', slug: 'cartridge-filter-bag-filter', categoryId: 'cat-consumables-spare-parts',
    shortDesc: 'Elemen filter pengganti berkala', description: 'Cartridge filter dan bag filter sebagai consumable pada sistem WTP, WWTP, dan STP.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Berbagai mikron rating', 'Cartridge & bag filter', 'Ketersediaan stok terjaga', 'Meminimalkan downtime'],
    images: ['/images/products/product-9.jpg'],
  }),
  prod({
    id: 'prod-10', name: 'Instrumentation — pH, ORP & Flow Meter', slug: 'instrumentation-ph-orp-flow-meter', categoryId: 'cat-consumables-spare-parts',
    shortDesc: 'Instrumen pengukuran kualitas air', description: 'pH meter, ORP meter, conductivity meter, flow meter, pressure gauge, dan level sensor untuk monitoring proses.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['pH & ORP meter', 'Conductivity meter', 'Flow meter & pressure gauge', 'Level sensor'],
    images: ['/images/products/product-10.jpg'],
  }),
  prod({
    id: 'prod-11', name: 'Carbon Brush & Carbon Seal', slug: 'carbon-brush-carbon-seal', categoryId: 'cat-carbon-graphite',
    shortDesc: 'Komponen carbon graphite mesin industri', description: 'Carbon brush, carbon vane, carbon seal, dan carbon connector beserta brush holder dan slip ring.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Carbon brush & holder', 'Carbon vane', 'Carbon seal & seal rings', 'Copper connector'],
    images: ['/images/products/product-11.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-12', name: 'Conveyor Belt & Crusher Parts', slug: 'conveyor-belt-crusher-parts', categoryId: 'cat-mining-material-handling',
    shortDesc: 'Komponen conveyor & pemecah batu', description: 'Conveyor belt, idler roller, pulley, belt cleaner, serta crusher parts seperti jaw plate, mantle, concave, dan blow bar.',
    price: 'Hubungi Kami', application: 'Industrial',
    features: ['Conveyor belt & roller', 'Pulley & belt cleaner', 'Jaw / cone / impact crusher parts', 'Vibrating screen mesh'],
    images: ['/images/products/product-12.jpg'], isFeatured: true,
  }),
]

interface MockProductFilters {
  search?: string | null
  category?: string | null
  application?: string | null
  featured?: string | null
  inStock?: string | null
  page?: number
  limit?: number
}

export function getMockProductsResponse(filters: MockProductFilters = {}) {
  const { search, category, application, featured, inStock } = filters
  const page = filters.page && filters.page > 0 ? filters.page : 1
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 12

  let list = MOCK_PRODUCTS.filter((p) => p.isActive)

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.shortDesc?.toLowerCase().includes(q) ?? false)
    )
  }
  if (category) list = list.filter((p) => p.categoryId === category)
  if (application) list = list.filter((p) => p.application === application)
  if (featured === 'true') list = list.filter((p) => p.isFeatured)
  if (inStock === 'true') list = list.filter((p) => p.inStock)

  // Featured first, mirroring the real query ordering
  list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))

  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const skip = (page - 1) * limit
  const products = list.slice(skip, skip + limit)

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export function getMockCategoriesResponse() {
  return MOCK_CATEGORIES.map((c) => ({
    ...c,
    _count: { products: MOCK_PRODUCTS.filter((p) => p.categoryId === c.id && p.isActive).length },
  }))
}

// Heuristic: detect a Prisma "cannot reach database" style failure so we only
// fall back to mock data for connectivity issues, not genuine bugs.
export function isDbConnectionError(error: unknown): boolean {
  const e = error as any
  const code = e?.code
  if (code === 'P1001' || code === 'P1002' || code === 'P1017') return true
  const name = e?.name || ''
  if (name.includes('PrismaClientInitializationError')) return true
  const msg = (e?.message || '').toLowerCase()
  return msg.includes("can't reach database") || msg.includes('connection') || msg.includes('econnrefused')
}
