import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { COMPANY, CONTACT, PRODUCT_GROUPS } from "@/lib/company-profile"

export function Footer() {
  return (
    <footer className="bg-[var(--navy-deep)] text-white border-t border-[var(--hairline)]">
      <div className="profile-rule" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt={COMPANY.brandName}
                width={48}
                height={48}
                className="bg-white rounded-xl p-1"
              />
              <div>
                <h3 className="font-display text-xl font-bold text-white">{COMPANY.brandName}</h3>
                <p className="text-sm text-[var(--gold)]">{COMPANY.abbreviationOf}</p>
              </div>
            </div>
            <p className="text-[var(--body-muted)] leading-relaxed">{COMPANY.description}</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--gold)] text-white hover:text-[var(--navy)] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--gold)] text-white hover:text-[var(--navy)] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--gold)] text-white hover:text-[var(--navy)] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--gold)] text-white hover:text-[var(--navy)] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-white">Tautan Cepat</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/products", label: "Produk" },
                { href: "/services", label: "Layanan" },
                { href: "/gallery", label: "Galeri" },
                { href: "/customer", label: "Pelanggan" },
                { href: "/certification", label: "Sertifikasi" },
                { href: "/contact", label: "Kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--body-muted)] hover:text-[var(--gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Categories */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-white">Kategori Produk</h4>
            <ul className="space-y-3">
              {PRODUCT_GROUPS.map((group) => (
                <li key={group.slug}>
                  <Link
                    href={`/products?category=${group.slug}`}
                    className="text-[var(--body-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    {group.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-white">Informasi Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[var(--gold)] mt-1 flex-shrink-0" />
                <div className="text-[var(--body-text)]">
                  <p>{CONTACT.address.line1}</p>
                  <p>{CONTACT.address.line2}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[var(--gold)] mt-1 flex-shrink-0" />
                <div className="text-[var(--body-text)]">
                  {CONTACT.phones.map((phone) => (
                    <p key={phone}>
                      <a href={`tel:${phone.replace(/-/g, "")}`} className="hover:text-[var(--gold)] transition-colors">
                        {phone}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                <div className="text-[var(--body-text)]">
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-[var(--gold)] transition-colors">
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                <div className="text-[var(--body-text)]">
                  <a
                    href={CONTACT.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--gold)] transition-colors"
                  >
                    {CONTACT.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--body-muted)] text-sm">
              © {new Date().getFullYear()} {COMPANY.legalName}. Semua hak dilindungi.
            </p>
            <p className="text-[var(--gold)] text-sm font-semibold">{COMPANY.slogan}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
