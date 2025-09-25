import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	// Ganti data di bawah sesuai kebutuhan
	const name = 'Admin';
	const email = 'admin@example.com';
	const password = 'password123';

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 12);

	// Cek apakah email sudah ada
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		console.log('Admin dengan email ini sudah ada.');
		return;
	}

	// Buat admin baru
	const admin = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role: 'ADMIN',
		},
	});
	console.log('Admin berhasil dibuat:', admin);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
