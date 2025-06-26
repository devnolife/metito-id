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
    const phoneNumber = "15551234567" // Replace with actual WhatsApp number
    const message = encodeURIComponent(product.whatsappMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary-blue">Our Water Treatment Equipment</h2>
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
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
                selectedCategory === category.id
                  ? "border-primary-blue shadow-lg bg-blue-50"
                  : "border-gray-200 hover:border-accent-orange"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-12 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-primary-blue font-semibold">
              <Filter className="w-5 h-5" />
              <span>Filter Equipment:</span>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-primary-blue rounded-lg"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-primary-blue rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-primary-blue rounded-lg">
                  <SelectValue placeholder="All Applications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Municipal">Municipal</SelectItem>
                </SelectContent>
              </Select>

              <Button className="primary-blue hover:bg-blue-800 text-white rounded-lg">Apply Filters</Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-hover overflow-hidden border-0 shadow-lg bg-white">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="default"
                    className={`${
                      product.application === "Industrial"
                        ? "primary-blue hover:bg-blue-800"
                        : "water-blue hover:bg-sky-600"
                    } text-white`}
                  >
                    {product.application}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white shadow-lg">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white shadow-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary-blue mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {product.specs.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-primary-blue text-primary-blue">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-primary-blue">{product.capacity}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-semibold text-primary-blue">{product.efficiency}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-semibold text-primary-blue">{product.location}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-accent-orange mb-4">{product.price}</div>

                <Button
                  className="w-full whatsapp-btn hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleWhatsAppClick(product)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Quote via WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-primary-blue mb-2">No Equipment Found</h3>
            <p className="text-gray-600">Try adjusting your search filters or keywords</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-primary-blue mb-4">Need Custom Water Treatment Solutions?</h3>
            <p className="text-gray-600 mb-6">
              Our expert engineers are ready to design and deliver customized water treatment systems tailored to your
              specific requirements
            </p>
            <Button
              size="lg"
              className="gradient-accent hover:shadow-xl text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Request Custom Solution
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
