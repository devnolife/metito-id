# Struktur Admin Reorganisasi

## Overview
Struktur admin telah direorganisasi untuk memisahkan halaman dan komponen agar lebih modular dan mudah dimaintain.

## Struktur Baru

### 📁 `/app/admin/`
Berisi halaman-halaman admin yang terpisah:

- `layout.tsx` - Layout wrapper dengan auth check dan sidebar
- `page.tsx` - Halaman login admin utama
- `dashboard/page.tsx` - Halaman dashboard
- `products/page.tsx` - Halaman manajemen produk
- `services/page.tsx` - Halaman manajemen layanan
- `gallery/page.tsx` - Halaman manajemen galeri
- `customers/page.tsx` - Halaman manajemen pelanggan
- `certifications/page.tsx` - Halaman manajemen sertifikasi
- `blog/page.tsx` - Halaman manajemen blog
- `contact/page.tsx` - Halaman manajemen kontak
- `settings/page.tsx` - Halaman pengaturan

### 📁 `/components/admin/`
Komponen admin yang terorganisir per modul:

#### `/shared/` - Komponen umum
- `admin-header.tsx` - Header admin (reusable)
- `admin-sidebar.tsx` - Sidebar navigasi dengan routing
- `admin-layout-wrapper.tsx` - Layout wrapper component
- `image-upload.tsx` - Komponen upload gambar

#### `/dashboard/` - Komponen dashboard
- `dashboard-overview.tsx` - Overview dashboard

#### `/products/` - Komponen produk
- `product-management.tsx` - Manajemen produk
- `product/` - Sub-komponen produk

#### `/services/` - Komponen layanan
- `page-management.tsx` - Manajemen layanan

#### `/gallery/` - Komponen galeri
- `page-management.tsx` - Manajemen galeri

#### `/customers/` - Komponen pelanggan
- `page-management.tsx` - Manajemen pelanggan
- `customer-form-example.tsx` - Form contoh pelanggan

#### `/certifications/` - Komponen sertifikasi
- `page-management.tsx` - Manajemen sertifikasi

#### `/blog/` - Komponen blog
- `page-management.tsx` - Manajemen blog

#### `/contact/` - Komponen kontak
- `page-management.tsx` - Manajemen kontak

#### `/settings/` - Komponen pengaturan
- `settings-management.tsx` - Manajemen pengaturan

#### `/ui/` - UI components
- Komponen UI yang diperlukan

## Routing Structure

### Routing Baru:
- `/admin` - Login page
- `/admin/dashboard` - Dashboard
- `/admin/products` - Manajemen Produk
- `/admin/services` - Manajemen Layanan
- `/admin/gallery` - Manajemen Galeri
- `/admin/customers` - Manajemen Pelanggan
- `/admin/certifications` - Manajemen Sertifikasi
- `/admin/blog` - Manajemen Blog
- `/admin/contact` - Manajemen Kontak
- `/admin/settings` - Pengaturan

## Benefits

1. **Modular Structure**: Setiap modul memiliki folder terpisah
2. **Easy Maintenance**: Lebih mudah untuk maintain halaman tertentu
3. **Better Performance**: Tidak perlu load semua komponen sekaligus
4. **Clear Separation**: Pemisahan yang jelas antara halaman dan komponen
5. **Reusable Components**: Komponen shared yang dapat digunakan ulang
6. **Better Navigation**: Routing yang lebih jelas dan SEO friendly

## Migration Notes

### Changed:
- Admin dashboard dari single-page menjadi multi-page
- Komponen dipindah ke folder masing-masing
- Sidebar menggunakan Next.js routing
- Layout menggunakan server-side auth check

### Removed:
- `admin-dashboard.tsx` (tidak diperlukan lagi)
- File `page-management.tsx` lama (diganti dengan per-modul)
- File `admin-sidebar.tsx` lama (dipindah ke shared)

## Usage Example

```tsx
// Membuat halaman admin baru
export default function NewAdminPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-blue">Judul Halaman</h1>
        <p className="text-gray-600">Deskripsi halaman</p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {/* Konten halaman */}
      </div>
    </div>
  )
}
```

## Authentication Flow

1. User mengakses `/admin` - Login page
2. Setelah login berhasil, redirect ke `/admin/dashboard`
3. Layout admin (`/admin/layout.tsx`) melakukan auth check
4. Jika tidak terauthentikasi, redirect kembali ke `/admin`
5. Sidebar navigasi menggunakan Next.js Link untuk routing

## File Structure Summary

```
app/admin/
├── layout.tsx (Auth + Sidebar Layout)
├── page.tsx (Login Page)
├── dashboard/page.tsx
├── products/page.tsx
├── services/page.tsx
├── gallery/page.tsx
├── customers/page.tsx
├── certifications/page.tsx
├── blog/page.tsx
├── contact/page.tsx
└── settings/page.tsx

components/admin/
├── shared/
│   ├── admin-header.tsx
│   ├── admin-sidebar.tsx
│   ├── admin-layout-wrapper.tsx
│   └── image-upload.tsx
├── dashboard/
│   └── dashboard-overview.tsx
├── products/
│   ├── product-management.tsx
│   └── product/
├── services/
│   └── page-management.tsx
├── gallery/
│   └── page-management.tsx
├── customers/
│   ├── page-management.tsx
│   └── customer-form-example.tsx
├── certifications/
│   └── page-management.tsx
├── blog/
│   └── page-management.tsx
├── contact/
│   └── page-management.tsx
├── settings/
│   └── settings-management.tsx
├── admin-login.tsx
└── ui/
```
