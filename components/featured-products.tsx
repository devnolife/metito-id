import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getSetting } from "@/lib/settings"

export function FeaturedProducts() {
  const [showPrices, setShowPrices] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const showPricesLanding = await getSetting('show_prices_landing')
        setShowPrices(showPricesLanding !== false)
      } catch (error) {
        console.error('Error loading price settings:', error)
        // Default to showing prices on error
        setShowPrices(true)
      }
    }
    loadSettings()
  }, [])

  const products = [
    {
      id: 1,
      name: "Sistem RO Industri 5000 LPH",
      price: "Rp 1.125.000.000",
      originalPrice: "Rp 1.275.000.000",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Best Seller",
      specs: ["5000 LPH", "Kelas Industri", "Auto Flush"],
    },
    {
      id: 2,
      name: "Sistem Pengolahan Air Kota",
      price: "Rp 3.750.000.000",
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=400",
      badge: "New Arrival",
      specs: ["50.000 LPD", "SCADA Ready", "Auto Control"],
    },
    {
      id: 3,
      name: "Sistem Pengolahan Air Limbah",
      price: "Rp 1.800.000.000",
      originalPrice: "Rp 2.025.000.000",
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Featured",
      specs: ["1000 CMD", "Teknologi MBR", "Daur Ulang"],
    },
    {
      id: 4,
      name: "Sistem Disinfeksi UV",
      price: "Rp 225.000.000",
      originalPrice: null,
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Popular",
      specs: ["500 LPM", "UV-C", "Auto Clean"],
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Produk Unggulan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan pilihan terbaik sistem pengolahan air kami, menampilkan teknologi terbaru dan penawaran terbaik.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 primary-blue text-white">{product.badge}</Badge>
                <Button size="icon" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">
                  {product.name}
                </h3>

                <div className="flex flex-wrap gap-1 mb-3">
                  {product.specs.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {showPrices && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary-blue">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                )}

                {!showPrices && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Contact for Price</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 primary-blue hover:bg-blue-800" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>Lihat Detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
            asChild
          >
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
