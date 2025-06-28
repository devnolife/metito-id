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
      title: "Quality Management System",
      description: "International standard for quality management systems, ensuring consistent quality in our products and services.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Quality Management",
      image: "/placeholder.svg",
      benefits: [
        "Consistent product quality",
        "Continuous improvement",
        "Customer satisfaction",
        "Process efficiency"
      ]
    },
    {
      id: 2,
      name: "ISO 14001:2015",
      title: "Environmental Management System",
      description: "Demonstrates our commitment to environmental protection and sustainable business practices.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Environmental",
      image: "/placeholder.svg",
      benefits: [
        "Environmental protection",
        "Waste reduction",
        "Energy efficiency",
        "Regulatory compliance"
      ]
    },
    {
      id: 3,
      name: "ISO 45001:2018",
      title: "Occupational Health & Safety",
      description: "Ensures the highest standards of workplace safety and health management for our employees.",
      issuer: "International Organization for Standardization",
      validUntil: "2025",
      category: "Health & Safety",
      image: "/placeholder.svg",
      benefits: [
        "Worker safety",
        "Risk reduction",
        "Legal compliance",
        "Workplace wellbeing"
      ]
    },
    {
      id: 4,
      name: "CE Marking",
      title: "European Conformity",
      description: "Confirms that our products meet EU safety, health, and environmental protection standards.",
      issuer: "European Union",
      validUntil: "Ongoing",
      category: "Product Certification",
      image: "/placeholder.svg",
      benefits: [
        "EU market access",
        "Product safety",
        "Consumer confidence",
        "Regulatory compliance"
      ]
    },
    {
      id: 5,
      name: "NSF Certification",
      title: "Water Treatment Standards",
      description: "Certifies that our water treatment products meet strict public health and safety standards.",
      issuer: "NSF International",
      validUntil: "2025",
      category: "Product Certification",
      image: "/placeholder.svg",
      benefits: [
        "Public health protection",
        "Product reliability",
        "Industry credibility",
        "Global recognition"
      ]
    },
    {
      id: 6,
      name: "SNI Certification",
      title: "Indonesian National Standard",
      description: "Compliance with Indonesian national standards for water treatment equipment and services.",
      issuer: "BSN (Badan Standardisasi Nasional)",
      validUntil: "2025",
      category: "National Standard",
      image: "/placeholder.svg",
      benefits: [
        "Local compliance",
        "Market acceptance",
        "Quality assurance",
        "Regulatory alignment"
      ]
    }
  ]

  const accreditations = [
    {
      name: "KAN (Komite Akreditasi Nasional)",
      description: "National accreditation for testing and calibration laboratories",
      year: "2020-2025"
    },
    {
      name: "LPJK (Lembaga Pengembangan Jasa Konstruksi)",
      description: "Construction services development certification",
      year: "2019-2024"
    },
    {
      name: "SIUJK (Surat Ijin Usaha Jasa Konstruksi)",
      description: "Construction business license for water infrastructure projects",
      year: "2018-2025"
    }
  ]

  const standards = [
    "ASTM International Standards",
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
              Quality Assurance & Certifications
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Our
            <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Certifications
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Committed to excellence through internationally recognized certifications and quality standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Download Certificates
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Quality Policy
            </Button>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              International Certifications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to quality is demonstrated through our comprehensive portfolio of international certifications.
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
                      Valid until {cert.validUntil}
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
                      <span>Valid until {cert.validUntil}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
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
              National Accreditations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognized by Indonesian regulatory bodies for our expertise and compliance.
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
              International Standards Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our products and services comply with various international standards and specifications.
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
                  <p className="text-sm text-gray-600">Compliance verified</p>
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
            Quality You Can Trust
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our certifications ensure that you receive the highest quality water treatment solutions that meet international standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
              Contact Quality Team
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold">
              Download All Certificates
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 
