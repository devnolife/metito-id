import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download, MapPin, Calendar, Building } from "lucide-react"
import Image from "next/image"

export default function GalleryPage() {
  const projects = [
    {
      id: 1,
      title: "Industrial Water Treatment Plant",
      category: "industrial",
      location: "Jakarta, Indonesia",
      year: "2023",
      client: "PT Manufacturing Corp",
      image: "/placeholder.jpg",
      description: "Complete water treatment system for manufacturing facility"
    },
    {
      id: 2,
      title: "Municipal Water Supply System",
      category: "municipal",
      location: "Surabaya, Indonesia",
      year: "2023",
      client: "City Government",
      image: "/placeholder.jpg",
      description: "Large-scale municipal water treatment and distribution"
    },
    {
      id: 3,
      title: "Reverse Osmosis Plant",
      category: "ro-systems",
      location: "Bandung, Indonesia",
      year: "2022",
      client: "PT Beverage Company",
      image: "/placeholder.jpg",
      description: "High-capacity reverse osmosis system for beverage production"
    },
    {
      id: 4,
      title: "Wastewater Treatment Facility",
      category: "wastewater",
      location: "Medan, Indonesia",
      year: "2022",
      client: "Industrial Complex",
      image: "/placeholder.jpg",
      description: "Advanced wastewater treatment and recycling system"
    },
    {
      id: 5,
      title: "Hospital Water Treatment",
      category: "commercial",
      location: "Yogyakarta, Indonesia",
      year: "2023",
      client: "General Hospital",
      image: "/placeholder.jpg",
      description: "Medical-grade water treatment system for healthcare facility"
    },
    {
      id: 6,
      title: "Hotel Water System",
      category: "commercial",
      location: "Bali, Indonesia",
      year: "2022",
      client: "Luxury Resort",
      image: "/placeholder.jpg",
      description: "Complete water treatment solution for hospitality industry"
    },
    {
      id: 7,
      title: "Chemical Plant Treatment",
      category: "industrial",
      location: "Tangerang, Indonesia",
      year: "2023",
      client: "PT Chemical Industries",
      image: "/placeholder.jpg",
      description: "Specialized water treatment for chemical processing"
    },
    {
      id: 8,
      title: "Desalination Plant",
      category: "desalination",
      location: "Makassar, Indonesia",
      year: "2022",
      client: "Coastal Development",
      image: "/placeholder.jpg",
      description: "Seawater desalination system for coastal community"
    }
  ]

  const categories = [
    { id: "all", name: "All Projects", count: projects.length },
    { id: "industrial", name: "Industrial", count: projects.filter(p => p.category === "industrial").length },
    { id: "municipal", name: "Municipal", count: projects.filter(p => p.category === "municipal").length },
    { id: "commercial", name: "Commercial", count: projects.filter(p => p.category === "commercial").length },
    { id: "ro-systems", name: "RO Systems", count: projects.filter(p => p.category === "ro-systems").length },
    { id: "wastewater", name: "Wastewater", count: projects.filter(p => p.category === "wastewater").length },
    { id: "desalination", name: "Desalination", count: projects.filter(p => p.category === "desalination").length }
  ]

  const filterProjects = (category: string) => {
    if (category === "all") return projects
    return projects.filter(project => project.category === category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Project Portfolio
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Our Project
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our successful water treatment installations across Indonesia, showcasing innovative solutions and engineering excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              View All Projects
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our comprehensive portfolio of water treatment projects across various industries and applications.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full mb-12 bg-white shadow-lg rounded-xl p-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 px-3 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
                >
                  <span className="font-medium text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterProjects(category.id).map((project) => (
                    <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 p-2 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 p-2 rounded-lg">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge className="bg-blue-600 text-white mb-2">
                            {project.category.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{project.year}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building className="w-4 h-4" />
                            <span>{project.client}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
