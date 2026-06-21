"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Droplets } from "lucide-react"

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/bg-hero.png')] bg-cover bg-center bg-no-repeat" />

      {/* Overlay untuk keterbacaan teks */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/45 to-blue-950/65" />

      {/* Konten - di tengah */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg border border-white/20 mb-6">
          <Droplets className="w-4 h-4 mr-2" />
          Teknologi Pengolahan Air Terdepan
        </div>

        <h1 className="font-bold leading-tight text-white drop-shadow-lg">
          <span className="block text-3xl md:text-5xl lg:text-6xl">
            MULTI ENVIRO TIRTA TEKNOLOGI
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-accent-orange">
            (Metito)
          </span>
          <span className="block text-xl md:text-2xl lg:text-3xl mt-4 font-medium text-cyan-200">
            Innovation for water solutions
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-blue-50/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
          Temukan rangkaian lengkap teknologi pengolahan air dan air limbah yang canggih. Dari sistem membran
          hingga unit filtrasi, kami menyediakan inovasi terdepan untuk aplikasi industri dan perkotaan
          di seluruh Indonesia.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gradient-accent hover:shadow-xl text-white font-semibold px-8 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105"
          >
            Jelajahi Produk
            <ArrowDown className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-900 font-semibold px-8 py-3 text-base rounded-lg transition-all duration-300"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>

      {/* Indikator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-6 h-6 text-white/70 animate-bounce" />
      </div>
    </section>
  )
}
