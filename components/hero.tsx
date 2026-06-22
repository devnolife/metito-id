"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image — tampil langsung tanpa overlay warna */}
      <div className="absolute inset-0 bg-[url('/images/bg-hero.png')] bg-cover bg-center bg-no-repeat" />

      {/* Wash gradient halus untuk keterbacaan */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/45 via-transparent to-[var(--navy)]/15" />

      {/* Seam bawah — foto hero melebur ke section putih berikutnya */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

      {/* Konten - di tengah */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Eyebrow / sub-header atas */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] [text-shadow:_0_1px_8px_rgb(0_0_0_/_45%)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
          </span>
          Teknologi Pengolahan Air Terdepan
        </div>

        {/* Heading — ringkas & modern */}
        <h1 className="font-display font-bold tracking-[-0.02em] leading-[1.05] text-white text-5xl md:text-6xl lg:text-7xl [text-shadow:_0_2px_26px_rgb(0_0_0_/_50%)]">
          Innovation for{" "}
          <span className="text-white">Water Solutions</span>
        </h1>

        {/* Sub-header */}
        <p className="mx-auto mt-5 max-w-xl text-base md:text-lg lg:text-xl text-white leading-relaxed [text-shadow:_0_1px_12px_rgb(0_0_0_/_45%)]">
          Inovasi pengolahan air &amp; air limbah untuk industri dan perkotaan di seluruh Indonesia.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="group bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-7 py-5 text-base rounded-full shadow-xl shadow-black/25 transition-all duration-300 hover:scale-[1.03]"
          >
            Jelajahi Produk
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-7 py-5 text-base rounded-full transition-all duration-300"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>

      {/* Indikator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-5 h-5 text-white/70 animate-bounce [filter:drop-shadow(0_1px_6px_rgb(0_0_0_/_50%))]" />
      </div>
    </section>
  )
}
