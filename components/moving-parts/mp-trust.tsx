import { ShieldCheck, Award, BadgeCheck, FileCheck, Globe2, Leaf } from "lucide-react"
import { MPLabel } from "./mp-label"
import { MPReveal } from "./mp-reveal"

// Moving Parts — Trust & Authority proof band. Per the B2B "Trust & Authority" landing pattern:
// Hero -> PROOF (certifications, credentials, sectors) -> Solutions -> CTA. Icon+text badges
// (no raster logos required), each with a premium hover lift.
const certifications = [
  { name: "ISO 9001:2015", desc: "Manajemen Mutu", Icon: Award },
  { name: "ISO 14001:2015", desc: "Manajemen Lingkungan", Icon: Leaf },
  { name: "OHSAS 18001", desc: "K3 Keselamatan Kerja", Icon: ShieldCheck },
  { name: "SNI Tersertifikasi", desc: "Standar Nasional", Icon: BadgeCheck },
  { name: "NSF / WQA", desc: "Standar Kualitas Air", Icon: FileCheck },
  { name: "Jangkauan Nasional", desc: "34 Provinsi", Icon: Globe2 },
]

const sectors = [
  "Industri Manufaktur",
  "PDAM & Municipal",
  "Rumah Sakit",
  "Perhotelan",
  "Pertambangan",
  "Food & Beverage",
]

export function MPTrust() {
  return (
    <section className="relative overflow-hidden border-y border-smoke bg-pure px-6 py-24">
      <div className="mx-auto max-w-page">
        <MPReveal className="mb-14 flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-onyx/20" />
            <MPLabel tone="electric">Terakreditasi &amp; Terpercaya</MPLabel>
            <span className="h-px w-10 bg-onyx/20" />
          </div>
          <h2 className="mp-salt max-w-[24ch] font-unica77 text-heading-sm font-bold text-onyx md:text-heading">
            Standar mutu kelas dunia, dibuktikan sertifikasi.
          </h2>
        </MPReveal>

        {/* Certification badges */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {certifications.map((cert, i) => {
            const Icon = cert.Icon
            return (
              <MPReveal
                key={cert.name}
                delay={i * 70}
                className="group flex flex-col items-center gap-3 rounded-medium border border-smoke bg-pure p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-onyx hover:shadow-mp-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-chalk text-onyx transition-colors duration-300 group-hover:bg-electric-ink group-hover:text-pure">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="font-unica77 text-body-sm font-bold leading-tight text-onyx">{cert.name}</span>
                <span className="font-whyte text-caption uppercase tracking-[0.04em] text-ash">{cert.desc}</span>
              </MPReveal>
            )
          })}
        </div>

        {/* Sectors served */}
        <MPReveal delay={160} className="mt-14 flex flex-col items-center gap-6">
          <MPLabel tone="ash">Dipercaya lintas sektor</MPLabel>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {sectors.map((s) => (
              <span
                key={s}
                className="rounded-pill border border-smoke bg-chalk px-5 py-2.5 font-whyte text-caption uppercase tracking-[0.04em] text-onyx/70 transition-colors duration-300 hover:border-onyx hover:text-onyx"
              >
                {s}
              </span>
            ))}
          </div>
        </MPReveal>
      </div>
    </section>
  )
}
