# Database Seeding Guide

## Overview
File `seed.ts` berisi data sampel lengkap untuk semua tabel dalam database Metito Water Solution.

## Cara Menjalankan Seed

### 1. Persiapan Database
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev --name="init"
```

### 2. Jalankan Seed Data
```bash
# Menggunakan npm script yang sudah tersedia
npm run db:seed

# Atau menggunakan tsx langsung
npx tsx prisma/seed.ts
```

## Data Yang Akan Dibuat

### 👤 **Users (4 users)**
- **Admin**: admin@metito.id (password: password123)
- **Customer 1**: budi@petrochemical.co.id
- **Customer 2**: sari@manufaktur.com  
- **Customer 3**: ahmad@waterworks.id

### 📂 **Categories (4 categories)**
- Reverse Osmosis Systems
- Filtration Equipment
- Chemical Treatment
- Membrane Technology

### 🏭 **Products (4 products)**
- Industrial RO System 1000 GPD
- Municipal Water Treatment Plant
- Ultrafiltration Membrane System
- Chemical Dosing System

### 📝 **Blog Content**
- 4 Blog Tags (Water Treatment, Industry News, Technology, Sustainability)
- 2 Blog Posts dengan konten lengkap

### 🛠️ **Services (3 services)**
- Water Treatment Consultation
- System Installation & Commissioning
- Maintenance & Support

### 💬 **Testimonials (3 testimonials)**
- Customer reviews dari berbagai industri

### 🏆 **Certifications (3 certifications)**
- ISO 9001:2015 Quality Management System
- ISO 14001:2015 Environmental Management
- OHSAS 18001 Occupational Health & Safety

### 📸 **Gallery Items (3 items)**
- Project showcases dari berbagai lokasi

### 📧 **Newsletter & Inquiries**
- Sample newsletter subscriptions
- Customer inquiries dan support requests

### 🛒 **Cart Items**
- Sample shopping cart data

## Struktur Folder Images

```
public/
├── images/
│   ├── products/           # Gambar produk
│   ├── blog/              # Cover images blog
│   ├── users/             # Avatar pengguna
│   ├── testimonials/      # Foto customer testimonials
│   └── gallery/           # Foto project gallery
├── documents/
│   └── products/          # Dokumentasi produk (PDF)
└── certificates/          # Sertifikat perusahaan (PDF)
```

## Catatan Penting

⚠️ **Warning**: Menjalankan seed akan menghapus semua data yang sudah ada di database!

✅ **Tips**: 
- Pastikan environment variable `DATABASE_URL` sudah dikonfigurasi dengan benar
- File seed menggunakan bcryptjs untuk hash password
- Semua password default adalah: `password123`
- Data dibuat dengan relasi yang konsisten antar tabel

## Troubleshooting

### Error: "PrismaClientKnownRequestError"
```bash
# Reset database dan jalankan ulang migrasi
npx prisma migrate reset --force
npx prisma generate
npm run db:seed
```

### Error: "tsx command not found"
```bash
# Install tsx sebagai dev dependency
npm install -D tsx
```

## Development

Untuk menambahkan data seed baru:
1. Edit file `prisma/seed.ts`
2. Jalankan `npm run db:seed` untuk test
3. Pastikan relasi antar tabel tetap konsisten

---

*Happy coding! 🚀* 
