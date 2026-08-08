import type { DivisionCode, LetterTypeCode } from '@/lib/letter-number'

/**
 * Data CRM yang sudah ada, disalin dari CRM_Nomor_Surat_METITO_3.xlsx.
 *
 * Dipisahkan dari skrip seed agar hasil impornya dapat diuji tanpa database.
 *
 * Perbaikan yang dilakukan saat menyalin, beserta alasannya:
 *
 * 1. Nomor telepon. Excel menyimpan kolom Telepon sebagai angka, sehingga
 *    "085640373995" tersimpan menjadi 85640373995 dan nol di depannya hilang.
 *    Di sini nomor ditulis sebagai teks lengkap.
 * 2. Probabilitas. Kolom Probabilitas mencampur dua satuan (0,8 untuk 80% dan
 *    50 untuk 50%) sehingga bobot pipeline tidak dapat dijumlahkan. Semua
 *    diseragamkan menjadi persen bulat.
 * 3. Nama perusahaan pada pipeline. "PT. Safindo Utama" di pipeline tidak
 *    pernah cocok dengan "PT. Safetindo Utama" di data pelanggan karena
 *    keduanya diketik terpisah. Pipeline sekarang menunjuk pelanggan lewat id.
 * 4. Baris pratinjau pada Log Nomor Surat (status "Live (belum disimpan)",
 *    nomor 009) tidak diimpor: ia adalah rumus pratinjau, bukan surat terbit.
 * 5. Tanggal surat 004 dan 005 tertulis 08/04/2026 pada berkas namun nomornya
 *    berbulan VIII; keduanya diperbaiki menjadi 4 Agustus 2026 mengikuti nomor
 *    surat yang sudah terkirim. Surat 006 dibaca sebagai 8 Mei 2026 pada berkas
 *    tetapi bernomor VIII, jadi diperbaiki menjadi 5 Agustus 2026.
 * 6. Email " - " dan "-" pada beberapa pelanggan disimpan sebagai kosong,
 *    karena tanda hubung bukan alamat surel.
 */

export type SeedAccountStatus = 'PROSPEK' | 'AKTIF' | 'TIDAK_AKTIF'
export type SeedDealStage = 'PROSPEK' | 'PENAWARAN' | 'NEGOSIASI' | 'DEAL' | 'KALAH'
export type SeedActivityType =
  | 'TELEPON'
  | 'EMAIL'
  | 'MEETING'
  | 'KUNJUNGAN'
  | 'WHATSAPP'
  | 'LAINNYA'
export type SeedLetterStatus = 'DRAFT' | 'TERKIRIM' | 'DISETUJUI' | 'DIBATALKAN'

export interface SeedAccount {
  /** Kunci lokal untuk menautkan peluang dan aktivitas ke pelanggan ini. */
  key: string
  name: string
  industry: string | null
  division: DivisionCode | null
  address: string | null
  picName: string | null
  picTitle: string | null
  phone: string | null
  email: string | null
  leadSource: string | null
  status: SeedAccountStatus
  addedAt: Date | null
}

export interface SeedDeal {
  accountKey: string
  title: string
  division: DivisionCode | null
  estimatedValue: number
  stage: SeedDealStage
  /** Persen bulat 0..100. */
  probability: number
  startDate: Date | null
  targetCloseDate: Date | null
  ownerName: string
}

export interface SeedActivity {
  accountKey: string | null
  /** Nama perusahaan pada berkas asli, dipakai bila pelanggannya belum ada. */
  accountNameFallback: string
  occurredAt: Date
  contactName: string | null
  type: SeedActivityType
  description: string
  nextAction: string | null
  nextActionDate: Date | null
  ownerName: string
}

export interface SeedLetter {
  seq: number
  number: string
  letterDate: Date
  type: LetterTypeCode
  division: DivisionCode | null
  subject: string
  recipient: string
  issuerName: string
  status: SeedLetterStatus
}

