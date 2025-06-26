import { Button } from "@/components/ui/button"
import { ArrowDown, Star, Award, Users, Shield, Droplets } from "lucide-react"

export function Hero() {
  return (
    <section
      id="home"
      className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 primary-blue text-white rounded-full text-sm font-medium shadow-lg">
                <Droplets className="w-4 h-4 mr-2" />
                Leading Water Treatment Solutions Provider
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary-blue">Metito Water</span>
                <br />
                <span className="text-gray-800">Treatment</span>
                <br />
                <span className="text-accent-orange">Equipment</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Discover our comprehensive range of advanced water and wastewater treatment equipment. From membrane
                systems to filtration units, we provide cutting-edge solutions for industrial and municipal applications
                worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-accent hover:shadow-xl text-white font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105"
              >
                Explore Our Products
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300"
              >
                Contact Our Experts
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary-blue">200+</div>
                <div className="text-gray-600 text-sm">Equipment Models</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 gradient-water rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary-blue">25+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 primary-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary-blue">100%</div>
                <div className="text-gray-600 text-sm">Quality Assured</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary-blue">24/7</div>
                <div className="text-gray-600 text-sm">Support Service</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100 p-8 shadow-2xl">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Water Treatment Equipment Showcase"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-accent-orange">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-blue">ISO</div>
                <div className="text-sm text-gray-600">Certified</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 primary-blue text-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-90">Projects Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
