"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"



function AdminPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check authentication with backend
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const data = await response.json()

        // Check if user is admin
        if (data.success && data.data.role === 'ADMIN') {
          setIsAuthenticated(true)
          setUser(data.data)

          // Store user data in localStorage as backup
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminUser', JSON.stringify(data.data))
          }

          // Redirect to dashboard
          router.push('/admin/dashboard')
          return
        } else if (data.success && data.data.role !== 'ADMIN') {
          // User is authenticated but not admin
          router.push('/unauthorized')
          return
        }
      } else {
        // Check if we have user data in localStorage as fallback
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('adminUser')
          if (storedUser) {
            localStorage.removeItem('adminUser')
          }
        }
      }
    } catch (error) {
      // Clear any stored user data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (success: boolean, userData: any = null) => {
    if (success && userData) {
      if (userData.role !== 'ADMIN') {
        router.push('/unauthorized')
        return
      }

      setIsAuthenticated(true)
      setUser(userData)

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUser', JSON.stringify(userData))
      }

      // Redirect to dashboard
      router.push('/admin/dashboard')
    } else {
      // Clear any stored data on failed login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLogin onLogin={handleLogin} />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-blue"></div>
      </div>
    }>
      <AdminPageContent />
    </Suspense>
  )
}