export const SEED_ACCOUNTS: SeedAccount[] = [
  {
    key: 'pln-np-punagaya-csp',
    name: 'PT PLN Nusantara Power',
    industry: 'Power Plant',
    division: 'CSP',
    address: 'PLTU Punagaya',
    picName: 'Hendro',
    picTitle: 'SPV Logistic',
    phone: '085640373995',
    email: null,
    leadSource: 'Referensi',
    status: 'AKTIF',
    addedAt: new Date(2026, 7, 7),
  },
  {
    key: 'safetindo-utama',
    name: 'PT. Safetindo Utama',
    industry: null,
    division: 'CSC',
    address: 'Ruko Dasana Xentre BD62, Tangerang, Banten',
    picName: 'Theri Andika',
    picTitle: 'Finance',
    phone: '+62 811-4835-755',
    email: 'safetindo.utama@gmail.com',
    leadSource: 'Website',
    status: 'PROSPEK',
    addedAt: null,
  },
  {
    key: 'plnnps-tobelo',
    name: 'PT PLN Nusantara Power Service',
    industry: 'Power Plant',
    division: 'CSP',
    address: 'PLTMG Tobelo',
    picName: 'Lhendi',
    picTitle: 'Planner',
    phone: '08124517175',
    email: 'plannertobelo@gmail.com',
    leadSource: 'WA Grup',
    status: 'AKTIF',
    addedAt: new Date(2026, 7, 7),
  },
  {
    key: 'plnnps-amurang',
    name: 'PT PLN Nusantara Power Service',
    industry: 'Power Plant',
    division: 'CSP',
    address: 'PLTU Amurang',
    picName: 'Chelin',
    picTitle: 'Planner',
    phone: '082293684084',
    email: 'planneramurang@gmail.com',
    leadSource: 'WA Grup',
    status: 'AKTIF',
    addedAt: new Date(2026, 7, 7),
  },
  {
    key: 'pln-np-punagaya-es',
    name: 'PT. PLN Nusantara Power',
    industry: 'Power Plant',
    division: 'ES',
    address: 'PLTU Punagaya',
    picName: 'Effendi',
    picTitle: 'User',
    phone: '085640373995',
    email: null,
    leadSource: 'Referensi',
    status: 'AKTIF',
    addedAt: new Date(2026, 6, 29),
  },
  {
    key: 'pln-ip-holtekamp',
    name: 'PT. PLN Indonesia Power',
    industry: 'Power Plant',
    division: 'CSC',
    address: 'PLTMG Holtekamp',
    picName: 'Adriaandz',
    picTitle: 'Planner',
    phone: '082199401998',
    email: null,
    leadSource: 'Referensi',
    status: 'AKTIF',
    addedAt: new Date(2026, 6, 29),
  },
]

export const SEED_DEALS: SeedDeal[] = [
  {
    accountKey: 'pln-np-punagaya-csp',
    title: 'Cable Instrument Tensens',
    division: 'CSP',
    estimatedValue: 235_000_000,
    stage: 'PENAWARAN',
    probability: 80,
    startDate: new Date(2026, 7, 7),
    targetCloseDate: new Date(2026, 9, 6),
    ownerName: 'Muhammad Khudaivi',
  },
  {
    accountKey: 'safetindo-utama',
    title: 'Chemical WTP',
    division: 'CSC',
    estimatedValue: 150_000_000,
    stage: 'PROSPEK',
    probability: 30,
    startDate: null,
    targetCloseDate: null,
    ownerName: 'Andi Musthamu',
  },
  {
    accountKey: 'plnnps-tobelo',
    title: 'Carbon Brush',
    division: 'CSP',
    estimatedValue: 58_952_850,
    stage: 'PENAWARAN',
    probability: 75,
    startDate: new Date(2026, 6, 29),
    targetCloseDate: new Date(2026, 9, 14),
    ownerName: 'Pasya Ahmad',
  },
  {
    accountKey: 'plnnps-amurang',
    title: 'KTO HQ 11140',
    division: 'EQS',
    estimatedValue: 76_967_328,
    stage: 'PENAWARAN',
    probability: 50,
    startDate: new Date(2026, 7, 4),
    targetCloseDate: new Date(2026, 9, 14),
    ownerName: 'Pasya Ahmad',
  },
  {
    accountKey: 'plnnps-amurang',
    title: 'KTO HQ 1110',
    division: 'EQS',
    estimatedValue: 63_854_785,
    stage: 'PENAWARAN',
    probability: 50,
    startDate: new Date(2026, 7, 4),
    targetCloseDate: new Date(2026, 9, 14),
    ownerName: 'Pasya Ahmad',
  },
  {
    accountKey: 'plnnps-amurang',
    title: 'Cat Jotun Traffic Hijau',
    division: 'CSP',
    estimatedValue: 39_565_140,
    stage: 'PENAWARAN',
    probability: 45,
    startDate: new Date(2026, 7, 3),
    targetCloseDate: new Date(2026, 8, 15),
    ownerName: 'Pasya Ahmad',
  },
  {
    accountKey: 'pln-ip-holtekamp',
    title: 'Chemical Reagent',
    division: 'CSC',
    estimatedValue: 13_564_006,
    stage: 'PENAWARAN',
    probability: 50,
    startDate: new Date(2026, 7, 10),
    targetCloseDate: new Date(2026, 9, 18),
    ownerName: 'Andi Musthamu',
  },
  {
    accountKey: 'pln-ip-holtekamp',
    title: 'Chemical Operasi',
    division: 'CSC',
    estimatedValue: 35_000_000,
    stage: 'PENAWARAN',
    probability: 50,
    startDate: new Date(2026, 7, 10),
    targetCloseDate: null,
    ownerName: 'Andi Musthamu',
  },
]

