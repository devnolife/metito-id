"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Package,
  Users,
  FileText,
  Award,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Phone,
  Cog,
  MessageCircle,
  Layout,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

interface MenuItem {
  label: string
  icon: LucideIcon
  href: string
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const MENU_GROUPS: MenuGroup[] = [
  {
    label: "Operasi",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Penawaran", icon: FileText, href: "/admin/quotations" },
      { label: "Pelanggan", icon: Users, href: "/admin/customers" },
      { label: "Kontak", icon: Phone, href: "/admin/contact" },
      { label: "WhatsApp", icon: MessageCircle, href: "/admin/whatsapp-contacts" },
    ],
  },
  {
    label: "Katalog",
    items: [
      { label: "Produk", icon: Package, href: "/admin/products" },
      { label: "Layanan", icon: Settings, href: "/admin/services" },
      { label: "Sertifikasi", icon: Award, href: "/admin/certifications" },
    ],
  },
  {
    label: "Konten",
    items: [
      { label: "Galeri", icon: ImageIcon, href: "/admin/gallery" },
      { label: "Blog", icon: FileText, href: "/admin/blog" },
      { label: "Konten Halaman", icon: Layout, href: "/admin/page-content" },
    ],
  },
  {
    label: "Sistem",
    items: [{ label: "Pengaturan", icon: Cog, href: "/admin/settings" }],
  },
]

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {
      // Logout is best-effort: the local session is cleared either way.
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminUser")
        localStorage.removeItem("authToken")
      }
      router.push("/admin/login")
    }
  }

  // A running index across every group gives the nav the deck's technical
  // numbering (01–12) instead of a flat list of coloured icons.
  let runningIndex = 0

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-hairline bg-navy-deep transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-hairline px-3">
        {!collapsed && (
          <Link href="/" className="group flex items-center gap-3 overflow-hidden">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-gold/40 bg-gold/10 font-mono text-sm font-bold text-gold transition-colors group-hover:bg-gold/20">
              M
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold tracking-[-0.01em] text-white">
                METITO
              </span>
              <span className="rail block truncate text-[0.5625rem] text-body-muted">
                Control Console
              </span>
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-hairline text-body-muted transition-colors hover:border-gold/45 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="mb-3 last:mb-0">
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-6 bg-hairline" />
            ) : (
              <p className="rail mb-1.5 px-3 text-[0.5625rem] text-body-muted/70">{group.label}</p>
            )}

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
                runningIndex += 1
                const index = String(runningIndex).padStart(2, "0")

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-active={isActive}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "admin-nav-item flex items-center gap-3 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                        isActive
                          ? "bg-gold/10 text-white"
                          : "text-body-text hover:bg-surface hover:text-white",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-gold" : "text-body-muted"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate font-medium">{item.label}</span>
                          <span
                            className={cn(
                              "rail text-[0.5625rem] transition-colors",
                              isActive ? "text-gold" : "text-body-muted/50"
                            )}
                          >
                            {index}
                          </span>
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex-shrink-0 border-t border-hairline p-2">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "Lihat situs" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-body-muted transition-colors hover:bg-surface hover:text-gold",
            collapsed && "justify-center px-0"
          )}
        >
          <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Lihat Situs</span>}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Keluar" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-body-muted transition-colors hover:bg-red-500/10 hover:text-red-300",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Keluar</span>}
        </button>
      </div>
    </aside>
  )
}
