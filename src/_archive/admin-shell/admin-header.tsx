"use client"

import { LogOut, User } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

interface AdminHeaderProps {
  title?: string
  subtitle?: string
  index?: string
  user?: AdminUser
  onLogout?: () => void
}

export function AdminHeader({
  title = "Dashboard Admin",
  subtitle = "Kelola katalog solusi teknik air Anda",
  index = "00",
  user,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex-shrink-0 border-b border-hairline bg-navy/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          {/* Section marker: mono index + hairline, same rail as the public site. */}
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rail text-gold">{index}</span>
            <span className="h-px w-8 bg-gold/45" />
            <span className="rail truncate text-body-muted">Console</span>
          </div>
          <h1 className="truncate font-display text-xl font-bold leading-tight tracking-[-0.02em] text-white lg:text-2xl">
            {title}
          </h1>
          <p className="truncate text-sm text-body-muted">{subtitle}</p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="hidden items-center gap-3 border-l border-hairline pl-4 md:flex">
            <span className="flex h-9 w-9 items-center justify-center border border-gold/35 bg-gold/10 font-mono text-sm font-semibold text-gold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-white">
                {user?.name || "Pengguna Admin"}
              </span>
              <span className="rail block truncate text-[0.5625rem] text-body-muted">
                {user?.role || "Administrator"}
              </span>
            </span>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-sm border border-hairline px-3 py-2 text-sm text-body-text transition-colors hover:border-red-500/45 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
