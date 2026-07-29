import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import * as LucideIcons from "lucide-react"

import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Reveal } from "@/components/reveal"
import { SectionMarker } from "@/components/section-marker"
import { Panel } from "@/components/panel"
import { CountUp } from "@/components/count-up"
import { db } from "@/lib/db"
import { getMockPageContent, isDbConnectionError } from "@/lib/mock-data"
import {
  ADVANTAGES,
  COMPANY,
  COMPANY_PROFILE_PDF,
  CORE_VALUES,
  INDUSTRIES,
  MISSION,
  PRODUCT_GROUPS,
  VISION,
} from "@/lib/company-profile"

function getIconComponent(iconName?: string) {
  if (!iconName) return null
  const Icon = (LucideIcons as any)[iconName]
  return Icon ? Icon : null
}

async function getPageContent(page: string, section: string) {
  try {
    return await db.pageContent.findMany({
      where: { page, section, isActive: true },
      orderBy: { order: "asc" },
    })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn(`[mock] Database offline – using mock page content for ${page}/${section}`)
    } else {
      console.error("Error fetching page content:", error)
    }
    return getMockPageContent(page, section)
  }
}

/** Bento spans — the product grid is deliberately uneven. */
const PRODUCT_SPANS = [
  "md:col-span-4 lg:col-span-7",
  "md:col-span-2 lg:col-span-5",
  "md:col-span-3 lg:col-span-4",
  "md:col-span-3 lg:col-span-4",
  "md:col-span-3 lg:col-span-4",
  "md:col-span-3 lg:col-span-12",
]

