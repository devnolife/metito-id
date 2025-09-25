"use client"

import { MessageCircle, User, Wrench, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function WhatsAppFloat() {
  const admins = [
    {
      id: 1,
      name: "Sales 1",
      phoneNumber: "6281234567890",
      message: "Halo, saya tertarik dengan produk Metito Water Solutions. Bisa bantu saya?",
      color: "bg-green-500 hover:bg-green-600",
      badge: "1",
      tooltip: "WhatsApp Admin 1"
    },
    {
      id: 2,
      name: "Admin 2",
      phoneNumber: "6281234567891",
      message: "Halo, saya butuh informasi tentang sistem pengolahan air. Bisa dibantu?",
      color: "bg-blue-500 hover:bg-blue-600",
      badge: "2",
      tooltip: "WhatsApp Admin 2"
    },
    {
      id: 3,
      name: "Admin 3",
      phoneNumber: "6281234567892",
      message: "Halo, saya ingin bertanya tentang layanan Metito Water Solutions. Mohon bantuannya.",
      color: "bg-purple-500 hover:bg-purple-600",
      badge: "3",
      tooltip: "WhatsApp Admin 3"
    }
  ]

  const handleWhatsAppClick = (admin: typeof admins[0]) => {
    const message = encodeURIComponent(admin.message)
    const whatsappUrl = `https://wa.me/${admin.phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-3">
        {admins.map((admin, index) => (
          <div key={admin.id} className="relative group">
            <Button
              onClick={() => handleWhatsAppClick(admin)}
              className={`w-16 h-16 rounded-full ${admin.color} hover:shadow-2xl text-white font-semibold transition-all duration-300 hover:scale-110 shadow-lg relative`}
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
              {/* Badge pembeda */}
              <Badge className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center p-0">
                {admin.badge}
              </Badge>
            </Button>

            {/* Tooltip */}
            <div className="absolute bottom-0 right-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
              {admin.tooltip}
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
