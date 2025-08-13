"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, User } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

interface AdminHeaderProps {
  title?: string
  user?: AdminUser
  onLogout?: () => void
}

export function AdminHeader({ title = "Dashboard Admin", user, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
          <p className="text-gray-600">Kelola katalog solusi teknik air Anda</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Pengguna Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'Administrator'}</p>
            </div>
          </div>

          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
