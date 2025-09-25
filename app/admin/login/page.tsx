"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingOverlay } from "@/components/admin/ui/loading-overlay"
import { AdminLogin } from "@/components/admin/admin-login"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export default function AdminLoginPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Prevent duplicate execution under React Strict Mode dev double-invoke
    if (authCheckRan.current) return
    authCheckRan.current = true
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Cache-Control': 'no-cache',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers,
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()

        if (data.success && data.data.role === 'ADMIN') {
          // User is already authenticated and is admin, redirect to admin dashboard
          const redirect = searchParams.get('redirect') || '/admin'
          router.push(redirect)
          return
        } else if (data.success && data.data.role !== 'ADMIN') {
          toast({
            title: "Akses Ditolak",
            description: "Anda tidak memiliki hak akses admin.",
            variant: "destructive",
          })
          setShowLogin(true)
          return
        }
      }

      if (response.status === 401) {
        // Silently show login without spamming console (avoid repeating logs)
        setShowLogin(true)
      } else {
        setShowLogin(true)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      toast({
        title: "Kesalahan Jaringan",
        description: "Tidak dapat memverifikasi akses. Silakan login kembali.",
        variant: "destructive",
      })
      setShowLogin(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Ref to prevent duplicate auth check in dev
  const authCheckRan = useRef(false)

  const handleLoginSuccess = (success: boolean, userData?: any, errorMessage?: string) => {
    if (success && userData) {
      setUser(userData)
      setShowLogin(false)

      // Check if there's a redirect parameter
      const redirect = searchParams.get('redirect') || '/admin'
      router.push(redirect)
    } else {
      setShowLogin(true)
      if (errorMessage) {
        toast({
          title: "Login Gagal",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <LoadingOverlay
        message="Memverifikasi akses..."
        submessage="Mohon tunggu sebentar"
        type="default"
      />
    )
  }

  // Show login form
  return <AdminLogin onLogin={handleLoginSuccess} />
} 
