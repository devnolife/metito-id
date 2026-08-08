import { CONTACT } from '@/lib/company-profile'

/**
 * Ditampilkan bila tautan penawaran salah, sudah dicabut, atau digantikan
 * revisi. Sengaja tidak menjelaskan alasannya agar tidak membocorkan
 * keberadaan dokumen kepada orang yang menebak token.
 */
export default function QuotationNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-lg font-bold text-slate-900">Penawaran tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tautan ini sudah tidak berlaku, mungkin karena penawaran telah diperbarui. Silakan
          hubungi kami di {CONTACT.phones[0]} atau {CONTACT.email} untuk memperoleh penawaran
          terbaru.
        </p>
      </div>
    </div>
  )
}
