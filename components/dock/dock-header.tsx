"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DockButtonLink } from "./dock-button"

// Dock — top navigation. White bar, single hairline bottom border, pill nav actions. Calm and
// quiet; the page background does the warmth. Rendered only on the home route.
const navItems = [
  { name: "Produk", href: "/products" },
  { name: "Layanan", href: "/services" },
  { name: "Galeri", href: "/gallery" },
  { name: "Pelanggan", href: "/customer" },
  { name: "Sertifikasi", href: "/certification" },
  { name: "Blog", href: "/blog" },
]

export function DockHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="Metito Water Solutions" width={36} height={36} className="rounded-dock-badge" />
          <span className="font-roobert text-[17px] font-semibold tracking-[-0.01em] text-ink-charcoal">Metito</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "rounded-dock-button px-4 py-2 font-roobert text-[15px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-surface-ivory text-ink-charcoal"
                  : "text-ink-charcoal/80 hover:bg-canvas-cream hover:text-ink-charcoal"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/admin"
            className="rounded-dock-button px-4 py-2 font-roobert text-[15px] font-medium text-ink-charcoal/80 transition-colors hover:text-ink-charcoal"
          >
            Masuk
          </Link>
          <DockButtonLink href="/contact" className="py-2.5">
            Minta Penawaran
          </DockButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-dock-button border border-hairline text-ink-charcoal lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hairline bg-white lg:hidden">
          <nav className="mx-auto flex max-w-page flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-dock-card px-4 py-3 font-roobert text-[15px] font-medium transition-colors",
                  isActive(item.href) ? "bg-surface-ivory text-ink-charcoal" : "text-ink-charcoal/80 hover:bg-canvas-cream"
                )}
              >
                {item.name}
              </Link>
            ))}
            <DockButtonLink href="/contact" className="mt-3 w-full" onClick={() => setOpen(false)}>
              Minta Penawaran
            </DockButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
