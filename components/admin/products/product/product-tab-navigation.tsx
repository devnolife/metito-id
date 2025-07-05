import { Plus, Package, Settings } from "lucide-react"

interface ProductTabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ProductTabNavigation({ activeTab, setActiveTab }: ProductTabNavigationProps) {
  return (
    <div className="border-b">
      <nav className="flex space-x-8">
        <button
          onClick={() => setActiveTab("products")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "products"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Produk
        </button>
        <button
          onClick={() => {
            console.log("Tab navigation - Setting to 'add'")
            setActiveTab("add")
          }}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "add"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Tambah Produk
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "categories"
              ? "border-primary-blue text-primary-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Kategori
        </button>
      </nav>
    </div>
  )
}
