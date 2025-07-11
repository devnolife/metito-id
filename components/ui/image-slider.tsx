"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageSliderProps {
  images: string[]
  autoSlide?: boolean
  autoSlideInterval?: number
  className?: string
  onSlideChange?: (index: number) => void
}

export function ImageSlider({
  images,
  autoSlide = true,
  autoSlideInterval = 4000,
  className = "",
  onSlideChange
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!autoSlide || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % images.length
        onSlideChange?.(newIndex)
        return newIndex
      })
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, autoSlideInterval, isHovered, images.length, onSlideChange])

  useEffect(() => {
    onSlideChange?.(currentIndex)
  }, [currentIndex, onSlideChange])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100 shadow-2xl">
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
                }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="w-12 h-12 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="w-12 h-12 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full shadow-lg backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / images.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
              ? "bg-gradient-to-r from-blue-500 to-orange-500 scale-110"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  )
} 
