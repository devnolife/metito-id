import { Card, CardContent } from "@/components/ui/card"
import { Shield, Truck, Headphones, Award, Clock, DollarSign } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "All equipment undergoes rigorous inspection and comes with comprehensive warranty coverage.",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      description: "Fast and secure delivery to any location across the country with professional handling.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support and technical assistance for all your equipment needs.",
    },
    {
      icon: Award,
      title: "Industry Leader",
      description: "Over 15 years of experience serving construction and industrial sectors worldwide.",
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Streamlined purchasing process with fast approval and immediate equipment availability.",
    },
    {
      icon: DollarSign,
      title: "Best Prices",
      description: "Competitive pricing with flexible financing options and trade-in programs available.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HeavyEquip Pro?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing exceptional service and premium equipment to power your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 primary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
