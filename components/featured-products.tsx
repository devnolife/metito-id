import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"

export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "CAT 320D Excavator",
      price: "$285,000",
      originalPrice: "$320,000",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Best Seller",
      specs: ["20 Ton", "2019 Model", "1,200 Hours"],
    },
    {
      id: 2,
      name: "Komatsu D65PX Bulldozer",
      price: "$420,000",
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=400",
      badge: "New Arrival",
      specs: ["180 HP", "2022 Model", "GPS Ready"],
    },
    {
      id: 3,
      name: "Liebherr LTM 1090 Crane",
      price: "$650,000",
      originalPrice: "$720,000",
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Featured",
      specs: ["90 Ton", "2020 Model", "All Terrain"],
    },
    {
      id: 4,
      name: "Volvo L120H Loader",
      price: "$195,000",
      originalPrice: null,
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Popular",
      specs: ["4.5m³ Bucket", "2021 Model", "Low Hours"],
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Equipment</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of premium heavy equipment, featuring the latest models and best deals.
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
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
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

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-blue">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 primary-blue hover:bg-blue-800" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
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
            <Link href="/products">View All Equipment</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
