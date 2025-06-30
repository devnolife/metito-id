import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Award, CheckCircle, Download, Calendar, Building, Globe } from "lucide-react"
import Image from "next/image"

export default function CertificationPage() {
  const certifications = [
    {
      id: 1,
      name: "ISO 9001:2015",
      title: "Sistem Manajemen Mutu",
      description: "Standar internasional untuk sistem manajemen mutu, memastikan konsistensi kualitas dalam produk dan layanan kami.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Manajemen Mutu",
      image: "/placeholder.svg",
      benefits: [
        "Konsistensi kualitas produk",
        "Peningkatan berkelanjutan",
        "Kepuasan pelanggan",
        "Efisiensi proses"
      ]
    },
    {
      id: 2,
      name: "ISO 14001:2015",
      title: "Sistem Manajemen Lingkungan",
      description: "Menunjukkan komitmen kami terhadap perlindungan lingkungan dan praktik bisnis berkelanjutan.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Lingkungan",
      image: "/placeholder.svg",
      benefits: [
        "Perlindungan lingkungan",
        "Pengurangan limbah",
        "Efisiensi energi",
        "Kepatuhan regulasi"
      ]
    },
    {
      id: 3,
      name: "ISO 45001:2018",
      title: "Kesehatan & Keselamatan Kerja",
      description: "Memastikan standar tertinggi keselamatan dan kesehatan kerja untuk karyawan kami.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Kesehatan & Keselamatan",
      image: "/placeholder.svg",
      benefits: [
        "Keselamatan pekerja",
        "Pengurangan risiko",
        "Kepatuhan hukum",
        "Kesejahteraan tempat kerja"
      ]
    },
    {
      id: 4,
      name: "CE Marking",
      title: "Kesesuaian Eropa",
      description: "Mengkonfirmasi bahwa produk kami memenuhi standar keselamatan, kesehatan, dan perlindungan lingkungan UE.",
      issuer: "European Union",
      validUntil: "Berkelanjutan",
      category: "Sertifikasi Produk",
      image: "/placeholder.svg",
      benefits: [
        "Akses pasar UE",
        "Keselamatan produk",
        "Kepercayaan konsumen",
        "Kepatuhan regulasi"
      ]
    },
    {
      id: 5,
      name: "NSF Certification",
      title: "Standar Pengolahan Air",
      description: "Menyertifikasi bahwa produk pengolahan air kami memenuhi standar kesehatan dan keselamatan publik yang ketat.",
      issuer: "NSF International",
      validUntil: "2025",
      category: "Sertifikasi Produk",
      image: "/placeholder.svg",
      benefits: [
        "Perlindungan kesehatan publik",
        "Keandalan produk",
        "Kredibilitas industri",
        "Pengakuan global"
      ]
    },
    {
      id: 6,
      name: "SNI Certification",
      title: "Standar Nasional Indonesia",
      description: "Kepatuhan terhadap standar nasional Indonesia untuk solusi teknik air dan layanan.",
      issuer: "BSN (Badan Standardisasi Nasional)",
      validUntil: "2025",
      category: "Standar Nasional",
      image: "/placeholder.svg",
      benefits: [
        "Kepatuhan lokal",
        "Penerimaan pasar",
        "Jaminan kualitas",
        "Kesesuaian regulasi"
      ]
    }
  ]

  const accreditations = [
    {
      name: "KAN (Komite Akreditasi Nasional)",
      description: "Akreditasi nasional untuk laboratorium pengujian dan kalibrasi",
      year: "2020-2025"
    },
    {
      name: "LPJK (Lembaga Pengembangan Jasa Konstruksi)",
      description: "Sertifikasi pengembangan jasa konstruksi",
      year: "2019-2024"
    },
    {
      name: "SIUJK (Surat Ijin Usaha Jasa Konstruksi)",
      description: "Izin usaha jasa konstruksi untuk proyek infrastruktur air",
      year: "2018-2025"
    }
  ]

  const standards = [
    "Standar Internasional ASTM",
    "AWWA (American Water Works Association)",
    "API (American Petroleum Institute)",
    "ASME (American Society of Mechanical Engineers)",
    "IEC (International Electrotechnical Commission)",
    "JIS (Japanese Industrial Standards)"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-blue-500/20 text-blue-100 px-4 py-2 text-sm font-medium">
              Jaminan Mutu & Sertifikasi
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Sertifikasi
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Kami
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Berkomitmen untuk keunggulan melalui sertifikasi dan standar kualitas yang diakui secara internasional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Unduh Sertifikat
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Kebijakan Mutu
            </Button>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sertifikasi Internasional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami terhadap kualitas ditunjukkan melalui portofolio sertifikasi internasional yang komprehensif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <Card key={cert.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Berlaku hingga {cert.validUntil}
                    </Badge>
                  </div>
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                      {cert.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                    {cert.name}
                  </CardTitle>
                  <p className="text-lg font-semibold text-gray-700 text-center">{cert.title}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 text-center">
                    {cert.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {cert.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Building className="w-4 h-4" />
                      <span>{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Berlaku hingga {cert.validUntil}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh Sertifikat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Akreditasi Nasional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diakui oleh badan regulasi Indonesia untuk keahlian dan kepatuhan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accreditations.map((accred, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{accred.name}</h3>
                  <p className="text-gray-600 mb-4">{accred.description}</p>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {accred.year}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Compliance */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kepatuhan Standar Internasional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Produk dan layanan kami mematuhi berbagai standar dan spesifikasi internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards.map((standard, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{standard}</h3>
                  <p className="text-sm text-gray-600">Kepatuhan terverifikasi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mutu yang Dapat Anda Percaya
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Sertifikasi kami memastikan Anda menerima solusi pengolahan air berkualitas tertinggi yang memenuhi standar internasional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Hubungi Tim Mutu
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Unduh Semua Sertifikat
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
