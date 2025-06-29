"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Droplets, Gauge, Calendar, MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getSetting } from "@/lib/settings"

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([5000, 500000])
  const [showPrices, setShowPrices] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const showPricesSetting = await getSetting('show_prices')
        setShowPrices(showPricesSetting !== false)
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
      name: "Industrial RO Water Treatment System",
      price: 75000,
      originalPrice: 85000,
      rating: 4.9,
      reviews: 142,
      image: "/placeholder.jpg",
      category: "Reverse Osmosis",
      capacity: "5000 LPH",
      year: 2024,
      specs: ["5000 LPH", "Industrial Grade", "Auto Cleaning", "Remote Monitoring"],
      description: "High-capacity reverse osmosis system designed for industrial applications with advanced monitoring and control features.",
      features: ["304SS Construction", "PLC Control", "CIP System", "TDS Monitoring"],
      inStock: true,
      warranty: "2 Years",
      delivery: "2-3 Weeks"
    },
    {
      id: 2,
      name: "Municipal Water Treatment Plant",
      price: 250000,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      image: "/placeholder.jpg",
      category: "Municipal Systems",
      capacity: "50,000 LPD",
      year: 2024,
      specs: ["50,000 LPD", "Municipal Grade", "Automated", "SCADA Ready"],
      description: "Complete municipal water treatment solution with advanced automation and SCADA integration for large-scale operations.",
      features: ["SCADA Control", "Multi-Stage Filtration", "Chemical Dosing", "Backwash System"],
      inStock: true,
      warranty: "3 Years",
      delivery: "6-8 Weeks"
    },
    {
      id: 3,
      name: "Wastewater Treatment System",
      price: 120000,
      originalPrice: 135000,
      rating: 4.7,
      reviews: 76,
      image: "/placeholder.jpg",
      category: "Wastewater Treatment",
      capacity: "1000 CMD",
      year: 2024,
      specs: ["1000 CMD", "Biological Treatment", "Effluent Recycling", "Low Energy"],
      description: "Advanced biological wastewater treatment system with effluent recycling capabilities for sustainable operations.",
      features: ["MBR Technology", "Nutrient Removal", "Sludge Treatment", "Effluent Recycling"],
      inStock: true,
      warranty: "2 Years",
      delivery: "4-5 Weeks"
    },
    {
      id: 4,
      name: "UV Disinfection System",
      price: 15000,
      originalPrice: null,
      rating: 4.9,
      reviews: 203,
      image: "/placeholder.jpg",
      category: "Disinfection",
      capacity: "500 LPM",
      year: 2024,
      specs: ["UV-C Technology", "500 LPM", "Low Maintenance", "Eco-Friendly"],
      description: "Chemical-free UV disinfection system providing 99.99% pathogen elimination for safe water supply.",
      features: ["UV-C Lamps", "UV Intensity Monitor", "Auto Cleaning", "Alarm System"],
      inStock: true,
      warranty: "1 Year",
      delivery: "1-2 Weeks"
    },
    {
      id: 5,
      name: "Water Softening Plant",
      price: 25000,
      originalPrice: 28000,
      rating: 4.6,
      reviews: 158,
      image: "/placeholder.jpg",
      category: "Water Softening",
      capacity: "2000 LPH",
      year: 2024,
      specs: ["Ion Exchange", "2000 LPH", "Auto Regeneration", "Salt Efficient"],
      description: "Automatic water softening system using ion exchange technology for removing hardness minerals from water.",
      features: ["Ion Exchange Resin", "Auto Regeneration", "Brine Tank", "Hardness Monitor"],
      inStock: false,
      warranty: "18 Months",
      delivery: "3-4 Weeks"
    },
    {
      id: 6,
      name: "Desalination Plant",
      price: 180000,
      originalPrice: null,
      rating: 4.8,
      reviews: 45,
      image: "/placeholder.jpg",
      category: "Desalination",
      capacity: "10,000 LPD",
      year: 2024,
      specs: ["Seawater RO", "10,000 LPD", "Energy Recovery", "Remote Control"],
      description: "Seawater reverse osmosis desalination plant with energy recovery system for coastal communities.",
      features: ["Energy Recovery", "Seawater Intake", "Post Treatment", "Brine Disposal"],
      inStock: true,
      warranty: "3 Years",
      delivery: "8-10 Weeks"
    }
  ]

  const [filteredProducts, setFilteredProducts] = useState(products)

  const categories = [
    { name: "All Categories", value: "all", count: products.length },
    { name: "Reverse Osmosis", value: "reverse-osmosis", count: 2 },
    { name: "Municipal Systems", value: "municipal", count: 1 },
    { name: "Wastewater Treatment", value: "wastewater", count: 1 },
    { name: "Disinfection", value: "disinfection", count: 1 },
    { name: "Water Softening", value: "softening", count: 1 },
    { name: "Desalination", value: "desalination", count: 1 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Water Treatment Equipment
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Premium Water
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Treatment Systems
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of industrial-grade water treatment solutions designed for efficiency and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Request Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Download Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg sticky top-24">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Search Products</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search equipment..."
                        className="pl-12 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                          <span className="text-gray-700 hover:text-blue-600 font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  {showPrices && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range (USD)</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500000}
                        step={5000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">${priceRange[0].toLocaleString()}</span>
                        <span className="font-medium">${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Capacity Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Capacity</label>
                    <Select>
                      <SelectTrigger className="border-gray-200 rounded-xl">
                        <SelectValue placeholder="Select capacity range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Capacities</SelectItem>
                        <SelectItem value="small">Small (1000 LPH)</SelectItem>
                        <SelectItem value="medium">Medium (1000-10000 LPH)</SelectItem>
                        <SelectItem value="large">Large (10000 LPH)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Availability</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Pre-Order</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-3">
                    Apply Filters
                  </Button>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-gray-600 font-medium">
                  Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of <span className="font-bold text-gray-900">{products.length}</span> products
                </div>

                <div className="flex items-center gap-4">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48 border-gray-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Most Popular</SelectItem>
                      {showPrices && <SelectItem value="price-low">Price: Low to High</SelectItem>}
                      {showPrices && <SelectItem value="price-high">Price: High to Low</SelectItem>}
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none ${viewMode === "grid" ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none ${viewMode === "list" ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 overflow-hidden">
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={250}
                          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === "list" ? "w-full h-64" : "w-full h-48"
                            }`}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${product.inStock ? "bg-green-500" : "bg-orange-500"} text-white`}>
                            {product.inStock ? "In Stock" : "Pre-Order"}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur-md hover:bg-white rounded-xl">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        {product.originalPrice && (
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-red-500 text-white">
                              Save ${(product.originalPrice - product.price).toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2 font-medium">({product.reviews})</span>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {product.category}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {product.name}
                        </h3>

                        {viewMode === "list" && (
                          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.specs.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span>Capacity: {product.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Warranty: {product.warranty}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Delivery: {product.delivery}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {showPrices ? (
                              <>
                                <span className="text-2xl font-bold text-blue-600">
                                  ${product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-gray-600">
                                Contact for Price
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
                            size="sm"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? "Add to Cart" : "Pre-Order"}
                          </Button>
                          <Button variant="outline" size="sm" asChild className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Link href={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-16">
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="rounded-xl">
                    Previous
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">1</Button>
                  <Button variant="outline" className="rounded-xl">2</Button>
                  <Button variant="outline" className="rounded-xl">3</Button>
                  <Button variant="outline" className="rounded-xl">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our engineers can design a tailored water treatment system to meet your specific requirements and capacity needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Request Custom Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Speak with Engineer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
