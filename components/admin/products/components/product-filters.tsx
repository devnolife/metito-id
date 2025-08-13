import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, RotateCcw, Package, Tag, TrendingUp } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface ProductFiltersProps {
  searchTerm: string
  selectedCategory: string
  selectedApplication: string
  showOnlyInStock: boolean
  showOnlyFeatured: boolean
  categories: Category[]
  categoriesLoading: boolean
  onSearch: (value: string) => void
  onCategoryChange: (categoryId: string) => void
  onApplicationChange: (application: string) => void
  onStockFilter: (inStock: boolean) => void
  onFeaturedFilter: (featured: boolean) => void
  onReset: () => void
}

export function ProductFilters({
  searchTerm,
  selectedCategory,
  selectedApplication,
  showOnlyInStock,
  showOnlyFeatured,
  categories,
  categoriesLoading,
  onSearch,
  onCategoryChange,
  onApplicationChange,
  onStockFilter,
  onFeaturedFilter,
  onReset
}: ProductFiltersProps) {
  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedApplication !== "all",
    showOnlyInStock,
    showOnlyFeatured,
    searchTerm.length > 0
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari produk berdasarkan nama, deskripsi, atau kode..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Kategori
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={onCategoryChange}
            disabled={categoriesLoading}
          >
            <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Application Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Aplikasi
          </Label>
          <Select
            value={selectedApplication}
            onValueChange={onApplicationChange}
          >
            <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Pilih aplikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aplikasi</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock & Featured Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Status
          </Label>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={showOnlyInStock}
                onCheckedChange={(checked) => onStockFilter(checked as boolean)}
              />
              <Label
                htmlFor="inStock"
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                Produk Tersedia
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={showOnlyFeatured}
                onCheckedChange={(checked) => onFeaturedFilter(checked as boolean)}
              />
              <Label
                htmlFor="featured"
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                Produk Unggulan
              </Label>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 invisible">
            Actions
          </Label>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={activeFiltersCount === 0}
            className="h-10 w-full border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {activeFiltersCount} filter diterapkan
          </Badge>
          {searchTerm && (
            <Badge variant="outline" className="text-sm">
              Pencarian: "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="outline" className="text-sm">
              Kategori: {categories.find(c => c.id === selectedCategory)?.name}
            </Badge>
          )}
          {selectedApplication !== "all" && (
            <Badge variant="outline" className="text-sm">
              Aplikasi: {selectedApplication}
            </Badge>
          )}
          {showOnlyInStock && (
            <Badge variant="outline" className="text-sm">
              Tersedia
            </Badge>
          )}
          {showOnlyFeatured && (
            <Badge variant="outline" className="text-sm">
              Unggulan
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 
