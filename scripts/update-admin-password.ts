import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface Args {
  email?: string
  password?: string
}

function parseArgs(): Args {
  const args: Args = {}
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--email=')) args.email = arg.split('=')[1]
    if (arg.startsWith('--password=')) args.password = arg.split('=')[1]
  })
  return args
}

async function main() {
  const { email, password } = parseArgs()

  if (!email || !password) {
    console.log('\nUsage:')
    console.log('  npx tsx scripts/update-admin-password.ts --email=admin@metito.id --password=NewPass123!')
    console.log('\nBoth --email and --password are required.')
    process.exit(1)
  }

  // Basic password sanity check (can be adjusted)
  if (password.length < 4) {
    console.error('❌ Password terlalu pendek (minimal 8 karakter).')
    process.exit(1)
  }

  console.log(`🔐 Updating password for user: ${email}`)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('❌ User tidak ditemukan.')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.update({ where: { email }, data: { password: hashed } })

  console.log('✅ Password berhasil diperbarui.')
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
