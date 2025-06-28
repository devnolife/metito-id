"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  MessageCircle,
  Eye,
  Heart,
  Droplets,
  Waves,
  Zap,
  Settings,
  Gauge,
  FlaskConical,
} from "lucide-react"

export function ProductShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState("all")

  const categories = [
    { id: "membrane", name: "Membrane Systems", icon: Droplets, color: "water-blue" },
    { id: "filtration", name: "Filtration Units", icon: Waves, color: "primary-blue" },
    { id: "disinfection", name: "Disinfection", icon: Zap, color: "accent-orange" },
    { id: "pumps", name: "Pumps & Motors", icon: Settings, color: "water-blue" },
    { id: "monitoring", name: "Monitoring", icon: Gauge, color: "primary-blue" },
    { id: "chemical", name: "Chemical Dosing", icon: FlaskConical, color: "accent-orange" },
  ]

  const products = [
    {
      id: 1,
      name: "RO Membrane System 1000 GPD",
      category: "membrane",
      price: "$45,000",
      application: "Industrial",
      capacity: "1000 GPD",
      efficiency: "99.5%",
      location: "USA",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["High Pressure", "Energy Recovery", "Auto Flush"],
      description:
        "Advanced reverse osmosis membrane system designed for industrial water treatment applications with high efficiency and reliability.",
      whatsappMessage: "Hello, I'm interested in the RO Membrane System 1000 GPD. Could you provide more details?",
    },
    {
      id: 2,
      name: "Ultrafiltration Module UF-500",
      category: "filtration",
      price: "$28,000",
      application: "Municipal",
      capacity: "500 m³/day",
      efficiency: "99.9%",
      location: "Germany",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Hollow Fiber", "Backwash System", "PLC Control"],
      description:
        "High-performance ultrafiltration system for municipal water treatment with automated cleaning cycles.",
      whatsappMessage: "Hello, I would like to know more about the Ultrafiltration Module UF-500.",
    },
    {
      id: 3,
      name: "UV Disinfection System UV-2000",
      category: "disinfection",
      price: "$15,000",
      application: "Industrial",
      capacity: "2000 L/min",
      efficiency: "99.99%",
      location: "Netherlands",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["UV-C Lamps", "Intensity Monitor", "Alarm System"],
      description: "Advanced UV disinfection system for effective pathogen elimination without chemical additives.",
      whatsappMessage: "Hello, I'm interested in the UV Disinfection System UV-2000. Please provide pricing details.",
    },
    {
      id: 4,
      name: "Centrifugal Pump CP-750",
      category: "pumps",
      price: "$8,500",
      application: "Industrial",
      capacity: "750 m³/h",
      efficiency: "85%",
      location: "Italy",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Stainless Steel", "Variable Speed", "Dry Run Protection"],
      description:
        "High-efficiency centrifugal pump designed for water treatment applications with variable speed control.",
      whatsappMessage: "Hello, I need information about the Centrifugal Pump CP-750 for my project.",
    },
    {
      id: 5,
      name: "Water Quality Monitor WQM-Pro",
      category: "monitoring",
      price: "$12,000",
      application: "Municipal",
      capacity: "Multi-parameter",
      efficiency: "Real-time",
      location: "USA",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["pH, DO, Turbidity", "Data Logger", "Remote Access"],
      description:
        "Comprehensive water quality monitoring system with real-time data logging and remote access capabilities.",
      whatsappMessage:
        "Hello, I'm interested in the Water Quality Monitor WQM-Pro. Can you provide technical specifications?",
    },
    {
      id: 6,
      name: "Chemical Dosing System CDS-100",
      category: "chemical",
      price: "$6,500",
      application: "Industrial",
      capacity: "100 L/h",
      efficiency: "±1% accuracy",
      location: "Germany",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Peristaltic Pump", "Flow Control", "Level Sensor"],
      description: "Precision chemical dosing system for accurate chemical injection in water treatment processes.",
      whatsappMessage: "Hello, I would like to get a quote for the Chemical Dosing System CDS-100.",
    },
    {
      id: 7,
      name: "Sand Filter SF-2000",
      category: "filtration",
      price: "$18,000",
      application: "Municipal",
      capacity: "2000 m³/day",
      efficiency: "95%",
      location: "France",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Multi-media", "Backwash System", "Automatic Control"],
      description: "High-capacity sand filtration system for municipal water treatment with automated backwash cycles.",
      whatsappMessage: "Hello, I'm interested in the Sand Filter SF-2000. Please provide installation requirements.",
    },
    {
      id: 8,
      name: "Ozone Generator OG-50",
      category: "disinfection",
      price: "$22,000",
      application: "Industrial",
      capacity: "50 g/h",
      efficiency: "99.9%",
      location: "Japan",
      image: "/placeholder.svg?height=300&width=400",
      specs: ["Corona Discharge", "Oxygen Feed", "Concentration Monitor"],
      description:
        "Advanced ozone generation system for water disinfection and oxidation processes in industrial applications.",
      whatsappMessage: "Hello, I need details about the Ozone Generator OG-50 for wastewater treatment.",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesApplication = selectedApplication === "all" || product.application === selectedApplication

    return matchesSearch && matchesCategory && matchesApplication
  })

  const handleWhatsAppClick = (product: (typeof products)[0]) => {
    const phoneNumber = "6281234567890" // Replace with actual WhatsApp number
    const message = encodeURIComponent(product.whatsappMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
            Product Showcase
          </Badge>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Water Treatment Equipment</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of advanced water and wastewater treatment equipment designed for
            industrial and municipal applications
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${selectedCategory === category.id
                  ? "border-blue-600 shadow-lg bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
                }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-blue-100"
                  }`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold text-sm ${selectedCategory === category.id ? "text-blue-600" : "text-gray-700"
                  }`}>
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-gray-200">
              <SelectValue placeholder="Application" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white"
            >
              <div className="relative overflow-hidden">
                {/* Product Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Product details that appear on hover */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-8 group-hover:translate-y-0">
                    <Badge className="bg-blue-600 text-white mb-3 w-fit">
                      {product.application}
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.specs.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-white">{product.price}</div>
                        <div className="text-gray-300 text-sm">{product.capacity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{product.efficiency}</div>
                        <div className="text-gray-300 text-sm">Efficiency</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Always visible bottom section */}
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{product.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleWhatsAppClick(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 border-gray-300 hover:bg-gray-50 rounded-xl h-12 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 border-gray-300 hover:bg-gray-50 rounded-xl h-12 transition-all duration-300"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedApplication("all")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
            <p className="text-blue-100 mb-6">
              We specialize in custom water treatment solutions. Contact our experts for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-3 font-semibold">
                Contact Our Experts
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 rounded-xl px-8 py-3 font-semibold">
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
