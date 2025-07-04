"use client"

import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface LoadingStateProps {
  loading?: boolean
  error?: string | null
  success?: string | null
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function LoadingState({
  loading = false,
  error = null,
  success = null,
  children,
  size = "md"
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
        <span className="ml-2 text-gray-600">Sedang memproses...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-600">
        <AlertCircle className={sizeClasses[size]} />
        <span className="ml-2">{error}</span>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center p-4 text-green-600">
        <CheckCircle className={sizeClasses[size]} />
        <span className="ml-2">{success}</span>
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: "primary" | "secondary" | "destructive"
  className?: string
  type?: "button" | "submit"
}

export function LoadingButton({
  loading = false,
  children,
  disabled = false,
  onClick,
  variant = "primary",
  className = "",
  type = "button"
}: LoadingButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 border-gray-300",
    destructive: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  )
}
