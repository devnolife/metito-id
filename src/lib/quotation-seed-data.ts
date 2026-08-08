/**
 * Data penawaran yang sudah ada, disalin dari Quotation 2026.xlsx.
 *
 * Dipisahkan dari skrip seed agar hasil impornya dapat diuji tanpa database:
 * nomor surat, total, dan terbilang yang akan tersimpan bisa diperiksa lebih
 * dahulu oleh unit test.
 *
 * Baris contoh pada Log_Penomoran_Surat_Penawaran_METITO.xlsx sengaja tidak
 * disertakan karena berlabel "Contoh - silakan hapus/ganti".
 */

export interface SeedQuotationItem {
  materialCode: string
  brand: string
  type: string
  qty: number
  unit: string
  unitPrice: number
}

export interface SeedQuotation {
  /** Nomor asli pada berkas Excel, disimpan untuk penelusuran. */
  originalNumber: string
  issuedAt: Date
  customerName: string
  attn: string
  subject: string
  /** Diisi bila perihal pada berkas asli keliru dan perlu dijelaskan. */
  subjectNote?: string
  franco: string
  deliveryTime: string
  termsOfPayment: string
  items: SeedQuotationItem[]
}

export const SEED_VAT_RATE = '0.11'

export const SEED_QUOTATIONS: SeedQuotation[] = [
  {
    originalNumber: '001/QUO-METITO/VII/2026',
    issuedAt: new Date(2026, 6, 23),
    customerName: 'PT. PLN Nusantara Power',
    attn: 'Hendro',
    subject: 'Pengadaan Cable Instrument',
    franco: 'PLTU Punagaya',
    deliveryTime: '12 Weeks',
    termsOfPayment: '30 Days After Invoice',
    items: [
      { materialCode: 'Kable 4 Core', brand: 'LiCYC', type: 'LiCYC 4x1.5 mmsq', qty: 500, unit: 'm', unitPrice: 100_000 },
      { materialCode: 'Kable 8 Core', brand: 'LiCYC', type: 'LiCYC 8x1.5 mmsq', qty: 500, unit: 'm', unitPrice: 150_000 },
      { materialCode: 'Cable 12 Core', brand: 'LiCYC', type: 'LiCYC 12x1.5 mmsq', qty: 500, unit: 'm', unitPrice: 220_000 },
    ],
  },
  {
    originalNumber: '001/QUO-METITO/VII/2026',
    issuedAt: new Date(2026, 6, 23),
    customerName: 'PT. PLN Nusantara Power',
    attn: 'Hendro',
    // Berkas asli menuliskan "Pengadaan Cable Instrument" pada sheet berisi
    // bahan kimia, sisa penyalinan sheet kabel. Diperbaiki saat impor.
    subject: 'Pengadaan Bahan Kimia',
    subjectNote:
      'Perihal pada berkas Excel tertulis "Pengadaan Cable Instrument" (sisa salinan sheet kabel); diperbaiki saat impor.',
    franco: 'PLTU Punagaya',
    deliveryTime: '12 Weeks',
    termsOfPayment: '30 Days After Invoice',
    items: [
      { materialCode: 'Clorine Liquid', brand: 'M-CHEM', type: 'MC-NAOCL 10', qty: 4, unit: 'Pail', unitPrice: 375_000 },
      { materialCode: 'TCCA Tablet', brand: 'M-CHEM', type: 'MC-TCCA90', qty: 102, unit: 'Pail', unitPrice: 1_560_000 },
      { materialCode: 'Coustic Soda', brand: 'M-CHEM', type: 'MC-COUSTIC SODA 35', qty: 4, unit: 'Pail', unitPrice: 220_000 },
    ],
  },
  {
    originalNumber: '003/SPH-METITO/VII/2026',
    issuedAt: new Date(2026, 6, 25),
    customerName: 'PT. PLN Nusantara Power',
    attn: 'Mr. Hendro',
    subject: 'Pengadaan Cable Instrument',
    franco: 'PLTU Punagaya',
    deliveryTime: '18 Weeks',
    termsOfPayment: '30 Days After Invoice',
    items: [
      { materialCode: 'Kable 4 Core', brand: 'Temsens', type: 'CB86261', qty: 500, unit: 'm', unitPrice: 120_000 },
      { materialCode: 'Kable 8 Core', brand: 'Temsens', type: 'CB86694', qty: 500, unit: 'm', unitPrice: 250_000 },
      { materialCode: 'Cable 12 Core', brand: 'Temsens', type: 'CB86695', qty: 500, unit: 'm', unitPrice: 220_000 },
    ],
  },
]

/** Urutan impor mengikuti tanggal terbit agar nomor urut masuk akal. */
export function orderedSeedQuotations(): SeedQuotation[] {
  return [...SEED_QUOTATIONS].sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime())
}
