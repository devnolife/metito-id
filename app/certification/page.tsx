import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Award, Shield, CheckCircle, Download, Calendar, Building, Globe } from "lucide-react"
import Image from "next/image"

export default function CertificationPage() {
  const certifications = [
    {
      id: 1,
      name: "ISO 9001:2015",
      category: "Quality Management",
      description: "Sistem manajemen mutu untuk memastikan konsistensi dalam memberikan produk dan layanan berkualitas tinggi",
      issuer: "Bureau Veritas",
      validUntil: "2026-12-31",
      image: "/certificates/iso-9001.jpg",
      downloadUrl: "/certificates/iso-9001.pdf"
    },
    {
      id: 2,
      name: "ISO 14001:2015",
      category: "Environmental Management",
      description: "Sistem manajemen lingkungan untuk memastikan operasi yang ramah lingkungan dan berkelanjutan",
      issuer: "TUV Rheinland",
      validUntil: "2026-08-15",
      image: "/certificates/iso-14001.jpg",
      downloadUrl: "/certificates/iso-14001.pdf"
    },
    {
      id: 3,
      name: "ISO 45001:2018",
      category: "Occupational Health & Safety",
      description: "Sistem manajemen keselamatan dan kesehatan kerja untuk melindungi karyawan dan stakeholder",
      issuer: "SGS Indonesia",
      validUntil: "2027-03-20",
      image: "/certificates/iso-45001.jpg",
      downloadUrl: "/certificates/iso-45001.pdf"
    },
    {
      id: 4,
      name: "SNI 19-6728.1-2002",
      category: "Water Quality Standards",
      description: "Standar Nasional Indonesia untuk sistem penyediaan air minum - bagian sistem distribusi",
      issuer: "BSN (Badan Standardisasi Nasional)",
      validUntil: "2025-12-31",
      image: "/certificates/sni-water.jpg",
      downloadUrl: "/certificates/sni-water.pdf"
    },
    {
      id: 5,
      name: "ASME U-Stamp",
      category: "Pressure Vessel",
      description: "Sertifikasi untuk desain dan fabrikasi bejana tekan sesuai standar ASME Boiler and Pressure Vessel Code",
      issuer: "American Society of Mechanical Engineers",
      validUntil: "2026-06-30",
      image: "/certificates/asme-u.jpg",
      downloadUrl: "/certificates/asme-u.pdf"
    },
    {
      id: 6,
      name: "CE Marking",
      category: "European Conformity",
      description: "Tanda kesesuaian Eropa untuk produk yang memenuhi persyaratan kesehatan, keselamatan, dan perlindungan lingkungan",
      issuer: "Notified Body EU",
      validUntil: "2028-01-15",
      image: "/certificates/ce-marking.jpg",
      downloadUrl: "/certificates/ce-marking.pdf"
    }
  ]

  const awards = [
    {
      title: "Water Technology Company of the Year",
      year: "2023",
      organization: "Indonesia Water Association",
      description: "Penghargaan untuk inovasi terdepan dalam teknologi pengolahan air"
    },
    {
      title: "Excellence in Environmental Solutions",
      year: "2022",
      organization: "Ministry of Environment",
      description: "Pengakuan atas kontribusi dalam solusi ramah lingkungan"
    },
    {
      title: "Best Water Treatment Project",
      year: "2023",
      organization: "Asia Water Forum",
      description: "Proyek terbaik dalam kategori pengolahan air industri"
    },
    {
      title: "Innovation Award",
      year: "2022",
      organization: "Indonesian Engineering Association",
      description: "Penghargaan inovasi untuk teknologi desalinasi air laut"
    }
  ]

  const categories = [
    { name: "Quality Management", count: 1, icon: <Award className="w-5 h-5" /> },
    { name: "Environmental Management", count: 1, icon: <Globe className="w-5 h-5" /> },
    { name: "Occupational Health & Safety", count: 1, icon: <Shield className="w-5 h-5" /> },
    { name: "Water Quality Standards", count: 1, icon: <CheckCircle className="w-5 h-5" /> },
    { name: "Pressure Vessel", count: 1, icon: <Building className="w-5 h-5" /> },
    { name: "European Conformity", count: 1, icon: <CheckCircle className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Sertifikasi & Penghargaan
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Standar Kualitas
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Internasional
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Komitmen kami terhadap kualitas dan keunggulan terbukti melalui berbagai sertifikasi internasional dan penghargaan industri.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Download Sertifikat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Lihat Penghargaan
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Kategori Sertifikasi
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beragam Standar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sertifikasi yang mencakup berbagai aspek operasional untuk memastikan kualitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 text-white">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.count} Sertifikat
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Sertifikasi Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sertifikat Resmi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Koleksi lengkap sertifikasi yang membuktikan komitmen kami terhadap standar kualitas tertinggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/95 text-blue-700 font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                      {cert.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{cert.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Penerbit: {cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Berlaku hingga: {new Date(cert.validUntil).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Sertifikat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium mb-4">
              Penghargaan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pengakuan Industri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai penghargaan yang membuktikan keunggulan dan inovasi kami di industri pengolahan air
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white flex-shrink-0">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{award.title}</h3>
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {award.year}
                        </Badge>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{award.organization}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{award.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Percayakan Proyek Anda pada Ahlinya
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Dengan berbagai sertifikasi dan penghargaan, kami siap memberikan solusi pengolahan air terbaik untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Konsultasi Gratis
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download Company Profile
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
