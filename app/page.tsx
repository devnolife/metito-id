import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Globe, Shield, Droplets, Filter, Zap, Settings, Star, CheckCircle, ArrowRight } from "lucide-react"

export default function Home() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "500+", label: "Happy Customers", color: "text-blue-600" },
    { icon: <Award className="w-8 h-8" />, value: "25+", label: "Years Experience", color: "text-green-600" },
    { icon: <Globe className="w-8 h-8" />, value: "50+", label: "Countries Served", color: "text-purple-600" },
    { icon: <Shield className="w-8 h-8" />, value: "99%", label: "Customer Satisfaction", color: "text-orange-600" }
  ]

  const services = [
    {
      icon: <Droplets className="w-12 h-12 text-blue-600" />,
      title: "Water Treatment",
      description: "Complete water treatment solutions for industrial and municipal applications"
    },
    {
      icon: <Filter className="w-12 h-12 text-green-600" />,
      title: "Filtration Systems",
      description: "Advanced filtration technology for clean and safe water supply"
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-600" />,
      title: "Disinfection",
      description: "UV and ozone disinfection systems for pathogen elimination"
    },
    {
      icon: <Settings className="w-12 h-12 text-orange-600" />,
      title: "Maintenance",
      description: "Professional maintenance and support services for optimal performance"
    }
  ]

  const features = [
    "ISO 9001:2015 Certified Quality Management",
    "24/7 Technical Support Available",
    "Custom Solutions for Every Need",
    "Advanced Monitoring and Control Systems",
    "Energy-Efficient Designs",
    "Comprehensive Warranty Coverage"
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Trusted Worldwide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leading Water Treatment Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Over two decades of excellence in water treatment technology, serving customers across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive water treatment solutions tailored to meet your specific requirements and industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase with Hover Effects */}
      <ProductShowcase />

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
                Why Choose Metito Water
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Excellence in Water Treatment Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With over 25 years of experience, we deliver innovative water treatment solutions that meet the highest quality standards and exceed customer expectations.
              </p>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl">
                  View Certifications
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">ISO Certified</div>
                      <div className="text-sm text-gray-600">Quality Management</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">24/7 Support</div>
                      <div className="text-sm text-gray-600">Always Available</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6 mt-12">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Global Reach</div>
                      <div className="text-sm text-gray-600">50+ Countries</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">Expert Team</div>
                      <div className="text-sm text-gray-600">25+ Years Experience</div>
                    </CardContent>
                  </Card>
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
            Ready to Transform Your Water Treatment?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get expert consultation and custom solutions for your water treatment needs. Our team is ready to help you achieve optimal results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Download Catalog
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      <WhatsAppFloat />
    </div>
  )
}
