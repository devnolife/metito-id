import { z } from 'zod'

/**
 * Skema validasi untuk penawaran.
 *
 * Nilai uang diterima sebagai string agar presisi tidak hilang saat melewati
 * JSON, lalu dikonversi ke Decimal di sisi server. Total tidak pernah diterima
 * dari klien; selalu dihitung ulang dari item.
 */

const decimalString = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => /^\d+(\.\d+)?$/.test(value), {
    message: 'Harus berupa angka positif',
  })

export const quotationItemSchema = z.object({
  materialCode: z.string().trim().min(1, 'Kode material wajib diisi'),
  brand: z.string().trim().optional().nullable(),
  type: z.string().trim().optional().nullable(),
  qty: decimalString,
  unit: z.string().trim().min(1, 'Satuan wajib diisi'),
  unitPrice: decimalString,
})

export const quotationCreateSchema = z.object({
  customerName: z.string().trim().min(1, 'Nama pelanggan wajib diisi'),
  attn: z.string().trim().optional().nullable(),
  subject: z.string().trim().min(1, 'Perihal wajib diisi'),
  quoteDate: z.coerce.date().optional(),
  franco: z.string().trim().optional().nullable(),
  deliveryTime: z.string().trim().optional().nullable(),
  termsOfPayment: z.string().trim().optional().nullable(),
  priceIncludeNote: z.string().trim().optional().nullable(),
  validityDays: z.coerce.number().int().min(1).max(365).default(30),
  vatRate: decimalString.default('0.11'),
  notes: z.string().trim().optional().nullable(),
  items: z.array(quotationItemSchema).default([]),
})

export const quotationUpdateSchema = quotationCreateSchema.partial()

export const quotationStatusSchema = z.object({
  status: z.enum(['WON', 'LOST', 'SENT']),
})

export const quotationListQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['DRAFT', 'SENT', 'WON', 'LOST', 'EXPIRED']).optional(),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type QuotationCreateInput = z.infer<typeof quotationCreateSchema>
export type QuotationUpdateInput = z.infer<typeof quotationUpdateSchema>
export type QuotationItemInput = z.infer<typeof quotationItemSchema>

/** Mengubah error zod menjadi bentuk yang dipakai validationErrorResponse. */
export function zodErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    result[key] = result[key] ? [...result[key], issue.message] : [issue.message]
  }
  return result
}
