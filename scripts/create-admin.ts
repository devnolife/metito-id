/**
 * Script untuk membuat admin user
 * Jalankan dengan: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Data admin default
    const adminData = {
      name: 'Super Admin',
      email: 'admin@metito.com',
      password: 'admin123456', // Password akan di-hash
      role: 'ADMIN' as const,
      phone: '+62812345678',
      company: 'Metito Indonesia',
      isActive: true
    }

    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingAdmin) {
      console.log('❌ Admin user sudah ada dengan email:', adminData.email)
      console.log('User ID:', existingAdmin.id)
      console.log('Role:', existingAdmin.role)
      return
    }

    // Hash password
    const hashedPassword = await hashPassword(adminData.password)

    // Buat admin user
    const admin = await prisma.user.create({
      data: {
        ...adminData,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    console.log('✅ Admin user berhasil dibuat:')
    console.log('ID:', admin.id)
    console.log('Name:', admin.name)
    console.log('Email:', admin.email)
    console.log('Role:', admin.role)
    console.log('Active:', admin.isActive)
    console.log('Created:', admin.createdAt)
    console.log('')
    console.log('🔑 Login credentials:')
    console.log('Email:', adminData.email)
    console.log('Password:', adminData.password)
    console.log('')
    console.log('🌐 Login URL: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Jalankan script jika dipanggil langsung
if (require.main === module) {
  createAdmin()
}

export { createAdmin } 
