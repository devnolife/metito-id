// Single source of truth for PT. METITO company information.
// Sourced from the official company profile (informasi.pdf).
// Update this file when the company profile changes — all public pages read from here.

export const COMPANY = {
  legalName: "PT. Multi Enviro Tirta Teknologi",
  brandName: "PT. METITO",
  shortName: "METITO",
  abbreviationOf: "Multi Enviro Tirta Teknologi",
  tagline: "Integrated Solutions for Water, Industry and Mining",
  taglineId: "Solusi Terintegrasi untuk Air, Industri, dan Pertambangan",
  slogan: "Clean Water, Clean Future.",
  description:
    "PT. METITO (Multi Enviro Tirta Teknologi) adalah perusahaan penyedia solusi terintegrasi untuk sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services.",
} as const

export const CONTACT = {
  address: {
    line1: "Bontobila, Barombong",
    line2: "Kab. Gowa, Sulawesi Selatan",
    full: "Bontobila, Barombong, Kab. Gowa, Sulawesi Selatan",
  },
  phones: ["0812-1760-3950", "0821-5555-1235"],
  email: "info@metito.id",
  website: "www.metito.id",
  websiteUrl: "https://www.metito.id",
} as const

/** Digits-only international format for wa.me / tel: links. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("62")) return digits
  if (digits.startsWith("0")) return `62${digits.slice(1)}`
  return digits
}

/** Downloadable company profile (public/documents/company). */
export const COMPANY_PROFILE_PDF = "/documents/company/company-profile-metito.pdf"

export const VISION =
  "Menjadi mitra terpercaya dalam penyediaan solusi terintegrasi untuk kebutuhan air, industri, dan pertambangan di Indonesia."

export const MISSION: string[] = [
  "Menyediakan produk berkualitas tinggi dengan harga kompetitif",
  "Memberikan solusi engineering yang efektif dan efisien",
  "Membangun hubungan jangka panjang berbasis kepercayaan",
  "Mendukung keberlanjutan operasional pelanggan",
]

export interface CoreValue {
  title: string
  description: string
  icon: string
}

export const CORE_VALUES: CoreValue[] = [
  { title: "Quality", description: "Produk dan layanan yang memenuhi standar industri.", icon: "BadgeCheck" },
  { title: "Excellent Service", description: "Layanan purna jual dan dukungan teknis yang profesional.", icon: "Headphones" },
  { title: "Integrity", description: "Hubungan jangka panjang yang dibangun atas dasar kepercayaan.", icon: "ShieldCheck" },
  { title: "Innovation", description: "Solusi engineering yang efektif, efisien, dan berkelanjutan.", icon: "Lightbulb" },
]

export interface Advantage {
  title: string
  description: string
  icon: string
}

/** The three commitments highlighted on the "About Us" page of the profile. */
export const ADVANTAGES: Advantage[] = [
  {
    title: "Kualitas Produk Terjamin",
    description: "Menyediakan produk berkualitas tinggi dari supplier terpercaya.",
    icon: "BadgeCheck",
  },
  {
    title: "Pengiriman Tepat Waktu",
    description: "Komitmen terhadap ketepatan waktu dalam setiap pengiriman.",
    icon: "Truck",
  },
  {
    title: "Kepuasan Pelanggan",
    description: "Layanan purna jual dan dukungan teknis yang profesional.",
    icon: "Headphones",
  },
]

export interface BusinessLine {
  slug: string
  title: string
  description: string
  icon: string
}

