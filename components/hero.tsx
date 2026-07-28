"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { COMPANY, INDUSTRY_LABELS } from "@/lib/company-profile"

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[var(--navy)]"
    >
      {/* Foto — sisi kanan, seperti cover company profile */}
      <div className="absolute inset-0 lg:left-[38%] bg-[url('/images/bg-hero.png')] bg-cover bg-center" />

      {/* Panel navy dengan potongan diagonal menutupi sisi kiri */}
      <div className="absolute inset-0 bg-[var(--navy)]/95 lg:bg-[var(--navy)] lg:[clip-path:polygon(0_0,58%_0,42%_100%,0_100%)]" />

      {/* Wash agar teks tetap terbaca di layar kecil */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/85 to-[var(--navy)]/40 lg:hidden" />

      {/* Seam bawah — melebur ke section berikutnya */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--navy)]" />

      {/* Konten */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full border border-[var(--gold)]/35 bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            </span>
            Company Profile
          </div>

          {/* Nama perusahaan */}
          <h1 className="font-display font-bold tracking-[-0.01em] leading-[1.05] text-white text-5xl md:text-6xl lg:text-7xl">
            {COMPANY.shortName}
          </h1>
          <p className="mt-3 font-display text-lg md:text-2xl font-semibold text-white/85">
            {COMPANY.abbreviationOf}
          </p>

          {/* Garis emas + tagline, persis seperti cover */}
          <div className="mt-6 h-[3px] w-24 rounded-full bg-[var(--gold)]" />
          <p className="mt-5 text-base md:text-xl font-semibold text-[var(--gold)] leading-relaxed">
            {COMPANY.tagline}
          </p>

          <p className="mt-4 max-w-xl text-sm md:text-base text-[var(--body-text)] leading-relaxed">
            Solusi terintegrasi untuk Water Treatment, Industrial Supply, Engineering, Equipment,
            Spare Parts, dan Mining Support Services.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="group bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] font-bold px-7 py-5 text-base rounded-full transition-all duration-300 hover:scale-[1.03]"
            >
              <Link href="/products">
                Jelajahi Produk
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border border-[var(--gold)]/40 text-[var(--gold)] bg-transparent hover:bg-[var(--gold)] hover:text-[var(--navy)] font-semibold px-7 py-5 text-base rounded-full transition-all duration-300"
            >
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>

          {/* Industri yang dilayani */}
          <div className="mt-10 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            {INDUSTRY_LABELS.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1.5 text-[11px] md:text-xs font-medium text-[var(--body-text)]"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Garis emas di dasar hero — signature company profile */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-[var(--gold)]/70" />

      {/* Indikator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-5 h-5 text-[var(--gold)]/70 animate-bounce" />
      </div>
    </section>
  )
}
