"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

export function ConditionalHeader() {
  const pathname = usePathname()

  // Sembunyikan header pada panel admin dan pada halaman penawaran publik:
  // /q/[token] adalah dokumen yang dicetak, bukan halaman situs.
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/q/')) {
    return null
  }

  return <Header />
}
