import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, Building2, MapPin, Calendar, Users, Award, ThumbsUp } from "lucide-react"

export default function CustomerPage() {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Ahmad Santoso",
      position: "General Manager",
      company: "PT Indofood Manufacturing",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Metito Water has been our trusted partner for over 5 years. Their water treatment systems have significantly improved our production efficiency and product quality. The team is professional and always available for support.",
      project: "Industrial Water Treatment Plant",
      location: "Jakarta",
      year: "2019-2024"
    },
    {
      id: 2,
      name: "Ir. Siti Nurhaliza",
      position: "Plant Manager",
      company: "PT Pharmaceutical Indonesia",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Outstanding service and top-quality equipment. The pharmaceutical-grade water system they installed exceeded all our expectations. Their maintenance service is excellent and very responsive.",
      project: "Pharmaceutical Water System",
      location: "Bandung",
      year: "2020-2024"
    },
    {
      id: 3,
      name: "Bapak Wijaya",
      position: "Operations Director",
      company: "Hotel Grand Indonesia",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "The hotel water treatment system has been running flawlessly for 3 years. Our guests consistently praise the water quality, and the system has helped us reduce operational costs significantly.",
      project: "Hotel Water Treatment",
      location: "Jakarta",
      year: "2021-2024"
    },
    {
      id: 4,
      name: "Dr. Made Sutrisno",
      position: "Hospital Director",
      company: "RS Sanglah Hospital",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "Medical-grade water is critical for our operations. Metito Water delivered a system that meets all international standards. Their technical support team is knowledgeable and always ready to help.",
      project: "Medical Water Treatment",
      location: "Bali",
      year: "2022-2024"
    },
    {
      id: 5,
      name: "Ibu Dewi Sartika",
      position: "Environmental Manager",
      company: "PT Pertamina Refinery",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "The wastewater treatment system has helped us achieve zero liquid discharge and meet all environmental regulations. Metito Water's expertise in industrial wastewater is impressive.",
      project: "Industrial Wastewater Treatment",
      location: "Cilacap",
      year: "2020-2024"
    },
    {
      id: 6,
      name: "Pak Hendri Kurniawan",
      position: "Production Manager",
      company: "PT Aqua Golden Mississippi",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      review: "The reverse osmosis system for our beverage production has been exceptional. Water quality is consistent, and the system efficiency has exceeded our expectations. Highly recommended!",
      project: "Beverage Water Treatment",
      location: "Sukabumi",
      year: "2021-2024"
    }
  ]

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "500+", label: "Happy Customers", color: "text-blue-600" },
    { icon: <Award className="w-8 h-8" />, value: "25+", label: "Years Experience", color: "text-green-600" },
    { icon: <ThumbsUp className="w-8 h-8" />, value: "99%", label: "Customer Satisfaction", color: "text-purple-600" },
    { icon: <Building2 className="w-8 h-8" />, value: "1000+", label: "Projects Completed", color: "text-orange-600" }
  ]

  const industries = [
    "Manufacturing", "Pharmaceutical", "Food & Beverage", "Healthcare",
    "Hospitality", "Mining", "Petrochemical", "Municipal", "Power Generation"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Customer Success Stories
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            What Our
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Customers Say
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover why leading companies across Indonesia trust Metito Water for their water treatment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              View Case Studies
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customer Testimonials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read what our valued customers have to say about their experience with our water treatment solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-blue-200 group-hover:text-blue-300 transition-colors" />
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.review}"
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                        <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{testimonial.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{testimonial.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{testimonial.year}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our water treatment solutions cater to diverse industries across Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-6 py-3 text-base font-medium border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let us help you achieve your water treatment goals with our proven solutions and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
