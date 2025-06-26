"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "15551234567" // Replace with actual WhatsApp number
    const message = encodeURIComponent(
      "Hello, I'm interested in Metito Water treatment equipment. Could you please assist me?",
    )
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="w-16 h-16 rounded-full whatsapp-btn hover:shadow-2xl text-white font-semibold transition-all duration-300 hover:scale-110 shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>

      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Chat with our water experts
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}
