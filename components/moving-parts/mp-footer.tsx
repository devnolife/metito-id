import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { MPLabel } from "./mp-label"

// Moving Parts footer — inverted carbon surface, monospace section labels, hairline dividers,
// electric-ink hover accents. Used ONLY on the home route so other pages keep the legacy footer.
const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Layanan", href: "/services" },
  { label: "Galeri", href: "/gallery" },
  { label: "Pelanggan", href: "/customer" },
  { label: "Sertifikasi", href: "/certification" },
]

const categories = [
  "Sistem Membran",
  "Unit Filtrasi",
  "Sistem Disinfeksi",
  "Pompa & Motor",
  "Peralatan Monitoring",
  "Dosis Kimia",
]

const socials = [Facebook, Instagram, Twitter, Linkedin]

export function MPFooter() {
  return (
    <footer className="bg-carbon text-pure">
      <div className="mx-auto max-w-page px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-medium border border-pure/20 font-druk text-[22px] leading-none">
                M
              </span>
              <span className="leading-tight">
                <span className="block font-unica77 font-bold text-[18px]">Metito Water Solutions</span>
                <span className="block font-whyte uppercase text-caption tracking-[0.04em] text-fog">
                  Innovation for water
                </span>
              </span>
            </div>
            <p className="max-w-[40ch] font-unica77 text-body-sm text-fog">
              Penyedia terdepan solusi pengolahan air dan air limbah canggih di seluruh Indonesia —
              inovatif, berkelanjutan, dan hemat biaya.
            </p>
            <div className="flex gap-3">
              {socials.map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-pill border border-pure/20 text-pure transition-colors hover:border-electric-ink hover:bg-electric-ink"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-6">
            <MPLabel tone="fog">Tautan Cepat</MPLabel>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-unica77 text-body-sm text-pure/80 transition-colors hover:text-electric-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <MPLabel tone="fog">Kategori Peralatan</MPLabel>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href="/products"
                    className="font-unica77 text-body-sm text-pure/80 transition-colors hover:text-electric-ink"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <MPLabel tone="fog">Informasi Kontak</MPLabel>
            <div className="space-y-4 font-unica77 text-body-sm text-pure/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-electric-ink" />
                <span>
                  <span className="block">Jl. Barombong</span>
                  <span className="block">Kab Gowa, Indonesia</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-electric-ink" />
                <span>+62 812-1760-3950</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-electric-ink" />
                <span>info@metito.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 flex-shrink-0 text-electric-ink" />
                <span>Sen - Jum: 08:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pure/10">
        <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="font-whyte text-caption uppercase tracking-[0.04em] text-fog">
            © 2025 Metito Water Solutions
          </p>
          <div className="flex gap-6">
            {["Kebijakan Privasi", "Ketentuan Layanan", "Peta Situs"].map((t) => (
              <Link
                key={t}
                href="#"
                className="font-whyte text-caption uppercase tracking-[0.04em] text-fog transition-colors hover:text-pure"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
