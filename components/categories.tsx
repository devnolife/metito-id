import { Card, CardContent } from "@/components/ui/card"
import { Truck, Wrench, Hammer, Cog } from "lucide-react"
import Link from "next/link"

export function Categories() {
  const categories = [
    {
      icon: Truck,
      title: "Excavators",
      description: "Heavy-duty excavators for all construction needs",
      count: "120+ Models",
      color: "bg-blue-500",
    },
    {
      icon: Wrench,
      title: "Bulldozers",
      description: "Powerful bulldozers for earthmoving projects",
      count: "85+ Models",
      color: "bg-green-500",
    },
    {
      icon: Hammer,
      title: "Cranes",
      description: "Mobile and tower cranes for lifting operations",
      count: "95+ Models",
      color: "bg-orange-500",
    },
    {
      icon: Cog,
      title: "Loaders",
      description: "Wheel and track loaders for material handling",
      count: "110+ Models",
      color: "bg-purple-500",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Equipment Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of heavy equipment categories, each designed to meet specific construction
            and industrial needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.title.toLowerCase()}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="text-sm font-semibold text-primary-blue">{category.count}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
