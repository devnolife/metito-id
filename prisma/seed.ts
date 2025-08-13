import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed process...')

  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.cartItem.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.galleryItem.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.service.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.blogTag.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  console.log('👤 Creating users...')
  const hashedPassword = await hash('password123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Metito',
      email: 'admin@metito.id',
      password: hashedPassword,
      phone: '+62-21-1234-5678',
      company: 'Metito Indonesia',
      role: 'ADMIN',
      avatar: '/images/users/admin-avatar.jpg',
    }
  })

  const customers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi@petrochemical.co.id',
        password: hashedPassword,
        phone: '+62-21-2345-6789',
        company: 'PT Petrochemical Indonesia',
        role: 'CUSTOMER',
        avatar: '/images/users/customer-1.jpg',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sari Indrawati',
        email: 'sari@manufaktur.com',
        password: hashedPassword,
        phone: '+62-21-3456-7890',
        company: 'PT Manufaktur Jaya',
        role: 'CUSTOMER',
        avatar: '/images/users/customer-2.jpg',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Ahmad Rahman',
        email: 'ahmad@waterworks.id',
        password: hashedPassword,
        phone: '+62-21-4567-8901',
        company: 'CV Water Works',
        role: 'CUSTOMER',
        avatar: '/images/users/customer-3.jpg',
      }
    })
  ])

  // Create Categories
  console.log('📂 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Reverse Osmosis Systems',
        slug: 'reverse-osmosis-systems',
        description: 'Advanced reverse osmosis water treatment systems for industrial and municipal use',
        icon: 'water-drop',
        color: '#0ea5e9',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Filtration Equipment',
        slug: 'filtration-equipment',
        description: 'High-performance filtration systems and equipment',
        icon: 'filter',
        color: '#10b981',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Chemical Treatment',
        slug: 'chemical-treatment',
        description: 'Chemical dosing and treatment systems',
        icon: 'flask',
        color: '#f59e0b',
      }
    }),
    prisma.category.create({
      data: {
        name: 'Membrane Technology',
        slug: 'membrane-technology',
        description: 'Advanced membrane filtration technology',
        icon: 'layers',
        color: '#8b5cf6',
      }
    })
  ])

  // Create Products
  console.log('🏭 Creating products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Industrial RO System 1000 GPD',
        slug: 'industrial-ro-system-1000-gpd',
        description: 'High-capacity reverse osmosis system designed for industrial applications with advanced pre-treatment and monitoring systems.',
        shortDesc: 'Industrial RO system for high-volume water treatment',
        price: 15000000,
        capacity: '1000 GPD (3,785 L/day)',
        efficiency: '99.5% salt rejection',
        location: 'Suitable for factory installation',
        application: 'Industrial',
        specs: {
          "dimensions": "2000x1200x1800 mm",
          "power": "5.5 kW",
          "inlet_pressure": "2-6 bar",
          "recovery_rate": "75%"
        },
        features: [
          'Automatic flush system',
          'Digital monitoring panel',
          'Pre-treatment filtration',
          'High-pressure pump',
          'Stainless steel frame'
        ],
        warranty: '2 years full warranty',
        delivery: '4-6 weeks',
        images: [
          '/images/products/ro-system-1000-1.jpg',
          '/images/products/ro-system-1000-2.jpg',
          '/images/products/ro-system-1000-3.jpg'
        ],
        documents: [
          '/documents/products/ro-system-1000-spec.pdf',
          '/documents/products/ro-system-1000-manual.pdf'
        ],
        categoryId: categories[0].id,
        isFeatured: true,
        metaTitle: 'Industrial RO System 1000 GPD - Metito Water Solution',
        metaDescription: 'High-performance industrial reverse osmosis system with 1000 GPD capacity, perfect for manufacturing facilities.',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Municipal Water Treatment Plant',
        slug: 'municipal-water-treatment-plant',
        description: 'Complete municipal water treatment solution with multi-stage filtration, disinfection, and distribution systems.',
        shortDesc: 'Complete municipal water treatment solution',
        price: 250000000,
        capacity: '10,000 m³/day',
        efficiency: '99.9% contaminant removal',
        location: 'Municipal installation',
        application: 'Municipal',
        specs: {
          "capacity": "10000 m³/day",
          "treatment_stages": "5",
          "automation": "Full PLC control",
          "monitoring": "SCADA system"
        },
        features: [
          'Multi-stage filtration',
          'UV disinfection',
          'Chemical dosing system',
          'SCADA monitoring',
          'Automated backwashing'
        ],
        warranty: '5 years warranty',
        delivery: '12-16 weeks',
        images: [
          '/images/products/municipal-plant-1.jpg',
          '/images/products/municipal-plant-2.jpg',
          '/images/products/municipal-plant-3.jpg'
        ],
        documents: [
          '/documents/products/municipal-plant-spec.pdf',
          '/documents/products/municipal-plant-proposal.pdf'
        ],
        categoryId: categories[1].id,
        isFeatured: true,
        metaTitle: 'Municipal Water Treatment Plant - Metito Water Solution',
        metaDescription: 'Complete municipal water treatment plant with 10,000 m³/day capacity for city water supply.',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Ultrafiltration Membrane System',
        slug: 'ultrafiltration-membrane-system',
        description: 'Advanced ultrafiltration system using hollow fiber membranes for superior water quality.',
        shortDesc: 'Advanced UF membrane filtration system',
        price: 8500000,
        capacity: '500 m³/day',
        efficiency: '99.99% bacteria removal',
        location: 'Indoor/outdoor installation',
        application: 'Industrial',
        specs: {
          "membrane_type": "Hollow fiber",
          "pore_size": "0.01 micron",
          "operating_pressure": "1-3 bar",
          "cleaning_system": "CIP automated"
        },
        features: [
          'Hollow fiber membranes',
          'Automated CIP system',
          'Low energy consumption',
          'Compact design',
          'Remote monitoring'
        ],
        warranty: '3 years warranty',
        delivery: '6-8 weeks',
        images: [
          '/images/products/uf-system-1.jpg',
          '/images/products/uf-system-2.jpg'
        ],
        documents: [
          '/documents/products/uf-system-spec.pdf'
        ],
        categoryId: categories[3].id,
        isFeatured: false,
        metaTitle: 'Ultrafiltration Membrane System - Metito Water Solution',
        metaDescription: 'High-performance ultrafiltration system with hollow fiber membranes for industrial water treatment.',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Chemical Dosing System',
        slug: 'chemical-dosing-system',
        description: 'Precision chemical dosing system for water treatment applications with multiple dosing points.',
        shortDesc: 'Precision chemical dosing for water treatment',
        price: 3500000,
        capacity: 'Variable dosing rate',
        efficiency: '±1% dosing accuracy',
        location: 'Process room installation',
        application: 'Industrial',
        specs: {
          "dosing_pumps": "3 pumps",
          "flow_rate": "0.1-100 L/h",
          "control": "PID controller",
          "materials": "PP/PVDF"
        },
        features: [
          'Multiple dosing points',
          'PID control system',
          'Chemical-resistant materials',
          'Flow monitoring',
          'Alarm system'
        ],
        warranty: '2 years warranty',
        delivery: '3-4 weeks',
        images: [
          '/images/products/dosing-system-1.jpg',
          '/images/products/dosing-system-2.jpg'
        ],
        documents: [
          '/documents/products/dosing-system-spec.pdf'
        ],
        categoryId: categories[2].id,
        isFeatured: false,
        metaTitle: 'Chemical Dosing System - Metito Water Solution',
        metaDescription: 'Precision chemical dosing system for accurate water treatment chemical injection.',
      }
    })
  ])

  // Create Blog Tags
  console.log('🏷️ Creating blog tags...')
  const blogTags = await Promise.all([
    prisma.blogTag.create({
      data: {
        name: 'Water Treatment',
        slug: 'water-treatment',
        color: '#0ea5e9'
      }
    }),
    prisma.blogTag.create({
      data: {
        name: 'Industry News',
        slug: 'industry-news',
        color: '#10b981'
      }
    }),
    prisma.blogTag.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        color: '#8b5cf6'
      }
    }),
    prisma.blogTag.create({
      data: {
        name: 'Sustainability',
        slug: 'sustainability',
        color: '#059669'
      }
    })
  ])

  // Create Blog Posts
  console.log('📝 Creating blog posts...')
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'The Future of Water Treatment Technology',
        slug: 'future-of-water-treatment-technology',
        content: `
        <p>Water treatment technology is rapidly evolving to meet the growing demands of industrial and municipal applications. In this comprehensive guide, we explore the latest innovations that are shaping the future of water treatment.</p>
        
        <h2>Advanced Membrane Technologies</h2>
        <p>Modern membrane technologies, including reverse osmosis and ultrafiltration, are becoming more efficient and cost-effective. These systems offer superior contaminant removal while reducing energy consumption.</p>
        
        <h2>Smart Water Management</h2>
        <p>IoT-enabled water treatment systems provide real-time monitoring and predictive maintenance capabilities, ensuring optimal performance and reduced downtime.</p>
        
        <h2>Sustainable Solutions</h2>
        <p>The industry is moving towards more sustainable practices, including energy recovery systems and environmentally friendly treatment chemicals.</p>
        `,
        excerpt: 'Discover the latest innovations in water treatment technology and how they are revolutionizing industrial and municipal water processing.',
        coverImage: '/images/blog/water-treatment-future.jpg',
        authorName: 'Dr. Ahmad Hidayat',
        authorEmail: 'ahmad@metito.id',
        isPublished: true,
        isFeatured: true,
        metaTitle: 'The Future of Water Treatment Technology - Metito Blog',
        metaDescription: 'Explore cutting-edge water treatment technologies and innovations shaping the future of industrial and municipal water processing.',
        tags: {
          connect: [
            { id: blogTags[0].id },
            { id: blogTags[2].id }
          ]
        }
      }
    }),
    prisma.blogPost.create({
      data: {
        title: 'Industrial Water Treatment Best Practices',
        slug: 'industrial-water-treatment-best-practices',
        content: `
        <p>Implementing effective water treatment practices is crucial for industrial operations. This article outlines key strategies for optimizing your industrial water treatment systems.</p>
        
        <h2>Pre-treatment Considerations</h2>
        <p>Proper pre-treatment is essential for protecting downstream equipment and ensuring consistent water quality. This includes sediment filtration, chemical adjustment, and biological treatment where necessary.</p>
        
        <h2>System Monitoring and Maintenance</h2>
        <p>Regular monitoring of key parameters such as pH, conductivity, and turbidity helps maintain optimal system performance and prevents costly downtime.</p>
        
        <h2>Energy Efficiency</h2>
        <p>Modern water treatment systems incorporate energy recovery technologies and optimized operating procedures to minimize energy consumption and operating costs.</p>
        `,
        excerpt: 'Learn essential best practices for industrial water treatment to optimize efficiency, reduce costs, and ensure consistent water quality.',
        coverImage: '/images/blog/industrial-best-practices.jpg',
        authorName: 'Eng. Siti Nurhaliza',
        authorEmail: 'siti@metito.id',
        isPublished: true,
        isFeatured: false,
        metaTitle: 'Industrial Water Treatment Best Practices - Metito Blog',
        metaDescription: 'Comprehensive guide to industrial water treatment best practices for optimal efficiency and water quality.',
        tags: {
          connect: [
            { id: blogTags[0].id },
            { id: blogTags[1].id }
          ]
        }
      }
    })
  ])

  // Create Services
  console.log('🛠️ Creating services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Water Treatment Consultation',
        slug: 'water-treatment-consultation',
        description: 'Expert consultation services for water treatment system design, optimization, and troubleshooting.',
        shortDesc: 'Expert water treatment consultation and design services',
        icon: 'consulting',
        features: [
          'System design and engineering',
          'Water quality analysis',
          'Process optimization',
          'Regulatory compliance',
          'Cost-benefit analysis'
        ],
        pricing: {
          "basic": {
            "price": 2500000,
            "duration": "1 day",
            "includes": ["Site visit", "Basic analysis", "Recommendations report"]
          },
          "comprehensive": {
            "price": 7500000,
            "duration": "1 week",
            "includes": ["Detailed analysis", "System design", "Implementation plan", "Training"]
          }
        },
        isFeatured: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'System Installation & Commissioning',
        slug: 'system-installation-commissioning',
        description: 'Professional installation and commissioning services for all water engineering solutions.',
        shortDesc: 'Professional installation and commissioning services',
        icon: 'installation',
        features: [
          'Equipment installation',
          'Piping and electrical work',
          'System commissioning',
          'Performance testing',
          'Operator training'
        ],
        pricing: {
          "standard": {
            "price": 5000000,
            "duration": "1-2 weeks",
            "includes": ["Installation", "Basic commissioning", "Documentation"]
          },
          "premium": {
            "price": 12000000,
            "duration": "2-3 weeks",
            "includes": ["Full installation", "Comprehensive testing", "Training", "Warranty"]
          }
        },
        isFeatured: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'Maintenance & Support',
        slug: 'maintenance-support',
        description: 'Comprehensive maintenance and technical support services to keep your systems running optimally.',
        shortDesc: 'Ongoing maintenance and technical support',
        icon: 'maintenance',
        features: [
          'Preventive maintenance',
          'Emergency repairs',
          '24/7 technical support',
          'Spare parts supply',
          'Remote monitoring'
        ],
        pricing: {
          "basic": {
            "price": 1500000,
            "duration": "Monthly",
            "includes": ["Basic maintenance", "Phone support", "Quarterly visits"]
          },
          "premium": {
            "price": 3500000,
            "duration": "Monthly",
            "includes": ["Full maintenance", "24/7 support", "Monthly visits", "Remote monitoring"]
          }
        },
        isFeatured: false
      }
    })
  ])

  // Create Testimonials
  console.log('💬 Creating testimonials...')
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Budi Santoso',
        company: 'PT Petrochemical Indonesia',
        position: 'Plant Manager',
        content: 'Metito has provided excellent water treatment solutions for our petrochemical facility. Their industrial RO system has been running flawlessly for over 2 years with minimal maintenance. The water quality consistently meets our strict requirements.',
        rating: 5,
        avatar: '/images/testimonials/budi-santoso.jpg',
        userId: customers[0].id,
        isApproved: true,
        isFeatured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Sari Indrawati',
        company: 'PT Manufaktur Jaya',
        position: 'Operations Director',
        content: 'The ultrafiltration system from Metito has significantly improved our manufacturing process water quality. Their team provided excellent support during installation and commissioning. Highly recommended for industrial applications.',
        rating: 5,
        avatar: '/images/testimonials/sari-indrawati.jpg',
        userId: customers[1].id,
        isApproved: true,
        isFeatured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Ahmad Rahman',
        company: 'CV Water Works',
        position: 'Technical Director',
        content: 'Working with Metito has been a great experience. Their chemical dosing system is precise and reliable. The technical support team is very responsive and knowledgeable.',
        rating: 4,
        avatar: '/images/testimonials/ahmad-rahman.jpg',
        userId: customers[2].id,
        isApproved: true,
        isFeatured: false
      }
    })
  ])

  // Create Certifications
  console.log('🏆 Creating certifications...')
  const certifications = await Promise.all([
    prisma.certification.create({
      data: {
        name: 'ISO 9001:2015 Quality Management System',
        description: 'International standard for quality management systems',
        issuer: 'Bureau Veritas',
        certificate: '/certificates/iso-9001-2015.pdf',
        issuedAt: new Date('2023-01-15'),
        expiresAt: new Date('2026-01-15')
      }
    }),
    prisma.certification.create({
      data: {
        name: 'ISO 14001:2015 Environmental Management',
        description: 'Environmental management systems standard',
        issuer: 'SGS Indonesia',
        certificate: '/certificates/iso-14001-2015.pdf',
        issuedAt: new Date('2023-03-20'),
        expiresAt: new Date('2026-03-20')
      }
    }),
    prisma.certification.create({
      data: {
        name: 'OHSAS 18001 Occupational Health & Safety',
        description: 'Occupational health and safety management systems',
        issuer: 'TUV Rheinland',
        certificate: '/certificates/ohsas-18001.pdf',
        issuedAt: new Date('2023-06-10'),
        expiresAt: new Date('2026-06-10')
      }
    })
  ])

  // Create Gallery Items
  console.log('📸 Creating gallery items...')
  const galleryItems = await Promise.all([
    prisma.galleryItem.create({
      data: {
        title: 'Industrial RO Plant Installation - Jakarta',
        description: 'Successful installation of 1000 GPD industrial reverse osmosis system at petrochemical facility in Jakarta',
        image: '/images/gallery/ro-plant-jakarta.jpg',
        category: 'Industrial Projects',
        projectType: 'INDUSTRIAL',
        location: 'Makassar, Indonesia',
        completedAt: new Date('2023-08-15'),
        isFeatured: true
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Municipal Water Treatment Plant - Bandung',
        description: 'Complete municipal water treatment facility serving 50,000 residents in Bandung',
        image: '/images/gallery/municipal-plant-bandung.jpg',
        category: 'Municipal Projects',
        projectType: 'MUNICIPAL',
        location: 'Bandung, Indonesia',
        completedAt: new Date('2023-05-20'),
        isFeatured: true
      }
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Ultrafiltration System - Manufacturing Plant',
        description: 'UF membrane system installation for food processing facility',
        image: '/images/gallery/uf-system-manufacturing.jpg',
        category: 'Industrial Projects',
        projectType: 'INDUSTRIAL',
        location: 'Surabaya, Indonesia',
        completedAt: new Date('2023-09-10'),
        isFeatured: false
      }
    })
  ])

  // Create Newsletter Subscriptions
  console.log('📧 Creating newsletter subscriptions...')
  const newsletters = await Promise.all([
    prisma.newsletter.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        isActive: true,
        isConfirmed: true
      }
    }),
    prisma.newsletter.create({
      data: {
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        isActive: true,
        isConfirmed: true
      }
    }),
    prisma.newsletter.create({
      data: {
        email: 'engineer@watertech.co.id',
        name: 'Water Tech Engineer',
        isActive: true,
        isConfirmed: false
      }
    })
  ])

  // Create Inquiries
  console.log('📨 Creating inquiries...')
  const inquiries = await Promise.all([
    prisma.inquiry.create({
      data: {
        name: 'PT Chemical Industries',
        email: 'procurement@chemical.co.id',
        phone: '+62-21-5555-1234',
        company: 'PT Chemical Industries',
        subject: 'Inquiry for Industrial RO System',
        message: 'We are interested in your 1000 GPD industrial RO system for our new facility. Please provide detailed specifications and pricing.',
        productId: products[0].id,
        userId: null,
        status: 'PENDING'
      }
    }),
    prisma.inquiry.create({
      data: {
        name: 'Municipal Water Authority',
        email: 'info@waterauth.gov.id',
        phone: '+62-21-6666-5678',
        company: 'Municipal Water Authority',
        subject: 'Municipal Water Treatment Plant Proposal',
        message: 'We need a proposal for a municipal water treatment plant with 15,000 m³/day capacity. Please include timeline and budget estimates.',
        productId: products[1].id,
        userId: null,
        status: 'RESPONDED'
      }
    }),
    prisma.inquiry.create({
      data: {
        name: 'Ahmad Rahman',
        email: 'ahmad@waterworks.id',
        phone: '+62-21-4567-8901',
        company: 'CV Water Works',
        subject: 'Technical Support Request',
        message: 'Need technical assistance with chemical dosing system calibration. System is not maintaining consistent dosing rates.',
        productId: products[3].id,
        userId: customers[2].id,
        status: 'RESPONDED'
      }
    })
  ])

  // Create Cart Items
  console.log('🛒 Creating cart items...')
  const cartItems = await Promise.all([
    prisma.cartItem.create({
      data: {
        userId: customers[0].id,
        productId: products[0].id,
        quantity: 1
      }
    }),
    prisma.cartItem.create({
      data: {
        userId: customers[1].id,
        productId: products[2].id,
        quantity: 2
      }
    }),
    prisma.cartItem.create({
      data: {
        userId: customers[1].id,
        productId: products[3].id,
        quantity: 1
      }
    })
  ])

  console.log('✅ Seed data created successfully!')
  console.log(`📊 Summary:`)
  console.log(`- Users: ${1 + customers.length}`)
  console.log(`- Categories: ${categories.length}`)
  console.log(`- Products: ${products.length}`)
  console.log(`- Blog Tags: ${blogTags.length}`)
  console.log(`- Blog Posts: ${blogPosts.length}`)
  console.log(`- Services: ${services.length}`)
  console.log(`- Testimonials: ${testimonials.length}`)
  console.log(`- Certifications: ${certifications.length}`)
  console.log(`- Gallery Items: ${galleryItems.length}`)
  console.log(`- Newsletter Subscriptions: ${newsletters.length}`)
  console.log(`- Inquiries: ${inquiries.length}`)
  console.log(`- Cart Items: ${cartItems.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
