import React from 'react'
import { Loader2, Shield, Lock } from 'lucide-react'
import LogoLoader from '../../ui/logo-loader'

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
  return (
    <LogoLoader message={message} className="relative z-10" />
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
