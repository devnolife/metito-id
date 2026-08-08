import type {
  CrmAccountStatus,
  CrmActivityType,
  CrmDealStage,
  LetterStatus,
} from '@prisma/client'

/** Label bahasa Indonesia untuk enum CRM, dipakai bersama oleh API dan UI. */

export const ACCOUNT_STATUS_LABEL: Record<CrmAccountStatus, string> = {
  PROSPEK: 'Prospek',
  AKTIF: 'Aktif',
  TIDAK_AKTIF: 'Tidak Aktif',
}

export const DEAL_STAGE_LABEL: Record<CrmDealStage, string> = {
  PROSPEK: 'Prospek',
  PENAWARAN: 'Penawaran',
  NEGOSIASI: 'Negosiasi',
  DEAL: 'Deal (Menang)',
  KALAH: 'Kalah',
}

export const ACTIVITY_TYPE_LABEL: Record<CrmActivityType, string> = {
  TELEPON: 'Telepon',
  EMAIL: 'Email',
  MEETING: 'Meeting',
  KUNJUNGAN: 'Kunjungan',
  WHATSAPP: 'WhatsApp',
  LAINNYA: 'Lainnya',
}

export const LETTER_STATUS_LABEL: Record<LetterStatus, string> = {
  DRAFT: 'Draft',
  TERKIRIM: 'Terkirim',
  DISETUJUI: 'Disetujui',
  DIBATALKAN: 'Dibatalkan',
}

/** Tahap yang sudah selesai; tidak lagi dihitung sebagai pipeline berjalan. */
export const CLOSED_STAGES: CrmDealStage[] = ['DEAL', 'KALAH']

export function isOpenStage(stage: CrmDealStage): boolean {
  return !CLOSED_STAGES.includes(stage)
}

/**
 * Nilai berbobot sebuah peluang: nilai estimasi dikali probabilitas.
 *
 * Peluang yang sudah ditutup memakai bobot pasti (100% bila menang, 0% bila
 * kalah) agar rekap tidak menampilkan perkiraan atas hasil yang sudah tetap.
 */
export function weightedValue(
  estimatedValue: number,
  probability: number,
  stage: CrmDealStage
): number {
  if (stage === 'DEAL') return estimatedValue
  if (stage === 'KALAH') return 0
  return (estimatedValue * probability) / 100
}
