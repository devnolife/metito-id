"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { MPButtonLink } from "./mp-button"

// Moving Parts top navigation — quiet white bar, geometric wordmark, monospace links, a single
// electric-ink primary CTA. No blur, no heavy border. Rendered only on the home route.
const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Produk", href: "/products" },
  { name: "Layanan", href: "/services" },
  { name: "Galeri", href: "/gallery" },
  { name: "Pelanggan", href: "/customer" },
  { name: "Sertifikasi", href: "/certification" },
  { name: "Blog", href: "/blog" },
  { name: "Kontak", href: "/contact" },
]

export function MPHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-50 bg-pure">
      <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-6 py-4">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-medium bg-onyx font-druk text-[18px] leading-none text-pure">
            M
          </span>
          <span className="font-unica77 text-[18px] font-bold tracking-tight text-onyx">Metito</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "font-whyte text-caption uppercase tracking-[0.04em] transition-colors",
                isActive(item.href) ? "text-electric-ink" : "text-onyx hover:text-electric-ink"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/admin"
            title="Login Admin"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-onyx text-onyx transition-colors hover:bg-onyx hover:text-pure"
          >
            <User className="h-5 w-5" />
          </Link>
          <MPButtonLink href="/contact" className="py-2.5 text-[15px]">
            Penawaran <span aria-hidden>→</span>
          </MPButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-medium border border-onyx text-onyx xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-smoke bg-pure xl:hidden">
          <nav className="mx-auto flex max-w-page flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-medium px-3 py-3 font-whyte text-caption uppercase tracking-[0.04em] transition-colors",
                  isActive(item.href) ? "bg-electric-ink text-pure" : "text-onyx hover:bg-chalk"
                )}
              >
                {item.name}
              </Link>
            ))}
            <MPButtonLink href="/contact" className="mt-3 w-full" onClick={() => setOpen(false)}>
              Penawaran Gratis <span aria-hidden>→</span>
            </MPButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
