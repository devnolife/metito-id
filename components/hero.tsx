"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { COMPANY, CONTACT, INDUSTRY_LABELS } from "@/lib/company-profile"

/** Capability rail shown down the right edge on large screens. */
const CAPABILITIES = [
  { code: "WTP", label: "Water Treatment" },
  { code: "WWTP", label: "Waste Water" },
  { code: "STP", label: "Sewage" },
  { code: "RO", label: "Reverse Osmosis" },
]

export function Hero() {
  return (
    <section
      id="home"
      className="grain relative flex min-h-screen items-center overflow-hidden bg-[var(--navy)]"
    >
      {/* Photography, pushed right and heavily graded so type stays dominant. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <div className="absolute inset-0 bg-[url('/images/bg-hero.png')] bg-cover bg-center" />
        {/* The source photo is a bright sky, so it needs aggressive grading to
            sit behind white type without washing the whole panel out. */}
        <div className="absolute inset-0 bg-navy/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-navy-deep/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-navy/85 to-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-transparent to-navy/70" />
      </div>

      <div className="blueprint absolute inset-0 opacity-70" />

      {/* Gold bloom anchoring the headline — the deck's accent. */}
      <div className="glow-gold pointer-events-none absolute -left-40 top-1/4 h-[38rem] w-[38rem] rounded-full blur-[40px]" />

      {/* Flowing contour lines — a water-treatment schematic, not decoration. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.28]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        aria-hidden="true"
      >
        {[220, 340, 460, 580, 700].map((y, i) => (
          <path
            key={y}
            className="flow-line"
            d={`M-100 ${y} C 260 ${y - 70}, 520 ${y + 70}, 820 ${y} S 1300 ${y - 60}, 1600 ${y}`}
            fill="none"
            stroke="var(--aqua)"
            strokeWidth="1"
            strokeDasharray="6 10"
            style={{ animationDelay: `${i * -3.5}s`, animationDuration: `${16 + i * 3}s` }}
          />
        ))}
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-32 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Mono rail replaces the old pill badge. */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              </span>
              <span className="rail text-[var(--gold)]">Sulawesi Selatan</span>
              <span className="h-px w-10 bg-gold/40" />
              <span className="rail text-[var(--body-muted)]">{CONTACT.website}</span>
            </div>

            {/* Headline leads with the promise, not the company name. */}
            <h1 className="font-display mt-7 text-[clamp(2.5rem,5.4vw,4.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white">
              Air bersih,
              <br />
              <span className="text-[var(--gold)]">direkayasa</span> untuk
              <br />
              industri Indonesia.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--body-text)]">
              {COMPANY.brandName} merancang, memasok, dan merawat sistem pengolahan air untuk
              pertambangan, energi, dan manufaktur — dari chemical supply sampai commissioning.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-[var(--gold)] px-7 py-4 text-sm font-bold tracking-tight text-[var(--navy)] transition-all duration-300 hover:bg-[var(--gold-bright)] hover:shadow-[0_0_36px_-6px_rgba(225,196,120,0.65)]"
              >
                Jelajahi Produk
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-sm border border-[var(--hairline)] px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-gold/55 hover:bg-gold/10"
              >
                Konsultasi Teknis
              </Link>
            </div>

            {/* Industries as a dense mono strip rather than rounded pills. */}
            <div className="mt-12 border-t border-[var(--hairline)] pt-5">
              <div className="rail mb-3 text-[var(--body-muted)]">Sektor yang dilayani</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {INDUSTRY_LABELS.map((industry) => (
                  <span
                    key={industry}
                    className="font-mono text-xs tracking-tight text-[var(--body-text)]"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Capability rail — instrument readout down the right edge. It gets
              its own backdrop so it stays legible over the bright sky in the
              photo rather than depending on the gradient alone. */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="ml-auto max-w-[16rem] rounded-sm border border-[var(--hairline)] bg-navy-deep/70 p-6 backdrop-blur-md">
              <div className="rail mb-5 text-[var(--gold)]">Kapabilitas</div>
              <ul className="space-y-4">
                {CAPABILITIES.map(({ code, label }) => (
                  <li key={code} className="group flex items-baseline gap-3">
                    <span className="font-display w-14 shrink-0 text-lg font-extrabold tracking-tight text-[var(--gold)]">
                      {code}
                    </span>
                    <span className="text-sm text-[var(--body-text)] transition-colors group-hover:text-white">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline seam echoing the gold rule that closes every deck slide. */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
    </section>
  )
}
