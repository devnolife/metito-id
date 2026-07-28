import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { MapPin, Phone, Mail, Send, MessageCircle, Users, Headphones, Globe } from "lucide-react"
import { COMPANY, CONTACT, toWhatsAppNumber } from "@/lib/company-profile"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telepon",
      details: [...CONTACT.phones],
      subtitle: "Hubungi atau WhatsApp kami"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: [CONTACT.email],
      subtitle: "Respon dalam 24 jam"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Alamat",
      details: [CONTACT.address.line1, CONTACT.address.line2],
      subtitle: "Indonesia"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Website",
      details: [CONTACT.website],
      subtitle: COMPANY.slogan
    }
  ]

  const teams = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Penawaran & Penjualan",
      description: "Konsultasi produk, permintaan penawaran, dan informasi harga",
      contact: CONTACT.email,
      phone: CONTACT.phones[0]
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Dukungan Teknis",
      description: "Engineering, instalasi, commissioning, dan troubleshooting sistem",
      contact: CONTACT.email,
      phone: CONTACT.phones[1]
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Informasi Umum",
      description: "Informasi perusahaan, kemitraan, dan pertanyaan umum",
      contact: CONTACT.email,
      phone: CONTACT.phones[0]
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--navy)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--navy)] text-white py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/landing-pages/image3.png')] bg-cover bg-center" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[var(--lime)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--navy)]" />
        <Reveal className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block rounded-full bg-[var(--lime)]/15 text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 mb-5">
            Hubungi Kami
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
            Mari Berbicara{" "}
            <span className="text-[var(--lime-bright)]">Tentang Proyek Anda</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tim kami siap membantu kebutuhan chemical supply, engineering, equipment, dan spare parts Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              <a href={`https://wa.me/${toWhatsAppNumber(CONTACT.phones[0])}`} target="_blank" rel="noopener noreferrer">
                Konsultasi Gratis
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-[var(--surface)] hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <a href={`tel:${CONTACT.phones[0].replace(/-/g, "")}`}>
                <Phone className="w-4 h-4 mr-2" />
                {CONTACT.phones[0]}
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 px-4 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
              Informasi Kontak
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.1]">
              Cara Menghubungi Kami
            </h2>
            <p className="mt-5 text-lg text-[var(--body-muted)] leading-relaxed">
              Berbagai cara untuk terhubung dengan tim ahli kami
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Reveal key={index} delay={index % 4}>
                <Card className="group h-full text-center rounded-[1.25rem] bg-[var(--surface)] border border-[var(--hairline)] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 rounded-2xl mb-6 transition-colors duration-300 group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)]">
                      {info.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[var(--gold)] mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-[var(--body-text)] font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--body-muted)]">{info.subtitle}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Teams Section */}
      <section className="py-24 px-4 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Reveal direction="left">
              <div className="mb-8">
                <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
                  Kirim Pesan
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-4">
                  Formulir Kontak
                </h2>
                <p className="text-lg text-[var(--body-muted)]">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam
                </p>
              </div>

              <Card className="rounded-[1.25rem] border border-[var(--hairline)] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)]">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          className="border-[var(--hairline)] bg-[var(--surface-2)] text-white placeholder:text-[var(--body-muted)] rounded-xl focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          className="border-[var(--hairline)] bg-[var(--surface-2)] text-white placeholder:text-[var(--body-muted)] rounded-xl focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Telepon *
                        </label>
                        <Input
                          placeholder="+62 xxx xxxx xxxx"
                          className="border-[var(--hairline)] bg-[var(--surface-2)] text-white placeholder:text-[var(--body-muted)] rounded-xl focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Perusahaan
                        </label>
                        <Input
                          placeholder="Nama perusahaan"
                          className="border-[var(--hairline)] bg-[var(--surface-2)] text-white placeholder:text-[var(--body-muted)] rounded-xl focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Topik Konsultasi *
                      </label>
                      <Select>
                        <SelectTrigger className="border-[var(--hairline)] bg-[var(--surface-2)] text-white rounded-xl">
                          <SelectValue placeholder="Pilih topik konsultasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chemical">Chemical Supply</SelectItem>
                          <SelectItem value="engineering">Engineering Services</SelectItem>
                          <SelectItem value="equipment">Equipment Supply</SelectItem>
                          <SelectItem value="spare-parts">Spare Parts Supply</SelectItem>
                          <SelectItem value="maintenance">Maintenance &amp; Troubleshooting</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Pesan *
                      </label>
                      <Textarea
                        placeholder="Jelaskan kebutuhan Anda secara detail..."
                        className="border-[var(--hairline)] bg-[var(--surface-2)] text-white placeholder:text-[var(--body-muted)] rounded-xl focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent min-h-[120px]"
                      />
                    </div>

                    <Button className="w-full bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-[var(--navy)] rounded-full py-6 font-semibold">
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Reveal>

            {/* Teams */}
            <Reveal direction="right">
              <div className="mb-8">
                <span className="inline-block rounded-full bg-[var(--lime)]/20 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-5">
                  Tim Ahli
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-4">
                  Hubungi Tim Spesialis
                </h2>
                <p className="text-lg text-[var(--body-muted)]">
                  Terhubung langsung dengan tim spesialis sesuai kebutuhan Anda
                </p>
              </div>

              <div className="space-y-6">
                {teams.map((team, index) => (
                  <Card key={index} className="group rounded-[1.25rem] bg-[var(--surface)] border border-[var(--hairline)] shadow-[0_24px_60px_-28px_rgba(11,28,48,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-24px_rgba(11,28,48,0.28)]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 rounded-2xl flex-shrink-0 transition-colors duration-300 group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)]">
                          {team.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-lg text-[var(--gold)] mb-2">{team.title}</h3>
                          <p className="text-[var(--body-muted)] mb-3">{team.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-[var(--gold)]" />
                              <span className="text-[var(--body-text)] font-medium">{team.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[var(--gold)]" />
                              <span className="text-[var(--body-text)] font-medium">{team.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-pages/image4.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/92 to-[var(--navy)]/70" />
        <Reveal className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block text-[var(--lime)] text-xs font-bold uppercase tracking-[0.18em] mb-5">
            Mulai Sekarang
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6">
            Butuh Konsultasi Segera?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/75 max-w-2xl mx-auto leading-relaxed">
            Tim kami siap memberikan konsultasi dan solusi terbaik untuk kebutuhan air, industri, dan pertambangan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--navy)] font-bold px-8 py-6 rounded-full shadow-xl shadow-black/25 hover:scale-[1.03] transition-all">
              <a href={`tel:${CONTACT.phones[0].replace(/-/g, "")}`}>
                <Phone className="w-5 h-5 mr-2" />
                {CONTACT.phones[0]}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-[var(--surface)] hover:text-[var(--navy)] font-semibold px-8 py-6 rounded-full transition-all">
              <a href={`https://wa.me/${toWhatsAppNumber(CONTACT.phones[1])}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat WhatsApp
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
} 
