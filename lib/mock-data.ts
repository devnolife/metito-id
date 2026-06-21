// Mock data fallback used when the database server is unreachable.
// This keeps the public site fully browsable while the DB is offline.

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
  pc({ page: 'home', section: 'stats_header', key: 'badge', title: 'Solusi Terpercaya', order: 1 }),
  pc({ page: 'home', section: 'stats_header', key: 'heading', title: 'Solusi Pengolahan Air Profesional', order: 2 }),
  pc({ page: 'home', section: 'stats_header', key: 'description', description: 'Perusahaan yang berkomitmen memberikan solusi pengolahan air terbaik dengan teknologi modern dan layanan prima.', order: 3 }),

  // Home - stats
  pc({ page: 'home', section: 'stats', key: 'stat_1', title: '100%', subtitle: 'Komitmen Kualitas', icon: 'Target', content: { color: 'text-blue-600' }, order: 1 }),
  pc({ page: 'home', section: 'stats', key: 'stat_2', title: '24/7', subtitle: 'Layanan Siap', icon: 'Lightbulb', content: { color: 'text-green-600' }, order: 2 }),
  pc({ page: 'home', section: 'stats', key: 'stat_3', title: '∞', subtitle: 'Dedikasi Tinggi', icon: 'Heart', content: { color: 'text-purple-600' }, order: 3 }),
  pc({ page: 'home', section: 'stats', key: 'stat_4', title: '100%', subtitle: 'Jaminan Kualitas', icon: 'Shield', content: { color: 'text-orange-600' }, order: 4 }),

  // Home - services header
  pc({ page: 'home', section: 'services_header', key: 'heading', title: 'Keahlian Kami', order: 1 }),
  pc({ page: 'home', section: 'services_header', key: 'description', description: 'Solusi pengolahan air komprehensif yang disesuaikan untuk memenuhi kebutuhan spesifik Anda dan standar industri.', order: 2 }),

  // Home - services
  pc({ page: 'home', section: 'services', key: 'service_1', title: 'Pengolahan Air', description: 'Solusi pengolahan air lengkap untuk aplikasi industri dan perkotaan', icon: 'Droplets', content: { color: 'text-blue-600' }, order: 1 }),
  pc({ page: 'home', section: 'services', key: 'service_2', title: 'Sistem Filtrasi', description: 'Teknologi filtrasi canggih untuk pasokan air bersih dan aman', icon: 'Filter', content: { color: 'text-green-600' }, order: 2 }),
  pc({ page: 'home', section: 'services', key: 'service_3', title: 'Disinfeksi', description: 'Sistem disinfeksi UV dan ozon untuk eliminasi patogen', icon: 'Zap', content: { color: 'text-purple-600' }, order: 3 }),
  pc({ page: 'home', section: 'services', key: 'service_4', title: 'Pemeliharaan', description: 'Layanan pemeliharaan dan dukungan profesional untuk performa optimal', icon: 'Settings', content: { color: 'text-orange-600' }, order: 4 }),
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

