"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20"
    >
      {/* Background Image — tampil langsung tanpa overlay warna */}
      <div className="absolute inset-0 bg-[url('/images/bg-hero.png')] bg-cover bg-center bg-no-repeat" />

      {/* Konten - di tengah */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge — label caps */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.12em] [text-shadow:_0_1px_8px_rgb(0_0_0_/_45%)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--lime)]" />
          </span>
          Teknologi Pengolahan Air Terdepan
        </div>

        {/* Heading — Hanken Grotesk */}
        <h1 className="font-display font-bold tracking-[-0.02em] text-white [text-shadow:_0_2px_30px_rgb(0_0_0_/_55%)]">
          <span className="block text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
            Innovation for
          </span>
          <span className="block text-5xl md:text-6xl lg:text-7xl leading-[1.05] mt-1 text-[var(--lime-bright)]">
            Water Solutions
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-white/90 leading-relaxed [text-shadow:_0_1px_14px_rgb(0_0_0_/_50%)]">
          Inovasi pengolahan air &amp; air limbah untuk aplikasi industri dan perkotaan
          di seluruh Indonesia.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="group bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 text-base rounded-full shadow-xl shadow-black/25 transition-all duration-300 hover:scale-[1.03]"
          >
            Jelajahi Produk
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[var(--navy)] font-semibold px-8 py-6 text-base rounded-full transition-all duration-300"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>

      {/* Indikator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-6 h-6 text-white/80 animate-bounce [filter:drop-shadow(0_1px_6px_rgb(0_0_0_/_50%))]" />
      </div>
    </section>
  )
}
