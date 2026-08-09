import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { generatePassword } from './lib/password'

const prisma = new PrismaClient()

/**
 * Menyiapkan akun tim sales METITO.
 *
 * Aman dijalankan berulang. Akun yang sudah ada hanya disesuaikan peran, nama,
 * dan nomor teleponnya — kata sandinya tidak pernah ditimpa supaya sandi yang
 * sedang dipakai tidak ikut hangus. Akun baru memperoleh kata sandi acak yang
 * dicetak satu kali ke layar; kata sandi tidak pernah disimpan di repositori
 * dan wajib diganti pemiliknya setelah masuk pertama kali.
 */

interface SalesMember {
  name: string
  email: string
  phone: string
}

const SALES_TEAM: SalesMember[] = [
  { name: 'Khudaivi', email: 'khudaivi@metito.id', phone: '08979380767' },
  { name: 'Musthamu', email: 'musthamu@metito.id', phone: '082322345616' },
  { name: 'Andi Agung', email: 'andiagung@metito.id', phone: '085171079687' },
  { name: 'Pasya', email: 'pasya@metito.id', phone: '089654212852' },
]

async function main() {
  const created: { email: string; password: string }[] = []
  const updated: string[] = []

  for (const member of SALES_TEAM) {
    const existing = await prisma.user.findUnique({
      where: { email: member.email },
      select: { id: true, role: true },
    })

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: member.name,
          phone: member.phone,
          role: 'SALES',
          isActive: true,
        },
      })
      updated.push(`${member.name} <${member.email}> — ${existing.role} → SALES`)
      continue
    }

    const password = generatePassword()
    await prisma.user.create({
      data: {
        name: member.name,
        email: member.email,
        phone: member.phone,
        password: await bcrypt.hash(password, 12),
        role: 'SALES',
        isActive: true,
      },
    })
    created.push({ email: member.email, password })
  }

  if (updated.length > 0) {
    console.log('\nAkun yang disesuaikan (kata sandi tidak diubah):')
    for (const line of updated) console.log(`  - ${line}`)
  }

  if (created.length > 0) {
    console.log('\nAkun baru — catat kata sandi ini sekarang, tidak ditampilkan lagi:')
    for (const account of created) {
      console.log(`  - ${account.email} : ${account.password}`)
    }
    console.log('\n  Minta setiap pemilik mengganti kata sandinya setelah masuk.')
  }

  const admins = await prisma.user.count({ where: { role: 'ADMIN', isActive: true } })
  console.log(`\nAdmin aktif tersisa: ${admins}`)
  if (admins === 0) {
    console.warn('PERINGATAN: tidak ada admin aktif. Sisakan minimal satu akun ADMIN.')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