export const BUSINESS_LINES: BusinessLine[] = [
  {
    slug: "chemical-supply",
    title: "Chemical Supply",
    description: "Penyediaan bahan kimia industri untuk berbagai aplikasi.",
    icon: "FlaskConical",
  },
  {
    slug: "engineering-services",
    title: "Engineering Services",
    description:
      "Layanan teknik profesional dan konsultasi yang mencakup perancangan, instalasi, hingga pemeliharaan sistem dan proses industri.",
    icon: "Wrench",
  },
  {
    slug: "equipment-supply",
    title: "Equipment Supply",
    description:
      "Melalui kerja sama dengan berbagai produsen dan pemasok terpercaya, kami memastikan ketersediaan equipment serta sistem pendukung berstandar industri demi memenuhi kebutuhan bisnis Anda.",
    icon: "Settings",
  },
  {
    slug: "spare-parts-supply",
    title: "Spare Parts Supply",
    description:
      "Didukung oleh jaringan produsen, distributor, dan pemasok terpercaya, kami menyediakan suku cadang original dan alternatif berkualitas sesuai standar industri guna memastikan ketersediaan yang tepat waktu, menjaga produktivitas, serta meminimalkan downtime operasional Anda.",
    icon: "Cog",
  },
]

export interface ProductGroup {
  slug: string
  title: string
  description: string
  items: string[]
  icon: string
  color: string
}

/** The six product groups from the "Our Products" pages of the profile. */
export const PRODUCT_GROUPS: ProductGroup[] = [
  {
    slug: "chemical-supply",
    title: "Chemical Supply",
    description: "Penyediaan bahan kimia industri untuk berbagai aplikasi.",
    items: ["Water Treatment Chemical", "Waste Water Chemical", "Boiler & Cooling Tower Chemical", "Maintenance Chemical"],
    icon: "FlaskConical",
    color: "#ef4444",
  },
  {
    slug: "water-treatment",
    title: "Water Treatment",
    description: "Media dan membran untuk sistem pengolahan air.",
    items: ["Ion Exchange Resin", "Filter Media", "Membrane RO/UF/NF", "Activated Carbon"],
    icon: "Droplets",
    color: "#0ea5e9",
  },
  {
    slug: "equipment-supply",
    title: "Equipment Supply",
    description: "Peralatan dan sistem pendukung berstandar industri.",
    items: [
      "HP Pump",
      "Feed Pump",
      "Dosing Pump",
      "Blower",
      "Multi Media Filter",
      "Carbon Filter",
      "Softener",
      "RO System",
      "Demin Plant",
      "Chlorine Dioxide Generator",
      "Instrumentation",
    ],
    icon: "Settings",
    color: "#f59e0b",
  },
  {
    slug: "consumables-spare-parts",
    title: "Consumables & Spare Parts",
    description: "Suku cadang original dan alternatif berkualitas.",
    items: ["Cartridge Filter", "Valve", "Mechanical Seal", "Gasket", "Bearing"],
    icon: "Cog",
    color: "#10b981",
  },
  {
    slug: "carbon-graphite",
    title: "Carbon Graphite",
    description: "Komponen carbon graphite untuk mesin industri.",
    items: ["Carbon Brush", "Carbon Vane", "Carbon Seal", "Carbon Connector"],
    icon: "Zap",
    color: "#8b5cf6",
  },
  {
    slug: "mining-material-handling",
    title: "Mining & Material Handling",
    description: "Komponen penunjang pertambangan dan penanganan material.",
    items: ["Conveyor Belt", "Roller", "Crusher Parts", "Vibrating Screen"],
    icon: "Truck",
    color: "#06b6d4",
  },
]

export interface CatalogGroup {
  title: string
  items: string[]
}

