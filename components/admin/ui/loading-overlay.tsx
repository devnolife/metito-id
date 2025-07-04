"use client"

import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = "Memproses..." }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

interface ProcessingIndicatorProps {
  isProcessing: boolean
  message?: string
  className?: string
}

export function ProcessingIndicator({
  isProcessing,
  message = "Memproses...",
  className = ""
}: ProcessingIndicatorProps) {
  if (!isProcessing) return null

  return (
    <div className={`flex items-center space-x-2 text-blue-600 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
