# Panduan Pengaturan Tampilan Harga

## Fitur: Kontrol Tampilan Harga Global

Sekarang Anda dapat mengontrol apakah harga produk ditampilkan atau tidak di **SEMUA** halaman melalui satu setting di Admin Settings.

## Lokasi Pengaturan

Buka: **Admin Dashboard → Settings** (`/admin/settings`)

## Pengaturan yang Tersedia

### Tampilkan Harga Produk (`show_prices`)
- **Lokasi:** Semua halaman (`/`, `/products`, dll)
- **Pengaruh:** Mengontrol tampilan harga di semua section yang menampilkan produk
- **Default:** `true` (harga ditampilkan)

## Cara Menggunakan

1. **Login ke Admin Dashboard**
   - Buka `/admin/login`
   - Login dengan credentials admin

2. **Buka Halaman Settings**
   - Navigasi ke `/admin/settings`
   - Cari card "Pengaturan Tampilan Produk"

3. **Toggle Setting**
   - **ON (Hijau):** Harga akan ditampilkan
   - **OFF (Abu-abu):** Harga akan diganti dengan "Hubungi untuk Harga"

4. **Simpan Otomatis**
   - Setiap perubahan toggle akan langsung disimpan ke database
   - Anda akan melihat notifikasi "Berhasil" setelah menyimpan

## Perilaku Aplikasi

### Ketika Setting ON (Default)

```text
Landing Page (/)        → Menampilkan harga produk
Halaman Products        → Menampilkan harga produk
Semua halaman produk    → Menampilkan harga produk
```

### Ketika Setting OFF

```text
Landing Page (/)        → "Hubungi untuk Harga"
Halaman Products        → "Hubungi untuk Harga"
Semua halaman produk    → "Hubungi untuk Harga"
```

## Kasus Penggunaan

### Skenario 1: Tampilkan Semua Harga (Default)

**Setting:** ON

Berguna untuk transparansi penuh dan memudahkan customer membandingkan harga.

### Skenario 2: Sembunyikan Semua Harga untuk Negosiasi

**Setting:** OFF

Berguna jika Anda ingin semua harga dinegosiasikan dan mendorong customer untuk menghubungi sales team.

## Technical Details

### Database

Settings disimpan di tabel `settings` dengan struktur:

```text
key: show_prices
value: "true" / "false"
type: boolean
category: product
```

### API Endpoints

- **GET** `/api/settings?key=show_prices` - Ambil setting spesifik
- **GET** `/api/settings` - Ambil semua settings
- **POST** `/api/settings` - Create/Update setting (Admin only)

### Cache

Settings di-cache selama 5 menit di client-side untuk performa optimal.

## Troubleshooting

### Harga Masih Muncul Setelah Dimatikan

1. Clear browser cache (Ctrl+F5 / Cmd+Shift+R)
2. Tunggu 5 menit untuk cache clear otomatis
3. Periksa apakah notifikasi "Berhasil" muncul saat toggle

### Setting Tidak Tersimpan

1. Pastikan Anda login sebagai Admin
2. Cek console browser untuk error
3. Cek koneksi database

### Default Value

Jika setting belum ada di database, aplikasi akan menggunakan default value `true`.
