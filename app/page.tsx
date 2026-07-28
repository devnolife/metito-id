import { Hero } from "@/components/hero"
import Link from "next/link"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Lightbulb } from "lucide-react"
import { db } from "@/lib/db"
import { getMockPageContent, isDbConnectionError } from "@/lib/mock-data"
import {
  ADVANTAGES,
  COMPANY,
  COMPANY_PROFILE_PDF,
  CORE_VALUES,
  INDUSTRIES,
  INDUSTRY_LABELS,
  MISSION,
  PRODUCT_GROUPS,
  VISION,
} from "@/lib/company-profile"
import * as LucideIcons from "lucide-react"

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

  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <Hero />

      {/* ===== ABOUT US — foto kiri, komitmen kanan (slide 2 company profile) ===== */}
      <section className="relative py-24 px-4 bg-[var(--navy)] overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--gold)]/5 blur-[130px]" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Kartu foto — kiri */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="group relative h-72 lg:h-full min-h-[440px] rounded-[1.25rem] overflow-hidden border border-[var(--hairline)]">
              <div className="absolute inset-0 bg-[url('/images/landing-pages/image2.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl bg-[var(--surface)]/85 backdrop-blur-md border border-[var(--hairline)] px-5 py-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--gold)] text-[var(--navy)] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white leading-none">{COMPANY.brandName}</div>
                  <div className="text-xs text-[var(--body-muted)] mt-1">{COMPANY.abbreviationOf}</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Konten — kanan */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal direction="right" className="mb-8">
              <SectionHeading
                align="left"
                eyebrow={statsHeaderBadge?.title || "About Us"}
                title={statsHeaderHeading?.title || "About Us"}
                subtitle={statsHeaderDescription?.description || COMPANY.description}
              />
            </Reveal>

            {/* Tiga komitmen dari company profile */}
            <Reveal direction="right" className="mb-8">
              <div className="space-y-4">
                {ADVANTAGES.map((advantage) => {
                  const IconComponent = getIconComponent(advantage.icon)

                  return (
                    <div key={advantage.title} className="flex gap-4">
                      <div className="mt-1 flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center border border-[var(--gold)]/30">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-[var(--gold)] leading-tight">
                          {advantage.title}
                        </div>
                        <p className="text-[var(--body-muted)] text-sm mt-1 leading-relaxed">{advantage.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            {/* Kartu statistik dari database */}
            <div className="grid grid-cols-2 gap-4">
              {statsContents.map((stat, i) => {
                const IconComponent = getIconComponent(stat.icon || '')

                return (
                  <Reveal key={stat.id} delay={i % 4}>
                    <div className="profile-card h-full p-6">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-4">
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </div>
                      <div className="font-display text-2xl font-bold text-white leading-none">{stat.title}</div>
                      <div className="mt-2 text-[var(--body-muted)] text-sm">{stat.subtitle}</div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>

        {/* Industri yang kami layani */}
        <Reveal className="relative max-w-7xl mx-auto mt-14">
          <div className="text-[var(--gold)] font-display font-bold text-lg mb-4">Industri yang Kami Layani:</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {INDUSTRY_LABELS.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--body-text)]"
              >
                {industry}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="profile-rule max-w-7xl mx-auto mt-16" />
      </section>

      {/* ===== VISION & MISSION + CORE VALUES (slide 3) ===== */}
      <section className="py-24 px-4 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex justify-center mb-14">
            <SectionHeading title="Vision & Mission" uppercase={false} />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6">
            <Reveal direction="left">
              <div className="profile-card h-full p-9 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-5">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--gold)] mb-4 tracking-wide">VISI</h3>
                <p className="text-[var(--body-text)] leading-relaxed">{VISION}</p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="profile-card h-full p-9">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-5">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[var(--gold)] mb-5 tracking-wide">MISI</h3>
                </div>
                <ul className="space-y-3">
                  {MISSION.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="profile-bullet mt-2" />
                      <span className="text-[var(--body-text)] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Core values */}
          <Reveal className="text-center mt-16 mb-8">
            <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--gold)] uppercase tracking-[0.15em]">
              Core Values
            </h3>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_VALUES.map((value, i) => {
              const IconComponent = getIconComponent(value.icon)

              return (
                <Reveal key={value.title} delay={i % 4}>
                  <div className="profile-card h-full p-7 text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-4">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mb-2">{value.title}</h4>
                    <p className="text-[var(--body-muted)] text-sm leading-relaxed">{value.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <div className="profile-rule mt-16" />
        </div>
      </section>

      {/* ===== BUSINESS LINES (slide 4) — konten dari database ===== */}
      <section className="relative bg-[var(--navy)] overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-4">
          <Reveal className="flex justify-center mb-14">
            <SectionHeading
              title={servicesHeaderHeading?.title || "Business Lines"}
              subtitle={servicesHeaderDescription?.description || undefined}
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesContents.map((service, i) => {
              const IconComponent = getIconComponent(service.icon || '')

              return (
                <Reveal key={service.id} delay={i % 3}>
                  <div className="profile-card h-full p-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-5">
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--gold)] mb-3">{service.title}</h3>
                    <p className="text-[var(--body-text)] leading-relaxed text-sm">{service.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Band foto industri — seperti bagian bawah slide company profile */}
        <div className="relative h-56 md:h-64">
          <div className="absolute inset-0 bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[var(--navy)]/75" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--navy)] to-transparent" />
        </div>
        <div className="profile-rule max-w-7xl mx-auto" />
      </section>

      {/* ===== OUR PRODUCTS (slide 5 & 6) ===== */}
      <section className="py-24 px-4 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex justify-center mb-14">
            <SectionHeading
              title="Our Products"
              subtitle="Enam kelompok produk untuk kebutuhan air, industri, dan pertambangan."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_GROUPS.map((group, i) => {
              const IconComponent = getIconComponent(group.icon)

              return (
                <Reveal key={group.slug} delay={i % 3}>
                  <Link href={`/products?category=${group.slug}`} className="block h-full">
                    <div className="profile-card h-full p-8 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-4">
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--gold)] mb-3">{group.title}</h3>
                      <p className="text-[var(--body-text)] leading-relaxed text-sm">{group.items.join(", ")}</p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>

          <div className="profile-rule mt-16" />
        </div>
      </section>

      {/* Katalog produk interaktif */}
      <ProductShowcase />

      {/* ===== OUR CLIENTS (slide 11) ===== */}
      <section className="relative bg-[var(--navy)] overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-4">
          <Reveal className="flex justify-center mb-14">
            <SectionHeading title="Our Clients" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((industry, i) => {
              const IconComponent = getIconComponent(industry.icon)

              return (
                <Reveal key={industry.slug} delay={i % 3}>
                  <div className="profile-card h-full p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-4">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--gold)] mb-2">{industry.title}</h3>
                    <p className="text-[var(--body-text)] leading-relaxed text-sm">{industry.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <div className="relative h-56 md:h-64">
          <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[var(--navy)]/75" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--navy)] to-transparent" />
        </div>
        <div className="profile-rule max-w-7xl mx-auto" />
      </section>

      {/* ===== CONTACT CTA (slide 12) ===== */}
      <section className="relative py-28 px-4 overflow-hidden bg-[var(--navy)]">
        <div className="absolute inset-0 opacity-25 bg-[url('/images/landing-pages/image.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)] via-[var(--navy)]/85 to-[var(--navy)]" />

        <Reveal className="relative max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow="Contact Us" title="Hubungi Kami" uppercase={false} />
          <p className="mt-6 text-lg text-[var(--body-text)] max-w-2xl mx-auto leading-relaxed">
            Konsultasikan kebutuhan chemical supply, engineering, equipment, dan spare parts Anda bersama tim kami.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full transition-all hover:scale-[1.03]">
              <Link href="/contact">
                Konsultasi Gratis
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-[var(--gold)]/40 text-[var(--gold)] bg-transparent hover:bg-[var(--gold)] hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <a href={COMPANY_PROFILE_PDF} target="_blank" rel="noopener noreferrer">
                Unduh Company Profile
              </a>
            </Button>
          </div>

          <div className="mt-14">
            <div className="font-display text-2xl md:text-3xl font-bold text-[var(--gold)]">{COMPANY.slogan}</div>
            <div className="mt-2 text-sm text-[var(--body-muted)]">{COMPANY.tagline}</div>
          </div>
        </Reveal>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
