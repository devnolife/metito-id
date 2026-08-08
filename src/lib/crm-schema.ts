import { z } from 'zod'
import { DIVISION_CODES, LETTER_TYPES } from '@/lib/letter-number'

/**
 * Skema validasi modul CRM & penomoran surat.
 *
 * Nilai uang diterima sebagai string agar presisi tidak hilang saat melewati
 * JSON, lalu dikonversi ke Decimal di sisi server.
 */

const decimalString = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => /^\d+(\.\d+)?$/.test(value), {
    message: 'Harus berupa angka positif',
  })

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .nullable()
  .transform((value) => (value ? value : null))

export const divisionSchema = z.enum(DIVISION_CODES)
export const letterTypeSchema = z.enum(LETTER_TYPES)
export const accountStatusSchema = z.enum(['PROSPEK', 'AKTIF', 'TIDAK_AKTIF'])
export const dealStageSchema = z.enum(['PROSPEK', 'PENAWARAN', 'NEGOSIASI', 'DEAL', 'KALAH'])
export const activityTypeSchema = z.enum([
  'TELEPON',
  'EMAIL',
  'MEETING',
  'KUNJUNGAN',
  'WHATSAPP',
  'LAINNYA',
])
export const letterStatusSchema = z.enum(['DRAFT', 'TERKIRIM', 'DISETUJUI', 'DIBATALKAN'])

// --- Pelanggan -------------------------------------------------------------

export const accountCreateSchema = z.object({
  name: z.string().trim().min(1, 'Nama perusahaan wajib diisi').max(200),
  industry: optionalText,
  division: divisionSchema.optional().nullable(),
  address: optionalText,
  picName: optionalText,
  picTitle: optionalText,
  phone: optionalText,
  email: optionalText,
  leadSource: optionalText,
  status: accountStatusSchema.default('PROSPEK'),
  addedAt: z.coerce.date().optional(),
  notes: optionalText,
})

export const accountUpdateSchema = accountCreateSchema.partial()

export const accountListQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: accountStatusSchema.optional(),
  division: divisionSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

// --- Pipeline --------------------------------------------------------------

export const dealCreateSchema = z.object({
  accountId: z.string().trim().min(1, 'Pelanggan wajib dipilih'),
  title: z.string().trim().min(1, 'Deskripsi proyek wajib diisi').max(300),
  division: divisionSchema.optional().nullable(),
  estimatedValue: decimalString.default('0'),
  stage: dealStageSchema.default('PROSPEK'),
  // Persen bulat. Excel mencampur 0,8 dan 50 pada kolom yang sama sehingga
  // bobot pipeline tidak dapat dijumlahkan; di sini satuannya dikunci.
  probability: z.coerce.number().int().min(0).max(100).default(0),
  startDate: z.coerce.date().optional().nullable(),
  targetCloseDate: z.coerce.date().optional().nullable(),
  ownerName: optionalText,
  notes: optionalText,
  quotationId: z.string().trim().optional().nullable(),
})

export const dealUpdateSchema = dealCreateSchema.partial()

export const dealListQuerySchema = z.object({
  search: z.string().trim().optional(),
  stage: dealStageSchema.optional(),
  division: divisionSchema.optional(),
  accountId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

// --- Aktivitas -------------------------------------------------------------

export const activityCreateSchema = z.object({
  accountId: z.string().trim().optional().nullable(),
  dealId: z.string().trim().optional().nullable(),
  occurredAt: z.coerce.date().optional(),
  contactName: optionalText,
  type: activityTypeSchema.default('TELEPON'),
  description: z.string().trim().min(1, 'Deskripsi wajib diisi').max(2000),
  nextAction: optionalText,
  nextActionDate: z.coerce.date().optional().nullable(),
  ownerName: optionalText,
})

export const activityUpdateSchema = activityCreateSchema.partial()

export const activityListQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: activityTypeSchema.optional(),
  accountId: z.string().trim().optional(),
  dealId: z.string().trim().optional(),
  /** Hanya aktivitas yang masih menyisakan tindak lanjut. */
  pendingFollowUp: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

// --- Surat -----------------------------------------------------------------

export const letterCreateSchema = z.object({
  type: letterTypeSchema,
  division: divisionSchema.optional().nullable(),
  subject: z.string().trim().min(1, 'Perihal wajib diisi').max(300),
  recipient: z.string().trim().min(1, 'Ditujukan kepada wajib diisi').max(200),
  issuerName: z.string().trim().min(1, 'PIC penerbit wajib diisi').max(120),
  letterDate: z.coerce.date().optional(),
  status: letterStatusSchema.default('DRAFT'),
  notes: optionalText,
  accountId: z.string().trim().optional().nullable(),
})

/**
 * Nomor, urutan, jenis, dan divisi tidak dapat diubah setelah terbit: mengubah
 * salah satunya berarti membuat surat lain dengan identitas surat lama.
 */
export const letterUpdateSchema = z.object({
  subject: z.string().trim().min(1).max(300).optional(),
  recipient: z.string().trim().min(1).max(200).optional(),
  issuerName: z.string().trim().min(1).max(120).optional(),
  status: letterStatusSchema.optional(),
  notes: optionalText,
  accountId: z.string().trim().optional().nullable(),
})

export const letterListQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: letterTypeSchema.optional(),
  division: divisionSchema.optional(),
  status: letterStatusSchema.optional(),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

export const nextLetterNumberQuerySchema = z.object({
  type: letterTypeSchema,
  division: divisionSchema.optional(),
  letterDate: z.coerce.date().optional(),
})

export type AccountCreateInput = z.infer<typeof accountCreateSchema>
export type DealCreateInput = z.infer<typeof dealCreateSchema>
export type ActivityCreateInput = z.infer<typeof activityCreateSchema>
export type LetterCreateInput = z.infer<typeof letterCreateSchema>