export default async function Home() {
  const statsHeaderContents = await getPageContent("home", "stats_header")
  const statsContents = await getPageContent("home", "stats")
  const servicesHeaderContents = await getPageContent("home", "services_header")
  const servicesContents = await getPageContent("home", "services")

  const statsHeaderHeading = statsHeaderContents.find((c) => c.key === "heading")
  const statsHeaderDescription = statsHeaderContents.find((c) => c.key === "description")
  const servicesHeaderHeading = servicesHeaderContents.find((c) => c.key === "heading")
  const servicesHeaderDescription = servicesHeaderContents.find((c) => c.key === "description")

  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <Hero />

      {/* ===== 01 · PROFIL — asymmetric split, stats as a readout ===== */}
      <section className="grain relative overflow-hidden bg-[var(--navy)] px-6 py-28 lg:px-8">
        <div className="glow-aqua pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Sticky editorial column */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <SectionMarker
                    index="01"
                    label="Profil"
                    title={statsHeaderHeading?.title || "Insinyur air untuk industri berat."}
                    lead={statsHeaderDescription?.description || COMPANY.description}
                  />
                </Reveal>

                <Reveal delay={1} className="mt-10">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--aqua)]"
                  >
                    Tentang perusahaan
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Reveal>
              </div>
            </div>

            {/* Content column */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="group relative h-[19rem] overflow-hidden rounded-sm border border-[var(--hairline)]">
                  <div className="absolute inset-0 bg-[url('/images/landing-pages/image2.png')] bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-navy/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                    <div>
                      <div className="rail text-[var(--aqua)]">{COMPANY.shortName}</div>
                      <div className="font-display mt-1.5 text-xl font-bold text-white">
                        {COMPANY.abbreviationOf}
                      </div>
                    </div>
                    <div className="rail hidden text-[var(--body-muted)] sm:block">
                      Barombong · Gowa
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Commitments as numbered rows, not icon cards */}
              <div className="mt-14">
                <div className="rail mb-1 text-[var(--body-muted)]">Komitmen</div>
                {ADVANTAGES.map((advantage, i) => (
                  <Reveal key={advantage.title} delay={i % 3}>
                    <div className="index-row group flex gap-6 py-6 pr-4 hover:pl-3">
                      <span className="font-mono pt-1 text-xs text-aqua/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold leading-tight text-white transition-colors group-hover:text-[var(--aqua)]">
                          {advantage.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--body-muted)]">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
                <div className="border-t border-[var(--hairline)]" />
              </div>

              {/* Stats as an instrument readout */}
              {statsContents.length > 0 && (
                <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-4">
                  {statsContents.map((stat, i) => (
                    <Reveal key={stat.id} delay={i % 4}>
                      <div className="h-full bg-[var(--navy)] p-6 transition-colors duration-300 hover:bg-[var(--surface)]">
                        <CountUp
                          value={stat.title}
                          className="font-display block text-3xl font-extrabold tracking-tight text-[var(--aqua)]"
                        />
                        <div className="rail mt-2.5 leading-relaxed text-[var(--body-muted)]">
                          {stat.subtitle}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 02 · ARAH — editorial vision/mission, no cards ===== */}
      <section className="relative overflow-hidden border-y border-[var(--hairline)] bg-[var(--navy-deep)] px-6 py-28 lg:px-8">
        <div className="blueprint-fine absolute inset-0 opacity-50" />
        <div className="glow-gold pointer-events-none absolute -left-32 bottom-0 h-[30rem] w-[30rem] rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <SectionMarker index="02" label="Arah" title="Visi & Misi" />
          </Reveal>

          <div className="mt-16 grid gap-16 lg:grid-cols-12">
            {/* Vision as a pull-quote */}
            <Reveal className="lg:col-span-5">
              <div className="border-l-2 border-[var(--gold)] pl-7">
                <div className="rail mb-4 text-[var(--gold)]">Visi</div>
                <p className="font-display text-2xl font-semibold leading-[1.28] tracking-[-0.02em] text-white md:text-[1.75rem]">
                  {VISION}
                </p>
              </div>
            </Reveal>

            {/* Mission as a numbered technical list */}
            <Reveal delay={1} className="lg:col-span-7">
              <div className="rail mb-6 text-[var(--body-muted)]">Misi</div>
              <ol className="space-y-0">
                {MISSION.map((item, i) => (
                  <li
                    key={item}
                    className="group flex items-baseline gap-6 border-t border-[var(--hairline)] py-5 transition-colors last:border-b hover:bg-[var(--aqua)]/[0.03]"
                  >
                    <span className="font-mono text-xs text-aqua/70">
                      M{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed text-[var(--body-text)] transition-colors group-hover:text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Core values as a hairline-divided strip */}
          <div className="mt-20">
            <div className="rail mb-6 text-[var(--body-muted)]">Core Values</div>
            <div className="grid gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
              {CORE_VALUES.map((value, i) => {
                const Icon = getIconComponent(value.icon)
                return (
                  <Reveal key={value.title} delay={i % 4}>
                    <div className="group h-full bg-[var(--navy-deep)] p-7 transition-colors duration-300 hover:bg-[var(--surface)]">
                      {Icon && (
                        <Icon className="h-5 w-5 text-[var(--aqua)] transition-transform duration-300 group-hover:scale-110" />
                      )}
                      <h4 className="font-display mt-5 text-lg font-bold text-white">
                        {value.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--body-muted)]">
                        {value.description}
                      </p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 03 · LAYANAN — expanding index rows ===== */}
      <section className="grain relative overflow-hidden bg-[var(--navy)] px-6 py-28 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <SectionMarker
              index="03"
              label="Layanan"
              title={servicesHeaderHeading?.title || "Lini bisnis"}
              lead={servicesHeaderDescription?.description || undefined}
            />
          </Reveal>

          <div className="mt-16">
            {servicesContents.map((service, i) => {
              const Icon = getIconComponent(service.icon || "")
              return (
                <Reveal key={service.id} delay={i % 3}>
                  <div className="index-row group grid grid-cols-12 items-start gap-5 py-8 hover:pl-4 md:gap-8">
                    <span className="font-mono col-span-2 pt-1.5 text-xs text-aqua/70 md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="col-span-10 md:col-span-4">
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon className="h-5 w-5 shrink-0 text-[var(--aqua)] transition-transform duration-300 group-hover:scale-110" />
                        )}
                        <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-[var(--aqua)] md:text-2xl">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <p className="col-span-12 text-sm leading-relaxed text-[var(--body-muted)] md:col-span-6 md:pt-1">
                      {service.description}
                    </p>

                    <div className="col-span-12 md:col-span-1 md:justify-self-end">
                      <ArrowUpRight className="h-5 w-5 text-[var(--body-muted)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--aqua)] group-hover:opacity-100" />
                    </div>
                  </div>
                </Reveal>
              )
            })}
            <div className="border-t border-[var(--hairline)]" />
          </div>
        </div>
      </section>

      {/* ===== 04 · KATALOG — bento grid, uneven by design ===== */}
      <section className="relative overflow-hidden border-t border-[var(--hairline)] bg-[var(--navy-deep)] px-6 py-28 lg:px-8">
        <div className="blueprint-fine absolute inset-0 opacity-40" />
        <div className="glow-aqua pointer-events-none absolute right-0 top-1/3 h-[32rem] w-[32rem] rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <SectionMarker
              index="04"
              label="Katalog"
              title="Enam lini produk"
              lead="Dari bahan kimia proses sampai suku cadang pertambangan — satu pemasok untuk seluruh rantai kebutuhan."
            />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
            {PRODUCT_GROUPS.map((group, i) => {
              const Icon = getIconComponent(group.icon)
              const isWide = i === 0 || i === 5

              return (
                <Reveal key={group.slug} delay={i % 3} className={PRODUCT_SPANS[i]}>
                  <Link href={`/products?category=${group.slug}`} className="block h-full">
                    <Panel ticked className="h-full p-8">
                      <div className="flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border"
                            style={{
                              borderColor: `${group.color}55`,
                              backgroundColor: `${group.color}14`,
                            }}
                          >
                            {Icon && <Icon className="h-5 w-5" style={{ color: group.color }} />}
                          </div>
                          <span className="font-mono text-xs text-[var(--body-muted)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3
                          className={`font-display mt-6 font-bold leading-tight tracking-tight text-white ${
                            isWide ? "text-2xl md:text-3xl" : "text-xl"
                          }`}
                        >
                          {group.title}
                        </h3>

                        <p className="mt-2.5 text-sm leading-relaxed text-[var(--body-muted)]">
                          {group.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--hairline)] pt-5">
                          {group.items.slice(0, isWide ? 8 : 4).map((item) => (
                            <span
                              key={item}
                              className="font-mono text-[11px] tracking-tight text-[var(--body-text)]"
                            >
                              {item}
                            </span>
                          ))}
                          {group.items.length > (isWide ? 8 : 4) && (
                            <span className="font-mono text-[11px] text-[var(--aqua)]">
                              +{group.items.length - (isWide ? 8 : 4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Panel>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <ProductShowcase />

      {/* ===== 05 · KLIEN — marquee + overlap composition ===== */}
      <section className="relative overflow-hidden border-t border-[var(--hairline)] bg-[var(--navy)] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <SectionMarker
              index="05"
              label="Klien"
              title="Industri yang kami layani"
              lead="Enam sektor dengan tuntutan mutu air dan keandalan operasional yang berbeda-beda."
            />
          </Reveal>
        </div>

        {/* Full-bleed marquee — breaks the container, unlike the old card grid */}
        <div className="relative mt-16 overflow-hidden py-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--navy)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--navy)] to-transparent" />

          <div className="marquee-track gap-4">
            {[...INDUSTRIES, ...INDUSTRIES].map((industry, i) => {
              const Icon = getIconComponent(industry.icon)
              return (
                <div
                  key={`${industry.slug}-${i}`}
                  className="group w-[19rem] shrink-0 rounded-sm border border-[var(--hairline)] bg-surface/55 p-6 transition-colors duration-300 hover:border-aqua/45"
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 text-[var(--aqua)]" />}
                    <h3 className="font-display text-lg font-bold text-white">{industry.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--body-muted)]">
                    {industry.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Photo band with the tagline overlapping it. The source photo is
            bright, so it carries a heavy scrim plus a vignette to keep the
            overlaid headline legible. */}
        <div className="relative mt-20 h-64 md:h-80">
          <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-navy-deep/60" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--navy)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--navy)] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="font-display max-w-3xl text-balance text-center text-[clamp(1.375rem,3vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-white">
              Setiap sistem dirancang untuk{" "}
              <span className="text-[var(--aqua)]">baku mutu</span> dan{" "}
              <span className="text-[var(--aqua)]">uptime</span> yang harus Anda penuhi.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 06 · KONTAK — full-bleed close ===== */}
      <section className="grain relative overflow-hidden border-t border-[var(--hairline)] bg-[var(--navy-deep)] px-6 py-32 lg:px-8">
        <div className="blueprint absolute inset-0 opacity-60" />
        <div className="glow-aqua pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="rail text-[var(--aqua)]">06</span>
              <span className="h-px w-8 bg-aqua/45" />
              <span className="rail text-[var(--body-muted)]">Kontak</span>
            </div>

            <h2 className="font-display mt-6 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] font-black leading-[0.94] tracking-[-0.045em] text-white">
              Punya masalah air yang belum terpecahkan?
            </h2>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--body-text)] md:text-lg">
              Kirim parameter air baku dan target keluaran Anda. Tim teknis kami menyiapkan
              rekomendasi sistem beserta estimasi biayanya.
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-[var(--aqua)] px-8 py-4 text-sm font-bold tracking-tight text-[var(--navy)] transition-all duration-300 hover:bg-[var(--aqua-bright)] hover:shadow-[0_0_36px_-6px_rgba(79,209,232,0.65)]"
              >
                Konsultasi Gratis
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={COMPANY_PROFILE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-sm border border-[var(--hairline)] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-aqua/55 hover:bg-aqua/10"
              >
                Unduh Company Profile
              </a>
            </div>

            <div className="mt-20 border-t border-[var(--hairline)] pt-8">
              <div className="font-display text-2xl font-extrabold tracking-tight text-[var(--gold)] md:text-3xl">
                {COMPANY.slogan}
              </div>
              <div className="rail mt-2.5 text-[var(--body-muted)]">{COMPANY.tagline}</div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
