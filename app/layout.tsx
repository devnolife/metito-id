import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalHeader } from "@/components/conditional-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Metito Water Solution - Water & Wastewater Engineering Solutions",
  description: "Premium water and wastewater treatment solutions for industrial and municipal applications",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalHeader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
