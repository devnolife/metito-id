"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type Contact = {
  id: string
  name: string
  phoneNumber: string
  email: string | null
  role: string | null
  color: string
  isActive: boolean
  sortOrder: number
}

export function WhatsAppFloat() {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/whatsapp-contacts')
        const data = await response.json()
        if (data.success) {
          setContacts(data.data)
        }
      } catch (error) {
        console.error('Error fetching WhatsApp contacts:', error)
      }
    }
    fetchContacts()
  }, [])

  if (contacts.length === 0) return null

  const formatWhatsAppNumber = (num: string) => {
    // Hanya ambil digit
    let digits = num.replace(/[^0-9+]/g, '')
    // Hilangkan plus untuk wa.me (wa.me tidak pakai +)
    if (digits.startsWith('+')) digits = digits.slice(1)
    // Jika diawali 0 -> ganti 62
    if (digits.startsWith('0')) digits = '62' + digits.slice(1)
    // Jika tidak mulai 62 dan panjang 11-13 bisa diasumsikan nomor lokal -> prepend 62
    if (!digits.startsWith('62')) {
      if (/^[1-9][0-9]{7,14}$/.test(digits)) {
        digits = '62' + digits
      }
    }
    return digits
  }

  const openWhatsApp = (c: Contact) => {
    const number = formatWhatsAppNumber(c.phoneNumber)
    const message = `Halo ${c.name}, saya tertarik dengan solusi air dari Metito. Mohon informasinya.`
    const text = encodeURIComponent(message)
    const url = `https://wa.me/${number}?text=${text}`
    const win = window.open(url, '_blank')
    // Fallback kalau popup diblokir atau gagal
    if (!win) {
      navigator.clipboard?.writeText(message).then(() => {
        alert('Tidak bisa membuka WhatsApp. Pesan sudah disalin, silakan tempel manual di aplikasi WhatsApp Anda.')
      })
    }
  }

  const openEmail = (c: Contact) => {
    if (!c.email) return

    const subjectRaw = 'Inquiry Metito Water Solutions'
    const bodyRaw = `Halo ${c.name},\n\nSaya tertarik dengan solusi air dari Metito.\n\n(Terkirim dari situs web Metito)`
    const subject = encodeURIComponent(subjectRaw)
    const body = encodeURIComponent(bodyRaw)
    const mailto = `mailto:${encodeURIComponent(c.email)}?subject=${subject}&body=${body}`
    // Gunakan anchor agar tidak tergantung preventDefault Radix
    const a = document.createElement('a')
    a.href = mailto
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    // Fallback timeout
    setTimeout(() => {
      document.body.contains(a) && document.body.removeChild(a)
    }, 100)
    // Setelah 1.2 detik tawarkan fallback copy (heuristik saja)
    setTimeout(() => {
      if (document.hasFocus()) { // Masih fokus di tab -> mungkin mail client tidak terbuka
        navigator.clipboard?.writeText(`${subjectRaw}\n\n${bodyRaw}`)
        // Hindari alert berisik; bisa gunakan confirm sederhana
        console.info('Kemungkinan mail client tidak terbuka; template sudah disalin ke clipboard.')
      }
    }, 1200)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-3">
        {contacts.map(contact => (
          <div key={contact.id} className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`w-16 h-16 rounded-full ${contact.color} hover:shadow-2xl text-white font-semibold transition-all duration-300 hover:scale-110 shadow-lg relative`}
                  size="icon"
                  aria-label={`Kontak ${contact.name}`}
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="center" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {contact.name}
                  {contact.role && <div className="text-[10px]">{contact.role}</div>}
                </div>
                <DropdownMenuItem onSelect={() => openWhatsApp(contact)} className="cursor-pointer" aria-label={`WhatsApp ${contact.name}`}>
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  WhatsApp
                </DropdownMenuItem>
                {contact.email && (
                  <DropdownMenuItem onSelect={() => openEmail(contact)} className="cursor-pointer" aria-label={`Email ${contact.name}`}>
                    <Mail className="w-4 h-4 mr-2 text-sky-600" />
                    Email
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Tooltip (hover only, optional) */}
            <div className="absolute bottom-0 right-20 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
              {contact.name}
              {contact.role && ` - ${contact.role}`}
              <div className="absolute top-1/2 left-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
