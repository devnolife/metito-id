"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { ErrorHandler, useErrorHandler } from "@/components/admin/ui/error-handler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, Package, FileText, Image, Phone, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { adminDebugger, debugFetch, useAdminDebug } from "@/lib/admin-debug"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

function AdminPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(3)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'
  const { error, errorType, handleError, clearError, autoHandleError } = useErrorHandler()
  const { debug } = useAdminDebug()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Countdown untuk redirect
  useEffect(() => {
    if (showWelcome && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showWelcome && redirectCountdown === 0) {
      router.push(redirectTo)
    }
  }, [showWelcome, redirectCountdown, router, redirectTo])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      clearError()
      adminDebugger.authCheck('checking', { url: '/api/auth/me' })

      // Check authentication with backend
      const response = await debugFetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const data = await response.json()
        adminDebugger.authCheck('success', data)

        // Check if user is admin
        if (data.success && data.data.role === 'ADMIN') {
          setIsAuthenticated(true)
          setUser(data.data)
          setShowWelcome(true)
          adminDebugger.authSuccess(data.data)

          // Store user data in localStorage as backup
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminUser', JSON.stringify(data.data))
            adminDebugger.info('auth', 'User data stored in localStorage')
          }

          return
        } else if (data.success && data.data.role !== 'ADMIN') {
          // User is authenticated but not admin
          adminDebugger.warn('auth', `User ${data.data.email} is not admin`, { role: data.data.role })
          handleError('Akses ditolak. Anda tidak memiliki hak akses admin.', 'permission')
          return
        }
      } else if (response.status === 401) {
        // Unauthorized - show login
        adminDebugger.info('auth', 'User not authenticated, showing login form')
        clearError()
      } else {
        // Other errors
        adminDebugger.error('auth', `Server error: ${response.status}`, {
          status: response.status,
          statusText: response.statusText
        })
        autoHandleError(new Error(`Server error: ${response.status}`))
        return
      }
    } catch (error) {
      adminDebugger.authFailure(error)
      autoHandleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (success: boolean, userData: any = null) => {
    try {
      if (success && userData) {
        if (userData.role !== 'ADMIN') {
          handleError('Akses ditolak. Anda tidak memiliki hak akses admin.', 'permission')
          return
        }

        setIsAuthenticated(true)
        setUser(userData)
        setShowWelcome(true)

        // Store user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminUser', JSON.stringify(userData))
        }

        clearError()
      } else {
        // Clear any stored data on failed login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminUser')
        }
        handleError('Login gagal. Silakan periksa kredensial Anda.', 'auth')
      }
    } catch (error) {
      autoHandleError(error)
    }
  }

  const handleRetry = () => {
    clearError()
    checkAuthStatus()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleSkipWelcome = () => {
    setRedirectCountdown(0)
  }

  // Show error page if there's an error
  if (error) {
    return (
      <ErrorHandler
        error={error}
        type={errorType}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        showRetry={errorType !== 'permission'}
        showGoHome={true}
      />
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <LoadingOverlay
        message="Memverifikasi akses admin..."
        submessage="Mohon tunggu, kami sedang memeriksa kredensial Anda"
        type="auth"
      />
    )
  }

  // Show welcome screen for authenticated admin
  if (isAuthenticated && showWelcome && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Selamat Datang, {user.name}!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Anda berhasil login sebagai administrator
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{user.email}</p>
                    <p className="text-sm text-gray-600">Administrator</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {user.role}
                </Badge>
              </div>

              {/* Quick Access Menu */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Customers</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Package className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Products</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FileText className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Blog</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Image className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Gallery</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Contact</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </div>
              </div>

              {/* Redirect Info */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{redirectCountdown}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Menuju Dashboard</p>
                    <p className="text-sm text-gray-600">Redirecting in {redirectCountdown} seconds...</p>
                  </div>
                </div>
                <Button
                  onClick={handleSkipWelcome}
                  className="bg-primary-blue hover:bg-blue-700 text-white"
                  size="sm"
                >
                  Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show login form
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLogin onLogin={handleLogin} />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <LoadingOverlay
        message="Memuat halaman admin..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    }>
      <AdminPageContent />
    </Suspense>
  )
}
