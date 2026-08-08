/**
 * Bypass autentikasi khusus pengembangan.
 *
 * Dipakai agar panel admin dapat dibuka tanpa database, misalnya saat server
 * PostgreSQL belum tersedia di mesin pengembang.
 *
 * Dijaga dua lapis dan keduanya harus benar:
 *
 * 1. `NODE_ENV` bukan 'production'. Ini penjaga keras: build produksi tidak
 *    pernah dapat mengaktifkannya, bahkan bila variabel di bawah ikut terbawa
 *    ke server.
 * 2. `ADMIN_AUTH_BYPASS` bernilai '1'. Penjaga eksplisit supaya bypass tidak
 *    pernah menyala diam-diam hanya karena database sedang mati — kalau tidak,
 *    gangguan koneksi sesaat akan membuka panel admin untuk siapa saja.
 *
 * Nilainya dibaca setiap pemanggilan, bukan disimpan di konstanta modul, agar
 * mematikan flag cukup dengan mengubah .env tanpa perlu build ulang.
 */

export interface DevAdminUser {
  id: string
  email: string
  name: string
  role: 'ADMIN'
  isActive: true
  avatar: null
  company: string
  phone: null
  createdAt: string
}

export function isAdminAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.ADMIN_AUTH_BYPASS === '1'
}

/**
 * Identitas semu untuk sesi bypass.
 *
 * `id` sengaja bukan cuid yang menyerupai id asli agar barisnya mudah dikenali
 * bila sempat tersimpan, dan agar relasi ke tabel users gagal terang-terangan
 * alih-alih menempel pada pengguna nyata.
 */
export function devAdminUser(): DevAdminUser {
  return {
    id: 'dev-bypass-admin',
    email: 'dev@localhost',
    name: 'Admin (mode pengembangan)',
    role: 'ADMIN',
    isActive: true,
    avatar: null,
    company: 'PT. METITO',
    phone: null,
    createdAt: new Date().toISOString(),
  }
}
