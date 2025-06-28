/**
 * Setup script untuk admin system
 * Jalankan dengan: npm run setup-admin
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function setupAdmin() {
  console.log('🚀 Setting up admin system...\n')

  try {
    // 1. Create admin user
    console.log('1. Creating admin user...')

    const adminData = {
      name: 'Super Admin',
      email: 'admin@metito.com',
      password: 'admin123456',
      role: 'ADMIN' as const,
      phone: '+62812345678',
      company: 'Metito Indonesia',
      isActive: true
    }

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingAdmin) {
      console.log('   ✅ Admin user already exists')
      console.log('   📧 Email:', existingAdmin.email)
      console.log('   👤 Role:', existingAdmin.role)
    } else {
      // Create admin
      const hashedPassword = await hashPassword(adminData.password)
      const admin = await prisma.user.create({
        data: {
          ...adminData,
          password: hashedPassword
        }
      })
      console.log('   ✅ Admin user created successfully')
      console.log('   📧 Email:', admin.email)
      console.log('   👤 Role:', admin.role)
    }

    // 2. Test database connection
    console.log('\n2. Testing database connection...')
    const userCount = await prisma.user.count()
    console.log('   ✅ Database connected')
    console.log('   👥 Total users:', userCount)

    // 3. Show admin credentials
    console.log('\n3. Admin Login Credentials:')
    console.log('   📧 Email:', adminData.email)
    console.log('   🔑 Password:', adminData.password)
    console.log('   🌐 Login URL: http://localhost:3000/admin')

    // 4. Test instructions
    console.log('\n4. Testing Instructions:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Open http://localhost:3000/admin in your browser')
    console.log('   3. Login with the credentials above')
    console.log('   4. You should be redirected to the admin dashboard')

    // 5. API Testing
    console.log('\n5. API Testing Commands:')
    console.log('\n   Test login API:')
    console.log('   curl -X POST http://localhost:3000/api/auth/login \\')
    console.log('     -H "Content-Type: application/json" \\')
    console.log('     -d \'{"email":"admin@metito.com","password":"admin123456"}\'')

    console.log('\n   Test protected API (should fail without token):')
    console.log('   curl -X POST http://localhost:3000/api/products')

    console.log('\n   Test protected API (with admin token):')
    console.log('   # First get token from login response, then:')
    console.log('   curl -X GET http://localhost:3000/api/products \\')
    console.log('     -H "Authorization: Bearer YOUR_TOKEN_HERE"')

    console.log('\n✅ Admin system setup completed!')
    console.log('\n🎉 You can now access the admin panel!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  setupAdmin().catch((error) => {
    console.error('Setup failed:', error)
    process.exit(1)
  })
}

export { setupAdmin } 
