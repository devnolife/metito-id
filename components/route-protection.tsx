"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RouteProtectionProps {
  children: ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
  allowedRoles?: string[]
}

export function RouteProtection({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo,
  allowedRoles = []
}: RouteProtectionProps) {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) {
      return // Still loading auth state
    }

    const checkAccess = () => {
      // If route requires authentication but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const redirect = redirectTo || '/admin'
        router.push(`${redirect}?redirect=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      // If route requires admin but user is not admin
      if (requireAdmin && (!isAuthenticated || !isAdmin)) {
        if (!isAuthenticated) {
          const redirect = redirectTo || '/admin'
          router.push(`${redirect}?redirect=${encodeURIComponent(window.location.pathname)}`)
        } else {
          router.push('/unauthorized')
        }
        return
      }

      // If specific roles are required
      if (allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role)) {
          router.push('/unauthorized')
          return
        }
      }

      // If we reach here, access is allowed
      setIsChecking(false)
    }

    checkAccess()
  }, [isLoading, isAuthenticated, isAdmin, user, requireAuth, requireAdmin, allowedRoles, router, redirectTo])

  // Show loading while checking auth or access
  if (isLoading || isChecking) {
    return <LoadingSpinner />
  }

  // If all checks pass, render children
  return <>{children}</>
}

// Specific protection components for common use cases
export function AdminProtection({ children, redirectTo }: { children: ReactNode; redirectTo?: string }) {
  return (
    <RouteProtection requireAdmin={true} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  )
}

export function AuthProtection({ children, redirectTo }: { children: ReactNode; redirectTo?: string }) {
  return (
    <RouteProtection requireAuth={true} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  )
}

export function RoleProtection({
  children,
  roles,
  redirectTo
}: {
  children: ReactNode
  roles: string[]
  redirectTo?: string
}) {
  return (
    <RouteProtection requireAuth={true} allowedRoles={roles} redirectTo={redirectTo}>
      {children}
    </RouteProtection>
  )
} 
