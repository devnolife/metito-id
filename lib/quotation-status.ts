import type { QuotationStatus } from '@prisma/client'

/**
 * Status yang ditampilkan ke pengguna.
 *
 * "EXPIRED" sengaja tidak disimpan di database. Ia diturunkan dari `validUntil`
 * saat pembacaan, sehingga tidak perlu penjadwal dan tidak mungkin basi karena
 * ada job yang gagal jalan.
 */
export type DisplayStatus = QuotationStatus | 'EXPIRED'

export const STATUS_LABEL: Record<DisplayStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Terkirim',
  WON: 'Menang',
  LOST: 'Kalah',
  EXPIRED: 'Kedaluwarsa',
}

/**
 * Hanya penawaran berstatus SENT yang dapat kedaluwarsa. Dokumen yang sudah
 * dinyatakan menang atau kalah mempertahankan hasilnya, dan draft belum
 * memiliki masa berlaku.
 */
export function displayStatus(
  status: QuotationStatus,
  validUntil: Date | null | undefined,
  now: Date = new Date()
): DisplayStatus {
  if (status === 'SENT' && validUntil && validUntil.getTime() < now.getTime()) {
    return 'EXPIRED'
  }
  return status
}

/** Dokumen terbit bersifat read-only; perubahan hanya lewat revisi. */
export function isEditable(status: QuotationStatus): boolean {
  return status === 'DRAFT'
}

/** Hanya dokumen terbit yang boleh dibagikan lewat tautan publik. */
export function isShareable(status: QuotationStatus): boolean {
  return status !== 'DRAFT'
}
