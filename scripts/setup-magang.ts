import { randomBytes } from 'crypto'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Membuat akun MAGANG (mahasiswa) yang hanya boleh mengisi Log Aktivitas.
 *
 * Pemakaian:
 *   npm run setup-magang -- "Nama Mahasiswa" nama@kampus.ac.id [08xxxxxxxxxx]
 *
 * Aman dijalankan berulang. Akun yang sudah ada hanya disesuaikan peran dan
 * kontaknya; kata sandinya tidak ditimpa supaya sandi yang sedang dipakai tidak
 * hangus. Kata sandi akun baru dibuat acak dan dicetak satu kali — tidak pernah
 * disimpan di repositori dan wajib diganti pemiliknya setelah masuk.
 */

function generatePassword(): string {
  return randomBytes(12).toString('base64url')
}

function usage(): never {
  console.error('Pemakaian: npm run setup-magang -- "Nama Mahasiswa" email@kampus.ac.id [telepon]')
  process.exit(1)
}

async function main() {
  const [name, email, phone] = process.argv.slice(2)

  if (!name?.trim() || !email?.trim()) usage()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(`Email tidak valid: ${email}`)
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  })

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, phone: phone ?? undefined, role: 'MAGANG', isActive: true },
    })
    console.log(`Akun disesuaikan: ${name} <${email}> — ${existing.role} → MAGANG`)
    console.log('Kata sandi tidak diubah.')
    return
  }

  const password = generatePassword()
  await prisma.user.create({
    data: {
      name,
      email,
      phone: phone ?? null,
      password: await bcrypt.hash(password, 12),
      role: 'MAGANG',
      isActive: true,
    },
  })

  console.log(`\nAkun magang dibuat: ${name} <${email}>`)
  console.log('Catat kata sandi ini sekarang, tidak ditampilkan lagi:')
  console.log(`  ${password}`)
  console.log('\nMinta pemiliknya mengganti kata sandi setelah masuk.')
  console.log('Akun ini hanya dapat membuka halaman Log Aktivitas.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
