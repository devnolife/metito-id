"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock, User, Eye, EyeOff, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminLoginProps {
  onLogin: (success: boolean, userData?: any, errorMessage?: string) => void
}

const CAPABILITIES = ["WTP", "WWTP", "STP", "RO"]

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if user is admin
        if (data.data.user.role === 'ADMIN') {
          // Store token in localStorage
          if (typeof window !== 'undefined' && data.data.token) {
            localStorage.setItem('authToken', data.data.token)
            localStorage.setItem('adminUser', JSON.stringify(data.data.user))
          }

          toast({
            title: "Login Berhasil",
            description: "Selamat datang di admin panel",
          })
          onLogin(true, data.data.user)
        } else {
          setError('Akses ditolak. Hanya admin yang dapat mengakses panel ini.')
          onLogin(false)
        }
      } else {
        setError(data.message || 'Login gagal. Periksa email dan password Anda.')
        onLogin(false)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.')
      onLogin(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy">
      {/* Atmosphere: blueprint grid + gold glow, same treatment as the hero. */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div className="glow-gold pointer-events-none absolute -left-40 top-1/3 h-[32rem] w-[32rem]" />
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        {/* Brand rail — hidden on small screens where the form takes over. */}
        <div className="hidden lg:block">
          <div className="mb-8 flex items-center gap-3">
            <span className="rail text-gold">00</span>
            <span className="h-px w-8 bg-gold/45" />
            <span className="rail text-body-muted">Restricted Access</span>
          </div>

          <Image
            src="/images/logo.png"
            alt="Logo PT. METITO"
            width={132}
            height={132}
            className="mb-8 object-contain"
            priority
          />

          <h1 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-black leading-[0.94] tracking-[-0.04em] text-white">
            Control
            <br />
            <span className="text-gold">Console</span>
          </h1>

          <p className="mt-6 max-w-md text-body-text">
            Panel internal PT. METITO untuk mengelola katalog, penawaran, dan konten
            publik. Akses terbatas untuk administrator terdaftar.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-4 border-t border-hairline">
            {CAPABILITIES.map((item) => (
              <div key={item} className="border-r border-hairline py-4 last:border-r-0">
                <span className="rail block text-gold">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-md text-sm text-body-muted">
            Integrated Solutions for Water, Industry and Mining
          </p>
        </div>

        {/* Form panel */}
        <div className="mx-auto w-full max-w-md">
          <div className="relative border border-hairline bg-surface/90 p-8 backdrop-blur-sm">
            {/* Instrument corner tick */}
            <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/55" />

            <div className="mb-8 lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Logo PT. METITO"
                width={88}
                height={88}
                className="object-contain"
                priority
              />
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="rail text-gold">Auth</span>
                <span className="h-px w-6 bg-gold/45" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
                Masuk Panel Admin
              </h2>
              <p className="mt-1.5 text-sm text-body-muted">
                Gunakan kredensial administrator PT. METITO.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 border border-red-500/35 bg-red-500/10 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="rail block text-body-muted">
                  Email
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@metito.id"
                    className="w-full rounded-sm border border-hairline bg-navy-deep py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-body-muted/60 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/60 disabled:opacity-60"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="rail block text-body-muted">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-muted" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    className="w-full rounded-sm border border-hairline bg-navy-deep py-2.5 pl-10 pr-11 text-sm text-white placeholder:text-body-muted/60 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/60 disabled:opacity-60"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-body-muted transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-hairline pt-5">
              <p className="text-xs text-body-muted">
                Lupa password? Hubungi administrator sistem.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-2 border border-hairline px-4 py-3 text-sm text-body-text transition-colors hover:border-gold/45 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
