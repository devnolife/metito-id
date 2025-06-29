import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSettings() {
  console.log('🌱 Seeding settings...')

  const defaultSettings = [
    {
      key: 'show_prices',
      value: 'true',
      type: 'boolean',
      category: 'display',
      label: 'Show Product Prices',
      description: 'Display product prices on the website and product pages'
    },
    {
      key: 'show_prices_landing',
      value: 'true',
      type: 'boolean',
      category: 'display',
      label: 'Show Prices on Landing Page',
      description: 'Display product prices specifically on the landing page featured products section'
    },
    {
      key: 'contact_email',
      value: 'info@metito-water.com',
      type: 'string',
      category: 'contact',
      label: 'Contact Email',
      description: 'Main contact email address for customer inquiries'
    },
    {
      key: 'contact_phone',
      value: '+1-555-0123',
      type: 'string',
      category: 'contact',
      label: 'Contact Phone',
      description: 'Main contact phone number for customer support'
    },
    {
      key: 'company_address',
      value: '123 Water Treatment St, Industrial Zone',
      type: 'string',
      category: 'contact',
      label: 'Company Address',
      description: 'Main company address for correspondence'
    },
    {
      key: 'whatsapp_number',
      value: '6281234567890',
      type: 'string',
      category: 'contact',
      label: 'WhatsApp Number',
      description: 'WhatsApp number for customer support (without + prefix)'
    },
    {
      key: 'site_maintenance',
      value: 'false',
      type: 'boolean',
      category: 'general',
      label: 'Maintenance Mode',
      description: 'Enable maintenance mode to temporarily disable the website'
    },
    {
      key: 'enable_cart',
      value: 'true',
      type: 'boolean',
      category: 'features',
      label: 'Enable Shopping Cart',
      description: 'Allow customers to add products to cart and make purchases'
    },
    {
      key: 'enable_inquiries',
      value: 'true',
      type: 'boolean',
      category: 'features',
      label: 'Enable Product Inquiries',
      description: 'Allow customers to send inquiries about products'
    },
    {
      key: 'site_title',
      value: 'Metito Water - Industrial Water Treatment Solutions',
      type: 'string',
      category: 'seo',
      label: 'Site Title',
      description: 'Main title for the website (used in browser tab and SEO)'
    },
    {
      key: 'site_description',
      value: 'Leading provider of industrial and municipal water treatment solutions with over 25 years of experience.',
      type: 'string',
      category: 'seo',
      label: 'Site Description',
      description: 'Main description for the website (used for SEO meta description)'
    }
  ]

  for (const setting of defaultSettings) {
    try {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {
          // Only update description and label, keep existing values
          description: setting.description,
          label: setting.label,
          category: setting.category,
          type: setting.type
        },
        create: setting
      })
      console.log(`✅ Setting '${setting.key}' created/updated`)
    } catch (error) {
      console.error(`❌ Error creating setting '${setting.key}':`, error)
    }
  }

  console.log('✨ Settings seeding completed!')
}

async function main() {
  try {
    await seedSettings()
  } catch (error) {
    console.error('Error seeding settings:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { seedSettings } 