/**
 * Satu-satunya baris pada sheet Log Aktivitas masih berisi contoh bawaan
 * ("PT Contoh Industri Sejahtera"). Ia tidak diimpor karena bukan interaksi
 * nyata; daftar ini sengaja dibiarkan kosong agar rekap tindak lanjut tidak
 * menampilkan pekerjaan yang tidak pernah ada.
 */
export const SEED_ACTIVITIES: SeedActivity[] = []

export const SEED_LETTERS: SeedLetter[] = [
  {
    seq: 1,
    number: '001/METITO-SPH/VII/2026',
    letterDate: new Date(2026, 6, 26),
    type: 'SPH',
    division: null,
    subject: 'Cable Instrument',
    recipient: 'PT. PLN Nusantara Power',
    issuerName: 'Muhammad Khudaivi',
    status: 'TERKIRIM',
  },
  {
    seq: 2,
    number: '002/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 1),
    type: 'SPH',
    division: null,
    subject: 'Chemical WTP',
    recipient: 'CV. Safindo Utama',
    issuerName: 'Andi Musthamu',
    status: 'DRAFT',
  },
  {
    seq: 3,
    number: '003/METITO-SPH/VII/2026',
    letterDate: new Date(2026, 6, 29),
    type: 'SPH',
    division: null,
    subject: 'Carbon Brush',
    recipient: 'PT. PLN Nusantara Power Service',
    issuerName: 'Pasya Ahmad',
    status: 'TERKIRIM',
  },
  {
    seq: 4,
    number: '004/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 4),
    type: 'SPH',
    division: null,
    subject: 'KTO HQ 11140',
    recipient: 'PT. PLN Nusantara Power Service',
    issuerName: 'Pasya Ahmad',
    status: 'TERKIRIM',
  },
  {
    seq: 5,
    number: '005/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 4),
    type: 'SPH',
    division: null,
    subject: 'KTO HQ 1110',
    recipient: 'PT. PLN Nusantara Power Service',
    issuerName: 'Pasya Ahmad',
    status: 'TERKIRIM',
  },
  {
    seq: 6,
    number: '006/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 5),
    type: 'SPH',
    division: null,
    subject: 'Cat Jotun Traffic Hijau',
    recipient: 'PT. PLN Nusantara Power Service',
    issuerName: 'Pasya Ahmad',
    status: 'DRAFT',
  },
  {
    seq: 7,
    number: '007/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 6),
    type: 'SPH',
    division: null,
    subject: 'Chemical Reagent',
    recipient: 'PT. Indonesia Power Service',
    issuerName: 'Andi Musthamu',
    status: 'TERKIRIM',
  },
  {
    seq: 8,
    number: '008/METITO-SPH/VIII/2026',
    letterDate: new Date(2026, 7, 6),
    type: 'SPH',
    division: null,
    subject: 'Chemical Operasi',
    recipient: 'PT. Indonesia Power',
    issuerName: 'Andi Musthamu',
    status: 'TERKIRIM',
  },
]

/**
 * Nomor urut tertinggi per (tahun, jenis, divisi) pada data awal.
 *
 * Counter harus dimulai dari angka ini, bukan dari nol: bila tidak, surat
 * berikutnya akan terbit dengan nomor 001 yang sudah dipakai pelanggan.
 */
export function seedCounterState(): Array<{
  year: number
  type: LetterTypeCode
  division: string
  lastSeq: number
}> {
  const highest = new Map<string, { year: number; type: LetterTypeCode; division: string; lastSeq: number }>()

  for (const letter of SEED_LETTERS) {
    const year = letter.letterDate.getFullYear()
    const division = letter.division ?? '-'
    const key = `${year}|${letter.type}|${division}`
    const current = highest.get(key)

    if (!current || letter.seq > current.lastSeq) {
      highest.set(key, { year, type: letter.type, division, lastSeq: letter.seq })
    }
  }

  return [...highest.values()]
}
