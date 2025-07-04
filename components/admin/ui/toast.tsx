"use client"

import { toast } from "sonner"
import { CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"

interface ToastOptions {
  duration?: number
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
}

export const Toast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      duration: options?.duration || 3000,
      position: options?.position || "top-right"
    })
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      duration: options?.duration || 5000,
      position: options?.position || "top-right"
    })
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      icon: <Info className="w-4 h-4" />,
      duration: options?.duration || 3000,
      position: options?.position || "top-right"
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      duration: options?.duration || Infinity,
      position: options?.position || "top-right"
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    })
  }
}

// Helper untuk menangani API calls dengan toast
export const withToast = async <T,>(
  asyncFn: () => Promise<T>,
  messages: {
    loading: string
    success: string
    error?: string
  }
): Promise<T> => {
  const toastId = Toast.loading(messages.loading)

  try {
    const result = await asyncFn()
    toast.dismiss(toastId)
    Toast.success(messages.success)
    return result
  } catch (error) {
    toast.dismiss(toastId)
    const errorMessage = messages.error ||
      (error instanceof Error ? error.message : 'Terjadi kesalahan')
    Toast.error(errorMessage)
    throw error
  }
}
