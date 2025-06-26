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
              <div className="relative w-12 h-12 p-2 bg-white rounded-xl">
                <Image src="/images/logo.png" alt="Metito Water" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Metito Water</h3>
                <p className="text-sm text-blue-200">Water Treatment Solutions</p>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Leading provider of advanced water and wastewater treatment solutions with over 25 years of experience. We
              deliver innovative, sustainable, and cost-effective water treatment technologies worldwide.
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
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#customer" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Customer
                </Link>
              </li>
              <li>
                <Link href="#certification" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Certification
                </Link>
              </li>
            </ul>
          </div>

          {/* Equipment Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Equipment Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Membrane Systems
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Filtration Units
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Disinfection Systems
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Pumps & Motors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Monitoring Equipment
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                  Chemical Dosing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-orange mt-1 flex-shrink-0" />
                <div className="text-blue-100">
                  <p>123 Water Technology Drive</p>
                  <p>Innovation District</p>
                  <p>New York, NY 10001, USA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>info@metitowater.com</p>
                  <p>sales@metitowater.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent-orange" />
                <div className="text-blue-100">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
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
            <p className="text-blue-200 text-sm">© 2024 Metito Water. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-blue-200 hover:text-accent-orange transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
