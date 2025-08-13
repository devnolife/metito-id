import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, ShoppingCart, DollarSign, Tag, CheckCircle } from "lucide-react"

interface ProductStatsProps {
  activeProducts: number
  categoriesCount: number
  inStockProducts: number
  totalValue: number
}

export function ProductStats({
  activeProducts,
  categoriesCount,
  inStockProducts,
  totalValue
}: ProductStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const statsData = [
    {
      title: "Total Produk",
      value: activeProducts,
      description: "Produk aktif dalam sistem",
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Kategori Produk",
      value: categoriesCount,
      description: "Kategori tersedia",
      icon: Tag,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Produk Tersedia",
      value: inStockProducts,
      description: "Unit siap dipasarkan",
      icon: CheckCircle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Nilai Total",
      value: formatCurrency(totalValue),
      description: "Total nilai inventori",
      icon: DollarSign,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      isAmount: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.textColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold ${stat.isAmount ? 'text-lg' : ''} text-gray-900`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 
