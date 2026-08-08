import type { MetadataRoute } from "next"
import { COMPANY } from "@/lib/company-profile"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.brandName} - ${COMPANY.abbreviationOf}`,
    short_name: COMPANY.shortName,
    description: COMPANY.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#012966",
    lang: "id",
    icons: [
      { src: "/images/metito-mark.png", sizes: "any", type: "image/png" },
      { src: "/images/brand/logo-mark-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/brand/logo-mark-512.png", sizes: "512x512", type: "image/png" },
      { src: "/images/brand/logo-mark-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