// Category names match the icon map used in components/product-showcase.tsx
export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 'cat-membran', name: 'Sistem Membran', slug: 'sistem-membran', description: 'Sistem reverse osmosis & membran untuk pemurnian air', icon: 'Droplets', color: '#0ea5e9', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-filtrasi', name: 'Unit Filtrasi', slug: 'unit-filtrasi', description: 'Unit filtrasi multimedia & karbon aktif', icon: 'Waves', color: '#10b981', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-disinfeksi', name: 'Disinfeksi', slug: 'disinfeksi', description: 'Sistem disinfeksi UV, ozon & klorinasi', icon: 'Zap', color: '#8b5cf6', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-pompa', name: 'Pompa & Motor', slug: 'pompa-motor', description: 'Pompa industri & motor efisiensi tinggi', icon: 'Settings', color: '#f59e0b', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-monitoring', name: 'Monitoring', slug: 'monitoring', description: 'Sistem monitoring & kontrol kualitas air', icon: 'Gauge', color: '#06b6d4', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-dosis', name: 'Dosis Kimia', slug: 'dosis-kimia', description: 'Sistem dosing kimia presisi', icon: 'FlaskConical', color: '#ef4444', isActive: true, createdAt: now, updatedAt: now },
]

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
    id: 'prod-1', name: 'Reverse Osmosis Industrial RO-5000', slug: 'reverse-osmosis-ro-5000', categoryId: 'cat-membran',
    shortDesc: 'Sistem RO kapasitas besar untuk industri', description: 'Sistem reverse osmosis untuk kebutuhan air proses industri dengan tingkat penolakan garam tinggi.',
    price: 'Hubungi Kami', capacity: '5.000 L/jam', efficiency: '99%', location: 'Jakarta', application: 'Industrial',
    features: ['Membran spiral wound', 'Recovery rate tinggi', 'Hemat energi', 'Kontrol otomatis'],
    images: ['/images/products/product-1.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-2', name: 'Brackish Water RO BWRO-2000', slug: 'brackish-water-ro-2000', categoryId: 'cat-membran',
    shortDesc: 'RO air payau untuk municipal', description: 'Sistem RO untuk mengolah air payau menjadi air bersih layak konsumsi.',
    price: 'Hubungi Kami', capacity: '2.000 L/jam', efficiency: '98%', location: 'Surabaya', application: 'Municipal',
    features: ['Anti-scalant dosing', 'CIP system', 'SCADA ready'],
    images: ['/images/products/product-2.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-3', name: 'Multimedia Filter MMF-3000', slug: 'multimedia-filter-3000', categoryId: 'cat-filtrasi',
    shortDesc: 'Filter multimedia kapasitas tinggi', description: 'Unit filtrasi multimedia untuk menghilangkan kekeruhan dan partikel tersuspensi.',
    price: 'Hubungi Kami', capacity: '3.000 L/jam', efficiency: '95%', location: 'Bandung', application: 'Industrial',
    features: ['Media pasir silika', 'Backwash otomatis', 'Vessel FRP'],
    images: ['/images/products/product-3.jpeg'],
  }),
  prod({
    id: 'prod-4', name: 'Activated Carbon Filter ACF-2500', slug: 'activated-carbon-filter-2500', categoryId: 'cat-filtrasi',
    shortDesc: 'Filter karbon aktif penghilang bau', description: 'Menghilangkan klorin, bau, dan senyawa organik dari air.',
    price: 'Hubungi Kami', capacity: '2.500 L/jam', efficiency: '93%', location: 'Semarang', application: 'Municipal',
    features: ['Karbon aktif granular', 'Penghilang klorin', 'Low pressure drop'],
    images: ['/images/products/product-4.jpg'],
  }),
  prod({
    id: 'prod-5', name: 'UV Disinfection System UV-1000', slug: 'uv-disinfection-uv-1000', categoryId: 'cat-disinfeksi',
    shortDesc: 'Disinfeksi UV tanpa bahan kimia', description: 'Sistem disinfeksi ultraviolet untuk membunuh bakteri dan virus tanpa bahan kimia.',
    price: 'Hubungi Kami', capacity: '1.000 L/jam', efficiency: '99,9%', location: 'Jakarta', application: 'Municipal',
    features: ['Lampu UV-C', 'Tanpa bahan kimia', 'Sensor intensitas UV'],
    images: ['/images/products/product-5.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-6', name: 'Ozone Generator OZ-500', slug: 'ozone-generator-oz-500', categoryId: 'cat-disinfeksi',
    shortDesc: 'Generator ozon untuk oksidasi', description: 'Generator ozon untuk disinfeksi dan oksidasi lanjutan pada pengolahan air.',
    price: 'Hubungi Kami', capacity: '500 g/jam', efficiency: '99%', location: 'Medan', application: 'Industrial',
    features: ['Produksi ozon stabil', 'Pendingin udara', 'Kontrol PLC'],
    images: ['/images/products/product-6.jpg'],
  }),
  prod({
    id: 'prod-7', name: 'Centrifugal Pump CP-75', slug: 'centrifugal-pump-cp-75', categoryId: 'cat-pompa',
    shortDesc: 'Pompa sentrifugal efisiensi tinggi', description: 'Pompa sentrifugal untuk transfer air bersih dan air proses.',
    price: 'Hubungi Kami', capacity: '75 m³/jam', efficiency: '90%', location: 'Bekasi', application: 'Industrial',
    features: ['Material stainless steel', 'Hemat energi', 'Perawatan mudah'],
    images: ['/images/products/product-7.jpg'],
  }),
  prod({
    id: 'prod-8', name: 'Online Water Quality Monitor WQM-Pro', slug: 'water-quality-monitor-wqm-pro', categoryId: 'cat-monitoring',
    shortDesc: 'Monitor kualitas air real-time', description: 'Sistem monitoring kualitas air online untuk pH, TDS, kekeruhan, dan klorin.',
    price: 'Hubungi Kami', capacity: 'Real-time', efficiency: '—', location: 'Jakarta', application: 'Municipal',
    features: ['Sensor pH/TDS/turbidity', 'Dashboard online', 'Notifikasi alarm'],
    images: ['/images/products/product-8.jpg'], isFeatured: true,
  }),
  prod({
    id: 'prod-9', name: 'Chemical Dosing Pump CDP-20', slug: 'chemical-dosing-pump-cdp-20', categoryId: 'cat-dosis',
    shortDesc: 'Pompa dosing kimia presisi', description: 'Pompa dosing untuk injeksi bahan kimia secara presisi pada proses pengolahan air.',
    price: 'Hubungi Kami', capacity: '20 L/jam', efficiency: '—', location: 'Tangerang', application: 'Industrial',
    features: ['Akurasi tinggi', 'Tahan korosi', 'Kontrol laju dosis'],
    images: ['/images/products/product-9.jpg'],
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
