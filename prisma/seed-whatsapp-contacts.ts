import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding WhatsApp contacts...')

  // Clear existing contacts
  await prisma.whatsAppContact.deleteMany()

  // Create initial contacts
  const contacts = await Promise.all([
    prisma.whatsAppContact.create({
      data: {
        name: 'Khudaivi',
        phoneNumber: '08979380767',
        email: 'Khudaivi@metito.id',
        role: 'Sales Manager',
        color: 'bg-emerald-600',
        isActive: true,
        sortOrder: 0,
      },
    }),
    prisma.whatsAppContact.create({
      data: {
        name: 'Musthamu',
        phoneNumber: '082322345616',
        email: 'Musthamu@metito.id',
        role: 'Sales Consultant',
        color: 'bg-sky-600',
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.whatsAppContact.create({
      data: {
        name: 'Sales 1',
        phoneNumber: '081217603950',
        email: 'Sales@metito.id',
        role: 'Sales Representative',
        color: 'bg-indigo-600',
        isActive: true,
        sortOrder: 2,
      },
    }),
  ])

  console.log(`✅ Created ${contacts.length} WhatsApp contacts`)

  contacts.forEach(contact => {
    console.log(`   - ${contact.name} (${contact.phoneNumber})`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding WhatsApp contacts:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
