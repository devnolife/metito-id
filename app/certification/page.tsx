import { SidebarLayout } from "@/components/sidebar-layout"
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
    <SidebarLayout
      title="Sertifikasi & Standar"
      description="Berkomitmen untuk keunggulan melalui sertifikasi dan standar kualitas yang diakui secara internasional."
    >
      <div className="space-y-16">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 rounded-xl font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Unduh Sertifikat
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
            <Building className="w-4 h-4 mr-2" />
            Kebijakan Mutu
          </Button>
        </div>

        {/* Certifications Grid */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
              Sertifikasi Internasional
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Portofolio Sertifikasi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Komitmen kami terhadap kualitas ditunjukkan melalui portofolio sertifikasi internasional yang komprehensif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <Card key={cert.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
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
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{cert.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{cert.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {cert.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {cert.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Diterbitkan oleh: {cert.issuer}</p>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh Sertifikat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Accreditations */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              Akreditasi Nasional
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Akreditasi & Izin Usaha
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dipercaya oleh lembaga akreditasi nasional untuk memberikan layanan terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accreditations.map((accred, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-blue-600" />
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {accred.year}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{accred.name}</h3>
                  <p className="text-sm text-gray-600">{accred.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Standards */}
        <section>
          <div className="text-center mb-8">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium mb-4">
              Standar Industri
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Standar yang Kami Terapkan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mengikuti standar industri terkemuka untuk memastikan kualitas terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((standard, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{standard}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quality Commitment */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Komitmen Kualitas Kami</h2>
            <p className="text-lg text-blue-100 mb-8">
              Setiap sertifikasi dan standar yang kami pegang mencerminkan dedikasi kami untuk memberikan solusi pengolahan air terbaik dengan kualitas yang terjamin dan dapat dipercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                Jadwalkan Audit
              </Button>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Unduh Kebijakan Mutu
              </Button>
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
} 
