"use client"

import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/ui/image-slider"
import { ArrowDown, Star, Award, Users, Shield, Droplets } from "lucide-react"
import { useState } from "react"

export function Hero() {
  // Modern slider images for hero section
  const heroImages = [
    "/images/products/product-1.jpg",
    "/images/products/product-2.jpg",
    "/images/products/product-3.jpeg",
    "/images/products/product-10.jpg",
    "/images/products/product-11.jpg",
    "/images/products/product-12.jpg",
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <section
      id="home"
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 primary-blue text-white rounded-full text-sm font-medium shadow-lg">
                <Droplets className="w-4 h-4 mr-2" />
                Teknologi Pengolahan Air Terdepan
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary-blue">Metito Water Solutions</span>
                <br />
                <span className="text-gray-800">Inovasi</span>
                <br />
                <span className="text-accent-orange">Pengolahan Air</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Temukan rangkaian lengkap teknologi pengolahan air dan air limbah yang canggih. Dari sistem membran
                hingga unit filtrasi, kami menyediakan inovasi terdepan untuk aplikasi industri dan perkotaan
                di seluruh Indonesia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-accent hover:shadow-xl text-white font-semibold px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105"
              >
                Jelajahi Produk
                <ArrowDown className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white font-semibold px-6 py-3 text-base rounded-lg transition-all duration-300"
              >
                Hubungi Kami
              </Button>
            </div>


          </div>

          <div className="relative lg:col-span-3">
            <ImageSlider
              images={heroImages}
              autoSlide={true}
              autoSlideInterval={5000}
              className="mb-8"
              onSlideChange={setCurrentSlide}
            />

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border-l-4 border-green-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-xs text-gray-600">Berkualitas</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 primary-blue text-white p-4 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs opacity-90">Kepuasan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
