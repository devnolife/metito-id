import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Space_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/* Rail teknis konsol admin: indeks bagian, spesifikasi, satuan. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_TITLE = "METITO – PT Multi Enviro Tirta Teknologi";
const SITE_DESCRIPTION =
  "Solusi terintegrasi untuk Water Treatment, Chemical Supply, Engineering Services, Equipment, Spare Parts, dan Mining Support Services. Integrated Solutions for Water, Industry and Mining.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.metito.id"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/metito-logo-full.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/metito-logo-full.png"],
  },
  icons: {
    icon: "/images/metito-mark.png",
    apple: "/images/metito-mark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#012966",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${spaceMono.variable} ${jetbrainsMono.variable}`}
    >
      {/**
       * Ekstensi peramban gemar menyuntikkan atribut ke <body> sebelum React
       * sempat hidrasi — ColorZilla menambahkan `cz-shortcut-listen`, Grammarly
       * menambahkan `data-gr-ext-installed`. HTML dari server tidak memilikinya,
       * sehingga React melaporkan hydration mismatch yang tidak berasal dari
       * kode ini dan tidak bisa diperbaiki dari sini.
       *
       * Dibiarkan, error palsu itu memenuhi overlay dev dan menutupi error yang
       * sungguhan. `suppressHydrationWarning` hanya berlaku SATU tingkat, yaitu
       * atribut <body> itu sendiri; ketidakcocokan di dalam isi halaman tetap
       * dilaporkan seperti biasa.
       */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
