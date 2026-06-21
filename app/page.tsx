import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Target, Lightbulb, Shield } from "lucide-react"
import { db } from "@/lib/db"
import { getMockPageContent, isDbConnectionError } from "@/lib/mock-data"
import * as LucideIcons from "lucide-react"

const staggerDelays = ["", "animation-delay-100", "animation-delay-200", "animation-delay-300"]

// Helper to get icon component
function getIconComponent(iconName?: string) {
  if (!iconName) return null
  const Icon = (LucideIcons as any)[iconName]
  return Icon ? Icon : null
}

async function getPageContent(page: string, section: string) {
  try {
    const contents = await db.pageContent.findMany({
      where: {
        page,
        section,
        isActive: true,
      },
      orderBy: { order: 'asc' }
    })
    return contents
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn(`[mock] Database offline – using mock page content for ${page}/${section}`)
    } else {
      console.error('Error fetching page content:', error)
    }
    return getMockPageContent(page, section)
  }
}

export default async function Home() {
  // Fetch content from database
  const statsHeaderContents = await getPageContent('home', 'stats_header')
  const statsContents = await getPageContent('home', 'stats')
  const servicesHeaderContents = await getPageContent('home', 'services_header')
  const servicesContents = await getPageContent('home', 'services')

  // Parse stats header
  const statsHeaderBadge = statsHeaderContents.find(c => c.key === 'badge')
  const statsHeaderHeading = statsHeaderContents.find(c => c.key === 'heading')
  const statsHeaderDescription = statsHeaderContents.find(c => c.key === 'description')

  // Parse services header
  const servicesHeaderHeading = servicesHeaderContents.find(c => c.key === 'heading')
  const servicesHeaderDescription = servicesHeaderContents.find(c => c.key === 'description')

  // Fallback features jika belum ada di database
  const features = [
    "Teknologi Terdepan dan Inovatif",
    "Dukungan Teknis 24/7 Tersedia",
    "Solusi Kustom untuk Setiap Kebutuhan",
    "Sistem Monitoring dan Kontrol Canggih",
    "Desain Hemat Energi",
    "Jaminan Garansi Komprehensif"
  ]

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* ===== STATS — navy band melanjutkan mood hero ===== */}
      <section className="relative py-24 px-4 bg-[var(--navy)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[url('/images/landing-pages/image2.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-4">
              {statsHeaderBadge?.title || "Solusi Terpercaya"}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.1]">
              {statsHeaderHeading?.title || "Solusi Pengolahan Air Profesional"}
            </h2>
            <p className="mt-5 text-lg text-white/60 leading-relaxed">
              {statsHeaderDescription?.description || "Perusahaan yang berkomitmen memberikan solusi pengolahan air terbaik dengan teknologi modern dan layanan prima."}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {statsContents.map((stat, i) => {
              const IconComponent = getIconComponent(stat.icon || '')

              return (
                <div
                  key={stat.id}
                  className={`group rounded-[1.25rem] bg-white/[0.06] backdrop-blur-md border border-white/10 p-8 text-center transition-all duration-300 hover:bg-white/[0.1] hover:-translate-y-1 animate-fade-in-up ${staggerDelays[i % 4]}`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--lime)]/15 text-[var(--lime)] mb-5 group-hover:scale-110 transition-transform">
                    {IconComponent && <IconComponent className="w-7 h-7" />}
                  </div>
                  <div className="font-display text-4xl md:text-5xl font-bold text-[var(--lime-bright)] leading-none">
                    {stat.title}
                  </div>
                  <div className="mt-2.5 text-white/60 text-sm font-medium">{stat.subtitle}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== SERVICES — ice white, kartu glass-tonal ===== */}
      <section className="py-24 px-4 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Keahlian Kami
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1]">
              {servicesHeaderHeading?.title || "Keahlian Kami"}
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              {servicesHeaderDescription?.description || "Solusi pengolahan air komprehensif yang disesuaikan untuk memenuhi kebutuhan spesifik Anda dan standar industri."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesContents.map((service, i) => {
              const IconComponent = getIconComponent(service.icon || '')

              return (
                <div
                  key={service.id}
                  className={`group relative rounded-[1.25rem] bg-white border border-[#dce9ff] p-8 shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)] animate-fade-in-up ${staggerDelays[i % 4]}`}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--navy)] text-[var(--lime)] mb-6 transition-colors duration-300 group-hover:bg-[var(--lime)] group-hover:text-[var(--navy)]">
                    {IconComponent && <IconComponent className="w-7 h-7" />}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--navy)] mb-3">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Showcase with Hover Effects */}
      <ProductShowcase />

      {/* ===== VISI & MISI — gambar + kartu lime overlap ===== */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="absolute -top-5 -left-5 w-28 h-28 rounded-full border-[7px] border-[var(--lime)]/30" />
            <div className="relative rounded-[1.5rem] overflow-hidden h-[420px] md:h-[500px] bg-[url('/images/landing-pages/image.png')] bg-cover bg-center shadow-[0_40px_90px_-30px_rgba(11,28,48,0.4)]" />
            <div className="absolute -bottom-6 -right-4 md:-right-6 bg-[var(--lime)] rounded-2xl px-7 py-5 shadow-xl shadow-[var(--lime)]/25">
              <div className="font-display text-3xl md:text-4xl font-bold text-[var(--navy)] leading-none">25+</div>
              <div className="mt-1 text-sm font-semibold text-[var(--navy)]/75">Tahun Pengalaman</div>
            </div>
          </div>

          {/* Konten */}
          <div>
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Visi &amp; Misi
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1] mb-8">
              Komitmen Terhadap Masa Depan Air Bersih
            </h2>

            <div className="space-y-5">
              <div className="flex gap-5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--navy)] text-[var(--lime)] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--navy)] mb-1.5">Visi Kami</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">
                    Menjadi perusahaan terdepan dalam solusi pengolahan air yang berkelanjutan dan ramah lingkungan di Indonesia.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 rounded-2xl border border-[#e5eeff] bg-[#f8f9ff] p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--lime)] text-[var(--navy)] flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--navy)] mb-1.5">Misi Kami</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">
                    Menyediakan solusi pengolahan air berkualitas tinggi dengan teknologi terkini dan layanan pelanggan yang prima.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENGAPA METITO — foto engineer + fitur lime ===== */}
      <section className="py-24 px-4 bg-[#f8f9ff] overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Konten */}
          <div>
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[#3d4d00] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Mengapa Metito
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--navy)] tracking-[-0.02em] leading-[1.1] mb-6">
              Keunggulan dalam Solusi Pengolahan Air
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Kami berkomitmen memberikan solusi pengolahan air inovatif dengan teknologi terdepan dan dedikasi tinggi untuk memenuhi kebutuhan pelanggan.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--lime)] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[var(--navy)]" />
                  </div>
                  <span className="text-[var(--navy)] font-medium text-[15px]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="group bg-[var(--navy)] hover:bg-[var(--navy-deep)] text-white font-semibold px-7 py-6 rounded-full">
                Pelajari Lebih Lanjut
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="border-[var(--navy)]/20 text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white font-semibold px-7 py-6 rounded-full">
                Hubungi Kami
              </Button>
            </div>
          </div>

          {/* Foto engineer + kartu mengambang */}
          <div className="relative">
            <div className="relative rounded-[1.5rem] overflow-hidden h-[460px] md:h-[560px] bg-[url('/images/landing-pages/image5.png')] bg-cover bg-top shadow-[0_40px_90px_-30px_rgba(11,28,48,0.4)]" />
            <div className="absolute top-6 -left-4 md:-left-6 flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 px-5 py-4 shadow-xl">
              <div className="w-11 h-11 rounded-full bg-[var(--navy)] text-[var(--lime)] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-[var(--navy)] leading-none">ISO 9001</div>
                <div className="text-xs text-slate-500 mt-0.5">Tersertifikasi</div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-4 md:-right-6 bg-[var(--lime)] rounded-2xl px-7 py-5 shadow-xl">
              <div className="font-display text-3xl font-bold text-[var(--navy)] leading-none">100%</div>
              <div className="mt-1 text-sm font-semibold text-[var(--navy)]/75">Kepuasan Klien</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA — band gambar + overlay navy ===== */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/92 to-[var(--navy)]/70" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Mulai Sekarang
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.1] mb-6">
            Siap Mentransformasi Pengolahan Air Anda?
          </h2>
          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dapatkan konsultasi ahli dan solusi kustom untuk kebutuhan pengolahan air Anda. Tim kami siap membantu Anda mencapai hasil yang optimal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              Unduh Katalog
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
