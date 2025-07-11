"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"

interface AdminLoginProps {
  onLogin: (success: boolean, userData?: any, errorMessage?: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if user is admin
        if (data.data.user.role !== 'ADMIN') {
          onLogin(false, null, "Akses ditolak. Memerlukan hak akses admin.")
          return
        }

        // Store token in localStorage as fallback
        if (typeof window !== 'undefined' && data.data.token) {
          localStorage.setItem('authToken', data.data.token)
        }

        onLogin(true, data.data.user)
      } else {
        onLogin(false, null, data.message || "Login gagal. Silakan coba lagi.")
      }
    } catch (error) {
      onLogin(false, null, "Login gagal. Silakan periksa koneksi Anda dan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 p-3 bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl shadow-lg">
              <Image src="/images/logo.png" alt="Metito Water Engineer" fill className="object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">Login Admin</CardTitle>
          <p className="text-gray-600 mt-2">Akses dashboard admin Metito Water Engineer</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Alamat Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan alamat email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-blue-600 rounded-lg h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-2 border-gray-200 focus:border-blue-600 rounded-lg h-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg transition-all duration-300 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sedang masuk...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
