import React from 'react'
import { Loader2, Shield, Lock } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
  submessage?: string
  type?: 'default' | 'auth' | 'dashboard'
}

export function LoadingOverlay({
  message = "Memuat...",
  submessage = "Mohon tunggu sebentar",
  type = 'default'
}: LoadingOverlayProps) {
  const getIcon = () => {
    switch (type) {
      case 'auth':
        return <Shield className="w-8 h-8 text-primary-blue" />
      case 'dashboard':
        return <Lock className="w-8 h-8 text-primary-blue" />
      default:
        return <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative w-20 h-20 p-4 bg-white rounded-3xl shadow-lg border border-blue-100">
            {getIcon()}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">{message}</h2>
          <p className="text-gray-600 max-w-md mx-auto">{submessage}</p>

          {type === 'default' && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'medium', className = '' }: { size?: 'small' | 'medium' | 'large', className?: string }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-primary-blue ${sizeClasses[size]}`} />
    </div>
  )
}
