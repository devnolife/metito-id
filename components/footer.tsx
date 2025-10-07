import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="Metito Water Solutions"
                width={48}
                height={48}
                className="bg-white rounded-xl p-1"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Metito Water Solutions</h3>
                <p className="text-sm text-blue-200">Solusi Teknik Pengolahan Air</p>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Penyedia terdepan solusi pengolahan air dan air limbah canggih. Kami
              menyediakan teknologi pengolahan air yang inovatif, berkelanjutan, dan hemat biaya di seluruh Indonesia.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="#customer" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Pelanggan
                </Link>
              </li>
              <li>
                <Link href="#certification" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Sertifikasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Equipment Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Kategori Peralatan</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Sistem Membran
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Unit Filtrasi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Sistem Disinfeksi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Pompa & Motor
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Peralatan Monitoring
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Dosis Kimia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Informasi Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-orange mt-1 flex-shrink-0" />
                <div className="text-blue-100">
                  <p>Jl. Barombong</p>
                  <p>Kab Gowa, Indonesia 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>+62 21 1234 5678</p>
                  <p>+62 21 9876 5432</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>info@metito.id</p>
                  <p>sales@metito.id</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>Senin - Jumat: 08:00 - 18:00</p>
                  <p>Sabtu: 09:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200 text-sm">© 2025 Metito Water Solutions. Semua hak dilindungi.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Ketentuan Layanan
              </Link>
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Peta Situs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
