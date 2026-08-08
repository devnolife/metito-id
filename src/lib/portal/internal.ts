import type { CrmDivision } from "@prisma/client";

/**
 * Utilitas bersama modul internal portal (Surat Penawaran, Nomor Surat, CRM).
 * Data diambil langsung dari Prisma di Server Components — akses route sudah
 * dijaga oleh cookie sesi portal di proxy.ts.
 */

/** Label divisi mengikuti sheet "Panduan" pada CRM_Nomor_Surat_METITO_3.xlsx. */
export const DIVISION_LABEL: Record<CrmDivision, string> = {
  CSC: "Chemical Supply",
  ES: "Engineering Services",
  EQS: "Equipment Supply",
  CSP: "Consumable & Spare Parts",
  MMH: "Mining & Material Handling",
};

/** Warna segmen chart per divisi (palet METITO). */
export const DIVISION_COLOR: Record<CrmDivision, string> = {
  CSC: "#096aae",
  ES: "#1e7226",
  EQS: "#fb8501",
  CSP: "#f04e00",
  MMH: "#012966",
};

const TANGGAL = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TANGGAL_WAKTU = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTanggal(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return TANGGAL.format(new Date(value));
}

export function formatTanggalWaktu(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return TANGGAL_WAKTU.format(new Date(value));
}

/** Ringkas rupiah untuk kartu statistik: Rp 672,9 jt / Rp 1,2 M. */
export function formatCompactIDR(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1_000_000) return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  return `Rp ${value.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

/**
 * Jalankan query database dengan penanganan kegagalan yang anggun: bila server
 * database tidak terjangkau, halaman tetap dirender dengan panel pemberitahuan
 * alih-alih error 500.
 */
export async function safeQuery<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("[portal-internal] query database gagal:", error);
    return null;
  }
}
