import Link from "next/link"
import Image from "next/image"

// Dock — footer. White surface, single hairline top border, multi-column link grid, calm slate
// link text. Used only on the home route.
const columns = [
  {
    title: "Produk",
    links: ["Sistem Membran", "Unit Filtrasi", "Disinfeksi", "Monitoring"],
    href: "/products",
  },
  {
    title: "Layanan",
    links: ["Konsultasi", "Instalasi", "Pemeliharaan", "Dukungan 24/7"],
    href: "/services",
  },
  {
    title: "Perusahaan",
    links: ["Tentang Kami", "Sertifikasi", "Galeri", "Pelanggan"],
    href: "/certification",
  },
  {
    title: "Sumber Daya",
    links: ["Blog", "Studi Kasus", "Katalog", "FAQ"],
    href: "/blog",
  },
]

export function DockFooter() {
  return (
    <footer className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-page px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="Metito Water Solutions" width={36} height={36} className="rounded-dock-badge" />
              <span className="font-roobert text-[17px] font-semibold tracking-[-0.01em] text-ink-charcoal">Metito</span>
            </Link>
            <p className="mt-4 max-w-[36ch] font-roobert text-dock-body text-slate-gray">
              Solusi pengolahan air dan air limbah yang inovatif, berkelanjutan, dan hemat biaya di
              seluruh Indonesia.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-roobert text-dock-caption font-semibold uppercase tracking-[0.077em] text-ink-charcoal">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href={col.href}
                      className="font-roobert text-[14px] text-slate-gray transition-colors hover:text-electric-cobalt"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-3 px-6 py-6 md:flex-row">
          <p className="font-roobert text-[13px] text-steel-gray">© 2025 Metito Water Solutions</p>
          <div className="flex gap-6">
            {["Kebijakan Privasi", "Ketentuan Layanan", "Peta Situs"].map((t) => (
              <Link key={t} href="#" className="font-roobert text-[13px] text-steel-gray transition-colors hover:text-ink-charcoal">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
