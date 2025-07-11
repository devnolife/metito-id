import React from 'react'
import { AlertTriangle, RefreshCw, Home, Mail, Wifi, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorHandlerProps {
  error: string | Error | null
  type?: 'auth' | 'network' | 'permission' | 'general'
  onRetry?: () => void
  onGoHome?: () => void
  showRetry?: boolean
  showGoHome?: boolean
}

export function ErrorHandler({
  error,
  type = 'general',
  onRetry,
  onGoHome,
  showRetry = true,
  showGoHome = true
}: ErrorHandlerProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : error.message

  const getErrorConfig = () => {
    switch (type) {
      case 'auth':
        return {
          icon: <Shield className="w-12 h-12 text-red-500" />,
          title: 'Kesalahan Autentikasi',
          description: 'Sesi Anda telah berakhir atau kredensial tidak valid.',
          suggestions: [
            'Periksa kembali email dan kata sandi Anda',
            'Pastikan Anda memiliki akses admin',
            'Hubungi administrator sistem jika masalah berlanjut'
          ]
        }
      case 'network':
        return {
          icon: <Wifi className="w-12 h-12 text-red-500" />,
          title: 'Kesalahan Jaringan',
          description: 'Tidak dapat terhubung ke server.',
          suggestions: [
            'Periksa koneksi internet Anda',
            'Coba refresh halaman',
            'Tunggu beberapa saat dan coba lagi'
          ]
        }
      case 'permission':
        return {
          icon: <Shield className="w-12 h-12 text-red-500" />,
          title: 'Akses Ditolak',
          description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
          suggestions: [
            'Pastikan Anda login sebagai admin',
            'Hubungi administrator untuk mendapatkan akses',
            'Kembali ke halaman utama'
          ]
        }
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          title: 'Terjadi Kesalahan',
          description: 'Maaf, terjadi kesalahan yang tidak terduga.',
          suggestions: [
            'Coba refresh halaman',
            'Periksa koneksi internet Anda',
            'Hubungi support jika masalah berlanjut'
          ]
        }
    }
  }

  const config = getErrorConfig()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 p-4 bg-red-50 rounded-3xl">
              {config.icon}
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h2>
            <p className="text-gray-600 mb-4">{config.description}</p>
          </div>

          {/* Error Message */}
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {/* Suggestions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Saran untuk mengatasi:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-primary-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {showRetry && onRetry && (
              <Button
                onClick={onRetry}
                className="flex-1 bg-primary-blue hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            )}
            {showGoHome && onGoHome && (
              <Button
                onClick={onGoHome}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Beranda
              </Button>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-2">Masih mengalami masalah?</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-blue hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Hubungi Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook untuk error handling
export function useErrorHandler() {
  const [error, setError] = React.useState<string | Error | null>(null)
  const [errorType, setErrorType] = React.useState<'auth' | 'network' | 'permission' | 'general'>('general')

  const handleError = (err: string | Error, type: 'auth' | 'network' | 'permission' | 'general' = 'general') => {
    setError(err)
    setErrorType(type)
  }

  const clearError = () => {
    setError(null)
    setErrorType('general')
  }

  const isNetworkError = (err: any) => {
    return err?.message?.includes('fetch') || err?.message?.includes('network') || err?.code === 'NETWORK_ERROR'
  }

  const isAuthError = (err: any) => {
    return err?.message?.includes('auth') || err?.message?.includes('login') || err?.status === 401
  }

  const isPermissionError = (err: any) => {
    return err?.message?.includes('permission') || err?.message?.includes('access') || err?.status === 403
  }

  const autoHandleError = (err: any) => {
    if (isAuthError(err)) {
      handleError(err, 'auth')
    } else if (isNetworkError(err)) {
      handleError(err, 'network')
    } else if (isPermissionError(err)) {
      handleError(err, 'permission')
    } else {
      handleError(err, 'general')
    }
  }

  return {
    error,
    errorType,
    handleError,
    clearError,
    autoHandleError
  }
} 
