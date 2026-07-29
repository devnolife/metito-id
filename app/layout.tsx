import type React from "react"
import type { Metadata } from "next"
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalHeader } from "@/components/conditional-header"
import { COMPANY, CONTACT } from "@/lib/company-profile"

/** Industrial grotesque for headlines — holds up at poster sizes. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
})

/** Body copy: clean but warmer and less ubiquitous than the usual grotesques. */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

/** Technical rails: section indices, specs, units, readouts. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.websiteUrl),
  applicationName: COMPANY.brandName,
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
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.brandName} - ${COMPANY.tagline}`,
    description: COMPANY.description,
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <ConditionalHeader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
