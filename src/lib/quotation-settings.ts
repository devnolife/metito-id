import { db } from '@/lib/db'
import { DEFAULT_COMPANY_CODE, DEFAULT_DOC_CODE } from '@/lib/quotation-number'

/**
 * Pembacaan Setting dari sisi server.
 *
 * lib/settings.ts memakai fetch dengan URL relatif sehingga hanya jalan di
 * browser. Route handler dan server component membaca langsung ke database
 * lewat modul ini.
 */

export const QUOTATION_SETTING_KEYS = {
  docCode: 'quotation_doc_code',
  companyCode: 'quotation_company_code',
  vatRate: 'quotation_vat_rate',
  bankName: 'quotation_bank_name',
  bankAccount: 'quotation_bank_account',
  bankBranch: 'quotation_bank_branch',
  signerName: 'quotation_signer_name',
  signerTitle: 'quotation_signer_title',
  franco: 'quotation_default_franco',
  deliveryTime: 'quotation_default_delivery_time',
  termsOfPayment: 'quotation_default_terms_of_payment',
  validityDays: 'quotation_default_validity_days',
} as const

export interface QuotationSettings {
  docCode: string
  companyCode: string
  vatRate: string
  bankName: string
  bankAccount: string
  bankBranch: string
  signerName: string
  signerTitle: string
  franco: string
  deliveryTime: string
  termsOfPayment: string
  validityDays: number
}

/**
 * Nilai baku diambil dari berkas Excel yang selama ini dipakai, sehingga
 * dokumen pertama yang dibuat lewat aplikasi sudah sama isinya.
 */
export const QUOTATION_SETTING_DEFAULTS: QuotationSettings = {
  docCode: DEFAULT_DOC_CODE,
  companyCode: DEFAULT_COMPANY_CODE,
  vatRate: '0.11',
  bankName: 'Bank Rakyat Indonesia (BRI)',
  bankAccount: '0343-01-003723-56-2',
  bankBranch: 'Kc. Sudirman',
  signerName: 'Pasya',
  signerTitle: 'Sales Engineer',
  franco: '',
  deliveryTime: '',
  termsOfPayment: '30 Days After Invoice',
  validityDays: 30,
}

/**
 * Membaca seluruh setting penawaran sekaligus.
 * Bila database tidak dapat dijangkau, nilai baku tetap dikembalikan agar
 * dokumen tidak kehilangan kop dan rekening.
 */
export async function getQuotationSettings(): Promise<QuotationSettings> {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: Object.values(QUOTATION_SETTING_KEYS) }, isActive: true },
      select: { key: true, value: true },
    })

    const byKey = new Map(rows.map((row) => [row.key, row.value]))
    const read = (key: string, fallback: string) => {
      const value = byKey.get(key)
      return typeof value === 'string' && value.trim() ? value.trim() : fallback
    }

    const validityDays = Number(
      read(QUOTATION_SETTING_KEYS.validityDays, String(QUOTATION_SETTING_DEFAULTS.validityDays))
    )

    return {
      docCode: read(QUOTATION_SETTING_KEYS.docCode, QUOTATION_SETTING_DEFAULTS.docCode),
      companyCode: read(
        QUOTATION_SETTING_KEYS.companyCode,
        QUOTATION_SETTING_DEFAULTS.companyCode
      ),
      vatRate: read(QUOTATION_SETTING_KEYS.vatRate, QUOTATION_SETTING_DEFAULTS.vatRate),
      bankName: read(QUOTATION_SETTING_KEYS.bankName, QUOTATION_SETTING_DEFAULTS.bankName),
      bankAccount: read(
        QUOTATION_SETTING_KEYS.bankAccount,
        QUOTATION_SETTING_DEFAULTS.bankAccount
      ),
      bankBranch: read(QUOTATION_SETTING_KEYS.bankBranch, QUOTATION_SETTING_DEFAULTS.bankBranch),
      signerName: read(QUOTATION_SETTING_KEYS.signerName, QUOTATION_SETTING_DEFAULTS.signerName),
      signerTitle: read(
        QUOTATION_SETTING_KEYS.signerTitle,
        QUOTATION_SETTING_DEFAULTS.signerTitle
      ),
      franco: read(QUOTATION_SETTING_KEYS.franco, QUOTATION_SETTING_DEFAULTS.franco),
      deliveryTime: read(
        QUOTATION_SETTING_KEYS.deliveryTime,
        QUOTATION_SETTING_DEFAULTS.deliveryTime
      ),
      termsOfPayment: read(
        QUOTATION_SETTING_KEYS.termsOfPayment,
        QUOTATION_SETTING_DEFAULTS.termsOfPayment
      ),
      validityDays: Number.isFinite(validityDays)
        ? validityDays
        : QUOTATION_SETTING_DEFAULTS.validityDays,
    }
  } catch (error) {
    console.warn('[quotation] Gagal membaca setting, memakai nilai baku:', error)
    return QUOTATION_SETTING_DEFAULTS
  }
}
