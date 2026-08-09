import 'dotenv/config'
import { randomBytes } from 'crypto'
import { createInterface } from 'readline'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Mengatur ulang kata sandi satu akun (peran apa pun).
 *
 * Pemakaian:
 *   npm run reset-password -- nama@metito.id            → sandi acak, dicetak sekali
 *   npm run reset-password -- nama@metito.id --prompt   → ketik sandi sendiri
 *
 * Kata sandi sengaja tidak diterima sebagai argumen baris perintah: argumen
 * tersimpan di riwayat shell dan terlihat pada daftar proses, sehingga sandi
 * yang baru dibuat justru langsung bocor.
 */

const MIN_LENGTH = 8

function generatePassword(): string {
  return randomBytes(12).toString('base64url')
}

function usage(): never {
  console.error('Pemakaian:')
  console.error('  npm run reset-password -- email@metito.id            (sandi acak)')
  console.error('  npm run reset-password -- email@metito.id --prompt   (ketik sendiri)')
  process.exit(1)
}

/** Membaca sandi dari input tanpa menggemakannya ke layar. */
function askPassword(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const output = process.stdout as NodeJS.WriteStream & { muted?: boolean }

  return new Promise((resolve) => {
    const originalWrite = output.write.bind(output)
    rl.question(question, (answer) => {
      output.write = originalWrite
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
    // Setelah pertanyaan tercetak, sembunyikan ketikan pengguna.
    output.write = ((chunk: string, ...rest: unknown[]) =>
      chunk.includes(question)
        ? originalWrite(chunk, ...(rest as []))
        : true) as typeof output.write
  })
}

async function main() {
  const args = process.argv.slice(2)
  const email = args.find((a) => !a.startsWith('--'))
  const usePrompt = args.includes('--prompt')

  if (!email) usage()

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, role: true },
  })

  if (!user) {
    console.error(`Akun tidak ditemukan: ${email}`)
    process.exit(1)
  }

  let password: string
  if (usePrompt) {
    password = await askPassword(`Kata sandi baru untuk ${email}: `)
    if (password.length < MIN_LENGTH) {
      console.error(`Kata sandi minimal ${MIN_LENGTH} karakter.`)
      process.exit(1)
    }
  } else {
    password = generatePassword()
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 12) },
  })

  console.log(`\nKata sandi diperbarui: ${user.name} <${email}> — peran ${user.role}`)
  if (!usePrompt) {
    console.log('Catat sekarang, tidak ditampilkan lagi:')
    console.log(`  ${password}`)
  }
  console.log('\nMinta pemiliknya mengganti kata sandi setelah masuk.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
