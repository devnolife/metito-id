import type React from "react"
import type { Metadata } from "next"
import { Inter, Hanken_Grotesk } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalHeader } from "@/components/conditional-header"
import { COMPANY, CONTACT } from "@/lib/company-profile"

const inter = Inter({ subsets: ["latin"] })
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.websiteUrl),
  title: {
    default: `${COMPANY.brandName} - ${COMPANY.tagline}`,
    template: `%s | ${COMPANY.brandName}`,
  },
  description: COMPANY.description,
  keywords: [
    "water treatment",
    "chemical supply",
    "engineering services",
    "equipment supply",
    "spare parts",
    "mining support services",
    "WTP",
    "WWTP",
    "STP",
    "reverse osmosis",
    "METITO",
  ],
  openGraph: {
    title: `${COMPANY.brandName} - ${COMPANY.tagline}`,
    description: COMPANY.description,
    url: CONTACT.websiteUrl,
    siteName: COMPANY.brandName,
    locale: "id_ID",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${hankenGrotesk.variable} ${inter.className}`} suppressHydrationWarning>
        <ConditionalHeader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