/** Chemical Supply detail — "Penyediaan Bahan Kimia Industri untuk Berbagai Aplikasi". */
export const CHEMICAL_SUPPLY: CatalogGroup[] = [
  {
    title: "Water Treatment Plant (WTP)",
    items: [
      "PAC (Poly Aluminium Chloride)",
      "Aluminium Sulfate (Tawas)",
      "Soda Ash",
      "Caustic Soda (NaOH)",
      "Hydrochloric Acid (HCl)",
      "Sulfuric Acid (H₂SO₄)",
      "Sodium Hypochlorite (NaOCl)",
      "Activated Carbon",
      "Silica Sand",
      "Anthracite",
      "Resin Kation & Anion",
      "Antiscalant RO",
      "Membrane Cleaner",
    ],
  },
  {
    title: "Waste Water Treatment (WWTP)",
    items: [
      "Polymer Anionik",
      "Polymer Kationik",
      "PAC",
      "Ferric Chloride",
      "Ferrous Sulfate",
      "Nutrient Bacteria",
      "Defoamer",
      "pH Adjuster",
      "Coagulant",
      "Flocculant",
    ],
  },
  {
    title: "Sewage Treatment Plant (STP)",
    items: [
      "Bio Culture",
      "Enzyme Bacteria",
      "Chlorine",
      "Chlorine Dioxide",
      "Odor Control Chemical",
      "Disinfectant Chemical",
    ],
  },
  {
    title: "Boiler & Cooling Tower",
    items: [
      "Oxygen Scavenger",
      "Scale Inhibitor",
      "Boiler Treatment Chemical",
      "Condensate Line Treatment",
      "Cooling Water Treatment Chemical",
    ],
  },
  {
    title: "Industrial Maintenance Chemical",
    items: [
      "Chain Lubricant",
      "Food Grade Lubricant",
      "Penetrating Oil",
      "Rust Remover",
      "Contact Cleaner",
      "Electrical Cleaner",
      "Degreaser",
      "Industrial Cleaner",
      "Produk setara CRC Industries",
    ],
  },
]

export interface EngineeringService {
  slug: string
  title: string
  description: string
  icon: string
}

/** Engineering Services page of the profile. */
export const ENGINEERING_SERVICES: EngineeringService[] = [
  {
    slug: "design-wtp",
    title: "Design WTP",
    description: "Perancangan Water Treatment Plant sesuai karakteristik air baku dan kebutuhan kapasitas.",
    icon: "droplets",
  },
  {
    slug: "design-wwtp",
    title: "Design WWTP",
    description: "Perancangan Waste Water Treatment Plant untuk memenuhi baku mutu air limbah industri.",
    icon: "filter",
  },
  {
    slug: "design-stp",
    title: "Design STP",
    description: "Perancangan Sewage Treatment Plant untuk pengolahan air limbah domestik.",
    icon: "filter",
  },
  {
    slug: "reverse-osmosis-system",
    title: "Reverse Osmosis System",
    description: "Perancangan dan pembangunan sistem reverse osmosis untuk air proses dan air bersih.",
    icon: "droplets",
  },
  {
    slug: "demineralization-plant",
    title: "Demineralization Plant",
    description: "Sistem demineralisasi berbasis resin kation, anion, dan mixed bed untuk air bebas mineral.",
    icon: "zap",
  },
  {
    slug: "chlorine-dioxide-system",
    title: "Chlorine Dioxide System",
    description: "Sistem generator klorin dioksida beserta paket dosing dan monitoring.",
    icon: "zap",
  },
  {
    slug: "chemical-dosing-system",
    title: "Chemical Dosing System",
    description: "Sistem dosing bahan kimia presisi untuk proses pengolahan air dan utilitas.",
    icon: "wrench",
  },
  {
    slug: "installation-commissioning",
    title: "Installation & Commissioning",
    description: "Instalasi, pengujian, dan commissioning sistem hingga siap beroperasi.",
    icon: "wrench",
  },
  {
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    description: "Perawatan berkala untuk menjaga performa sistem dan meminimalkan downtime.",
    icon: "clock",
  },
  {
    slug: "plant-audit",
    title: "Plant Audit",
    description: "Audit menyeluruh terhadap performa plant beserta rekomendasi perbaikan.",
    icon: "shield",
  },
  {
    slug: "troubleshooting-system",
    title: "Troubleshooting System",
    description: "Identifikasi dan penanganan gangguan sistem pengolahan air secara cepat.",
    icon: "wrench",
  },
]

