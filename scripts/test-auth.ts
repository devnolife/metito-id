/**
 * Script untuk testing authentication system
 * Jalankan dengan: npx tsx scripts/test-auth.ts
 */

import { signJWT, verifyJWT, hashPassword, verifyPassword } from '../lib/auth'

async function testAuth() {
  console.log('🧪 Testing Authentication System\n')

  // Test 1: Password hashing dan verification
  console.log('1. Testing Password Hashing...')
  const plainPassword = 'admin123456'
  const hashedPassword = await hashPassword(plainPassword)
  const isPasswordValid = await verifyPassword(plainPassword, hashedPassword)
  const isWrongPasswordValid = await verifyPassword('wrongpassword', hashedPassword)

  console.log('   Plain Password:', plainPassword)
  console.log('   Hashed Password:', hashedPassword)
  console.log('   Valid Password Check:', isPasswordValid ? '✅' : '❌')
  console.log('   Wrong Password Check:', isWrongPasswordValid ? '❌' : '✅')
  console.log('')

  // Test 2: JWT Token generation dan verification
  console.log('2. Testing JWT Tokens...')

  const adminPayload = {
    userId: 'user_123',
    email: 'admin@metito.com',
    role: 'ADMIN'
  }

  const customerPayload = {
    userId: 'user_456',
    email: 'customer@example.com',
    role: 'CUSTOMER'
  }

  const adminToken = signJWT(adminPayload)
  const customerToken = signJWT(customerPayload)

  console.log('   Admin Token:', adminToken.substring(0, 50) + '...')
  console.log('   Customer Token:', customerToken.substring(0, 50) + '...')
  console.log('')

  // Test 3: Token verification
  console.log('3. Testing Token Verification...')

  const verifiedAdminToken = verifyJWT(adminToken)
  const verifiedCustomerToken = verifyJWT(customerToken)
  const verifiedInvalidToken = verifyJWT('invalid.token.here')

  console.log('   Admin Token Verified:', verifiedAdminToken ? '✅' : '❌')
  if (verifiedAdminToken) {
    console.log('     User ID:', verifiedAdminToken.userId)
    console.log('     Email:', verifiedAdminToken.email)
    console.log('     Role:', verifiedAdminToken.role)
  }

  console.log('   Customer Token Verified:', verifiedCustomerToken ? '✅' : '❌')
  if (verifiedCustomerToken) {
    console.log('     User ID:', verifiedCustomerToken.userId)
    console.log('     Email:', verifiedCustomerToken.email)
    console.log('     Role:', verifiedCustomerToken.role)
  }

  console.log('   Invalid Token Verified:', verifiedInvalidToken ? '❌' : '✅')
  console.log('')

  // Test 4: Environment variables check
  console.log('4. Environment Variables Check...')
  console.log('   JWT_SECRET exists:', process.env.JWT_SECRET ? '✅' : '❌')
  console.log('   DATABASE_URL exists:', process.env.DATABASE_URL ? '✅' : '❌')
  console.log('')

  // Test 5: API Testing suggestions
  console.log('5. API Testing Suggestions:')
  console.log('')
  console.log('   Test Login API:')
  console.log('   curl -X POST http://localhost:3000/api/auth/login \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"email":"admin@metito.com","password":"admin123456"}\'')
  console.log('')

  console.log('   Test Protected API (without token):')
  console.log('   curl -X POST http://localhost:3000/api/products')
  console.log('')

  console.log('   Test Protected API (with admin token):')
  console.log('   curl -X POST http://localhost:3000/api/products \\')
  console.log('     -H "Authorization: Bearer <ADMIN_TOKEN>" \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"name":"Test Product","price":100}\'')
  console.log('')

  console.log('✅ Authentication system test completed!')
}

// Jalankan script jika dipanggil langsung
if (require.main === module) {
  testAuth().catch(console.error)
}

export { testAuth } 
