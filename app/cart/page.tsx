"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Truck } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "CAT 320D Excavator",
      price: 285000,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=300",
      specs: ["20 Ton", "Model 2019", "1.200 Jam"],
    },
    {
      id: 2,
      name: "Komatsu D65PX Bulldozer",
      price: 420000,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=300",
      specs: ["180 HP", "Model 2022", "GPS Ready"],
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5000 // Fixed shipping cost
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Keranjang Belanja</h1>
          <p className="text-gray-600">Tinjau peralatan yang Anda pilih sebelum checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Anda kosong</h2>
              <p className="text-gray-600 mb-6">Mulai berbelanja untuk menambahkan peralatan ke keranjang</p>
              <Button className="primary-blue" asChild>
                <Link href="/products">Jelajahi Peralatan</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.specs.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="text-2xl font-bold text-primary-blue">${item.price.toLocaleString()}</div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                className="w-16 text-center border-0"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      Pengiriman
                    </span>
                    <span>${shipping.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Pajak (8%)</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-blue">${total.toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button className="w-full primary-blue hover:bg-blue-800" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Lanjutkan ke Pembayaran
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/products">Lanjutkan Berbelanja</Link>
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 pt-4">
                    <p className="flex items-center mb-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Gratis pengiriman untuk pesanan di atas $500.000
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Opsi pembiayaan tersedia
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