/** Equipment Supply page of the profile. */
export const EQUIPMENT_SUPPLY: CatalogGroup[] = [
  {
    title: "Water Treatment Equipment",
    items: [
      "High Pressure Pump",
      "Feed Pump",
      "Dosing Pump",
      "Transfer Pump",
      "Submersible Pump",
      "Blower",
      "Air Compressor",
    ],
  },
  {
    title: "Filtration System",
    items: [
      "Multi Media Filter",
      "Activated Carbon Filter",
      "Softener System",
      "Iron Removal Filter",
      "Manganese Removal Filter",
      "Cartridge Filter",
      "Bag Filter",
      "UV Sterilizer",
    ],
  },
  {
    title: "Reverse Osmosis System",
    items: ["RO Membrane", "Membrane Housing", "Pressure Vessel", "High Pressure Pump", "Instrumentasi RO"],
  },
  {
    title: "Demineralization Plant",
    items: [
      "Cation Vessel",
      "Anion Vessel",
      "Mixed Bed Vessel",
      "Resin Kation",
      "Resin Anion",
      "Conductivity Meter",
    ],
  },
  {
    title: "Chlorine Dioxide System",
    items: ["Chlorine Dioxide Generator", "Chemical Dosing Package", "Monitoring System"],
  },
  {
    title: "Belt Conveyor",
    items: [
      "Conveyor Belt",
      "Idler Roller",
      "Pulley",
      "Belt Cleaner",
      "Skirting Rubber",
      "Conveyor Motor",
      "Conveyor Gearbox",
    ],
  },
  {
    title: "Crusher (Pemecah Batu)",
    items: [
      "Jaw Crusher Parts",
      "Cone Crusher Parts",
      "Impact Crusher Parts",
      "Hammer Crusher Parts",
      "Toggle Plate",
      "Jaw Plate",
      "Mantle",
      "Concave",
      "Blow Bar",
      "Screen Mesh",
      "Bearing",
      "Shaft",
      "Coupling",
    ],
  },
]

/** Consumable & Spare Parts page of the profile. */
export const SPARE_PARTS: CatalogGroup[] = [
  {
    title: "WTP / WWTP / STP",
    items: [
      "Filter Sand",
      "Activated Carbon",
      "Anthracite",
      "Gravel",
      "Resin",
      "Cartridge Filter",
      "Bag Filter",
      "Diffuser",
      "Membrane MBR",
      "Mechanical Seal",
      "Bearing",
      "Valve Kit",
      "Gasket",
      "O-Ring",
    ],
  },
  {
    title: "Instrumentation",
    items: ["pH Meter", "ORP Meter", "Conductivity Meter", "Flow Meter", "Pressure Gauge", "Level Sensor"],
  },
  {
    title: "Carbon Graphite",
    items: [
      "Carbon Brush",
      "Sliding Contact Brush",
      "Automotive Brush",
      "Vanes",
      "Bushing & Valves",
      "Copper Connectors",
      "Carbon Block",
      "Segmented Rings",
      "Slip Ring",
      "Carbon Brush Holder",
      "Spring Constant",
      "Protection System",
      "Ring Bushing",
      "Carbon Bushing",
      "Carbon Insert",
      "Mechanical Seal",
      "Seal Rings",
    ],
  },
]

export interface Industry {
  slug: string
  title: string
  description: string
  icon: string
}

/** "Our Clients" / industries served. */
export const INDUSTRIES: Industry[] = [
  {
    slug: "mining",
    title: "Mining",
    description: "Pertambangan batubara, nikel, emas, dan mineral lainnya.",
    icon: "Mountain",
  },
  {
    slug: "petrochemical",
    title: "Petrochemical",
    description: "Industri petrokimia dan pengolahan kimia.",
    icon: "FlaskConical",
  },
  {
    slug: "oil-gas",
    title: "Oil & Gas",
    description: "Eksplorasi dan produksi minyak & gas bumi.",
    icon: "Flame",
  },
  {
    slug: "palm-oil-refinery",
    title: "Palm Oil Refinery",
    description: "Pabrik pengolahan kelapa sawit.",
    icon: "Factory",
  },
  {
    slug: "water-treatment",
    title: "Water Treatment",
    description: "Instalasi pengolahan air bersih dan limbah.",
    icon: "Droplets",
  },
  {
    slug: "power-plants",
    title: "Power Plants",
    description: "Pembangkit listrik tenaga uap dan gas.",
    icon: "Zap",
  },
]

/** Short industry labels used in compact strips (e.g. hero/about). */
export const INDUSTRY_LABELS: string[] = INDUSTRIES.map((i) => i.title)
