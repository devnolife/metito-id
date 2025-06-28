"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

function AdminPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check authentication with backend
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
      })

      if (response.ok) {
        const data = await response.json()

        // Check if user is admin
        if (data.success && data.data.role === 'ADMIN') {
          setIsAuthenticated(true)
          setUser(data.data)

          // Redirect to intended page if this is a redirect from middleware
          if (redirectTo && redirectTo !== '/admin') {
            router.push(redirectTo)
            return
          }
        } else if (data.success && data.data.role !== 'ADMIN') {
          // User is authenticated but not admin
          router.push('/unauthorized')
          return
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
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

      // Redirect to intended page
      if (redirectTo && redirectTo !== '/admin') {
        router.push(redirectTo)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      router.push('/admin')
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
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
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
