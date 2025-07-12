"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface AdminLoginProps {
  onLogin: (success: boolean, userData?: any, errorMessage?: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if user is admin
        if (data.data.user.role === 'ADMIN') {
          // Store token in localStorage
          if (typeof window !== 'undefined' && data.data.token) {
            localStorage.setItem('authToken', data.data.token)
            localStorage.setItem('adminUser', JSON.stringify(data.data.user))
          }

          toast({
            title: "Login Berhasil",
            description: "Selamat datang di admin panel",
          })
          onLogin(true, data.data.user)
        } else {
          setError('Akses ditolak. Hanya admin yang dapat mengakses panel ini.')
          onLogin(false)
        }
      } else {
        setError(data.message || 'Login gagal. Periksa email dan password Anda.')
        onLogin(false)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.')
      onLogin(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Logo at the top */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="Metito Logo"
          width={120}
          height={120}
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">
              Masuk ke panel admin Metito Water Solution
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@metito.com"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Lupa password? Hubungi administrator sistem.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Back to landing page button */}
      <div className="mt-8 flex justify-center w-full max-w-md">
        <a
          href="/"
          className="flex items-center gap-2 w-full justify-center border border-blue-600 text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm bg-white/80 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </a>
      </div>
    </div>
  )
} 
