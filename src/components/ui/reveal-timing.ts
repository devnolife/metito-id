/**
 * Pengatur waktu untuk animasi `<Reveal>`.
 *
 * Sengaja dipisah dari `reveal.tsx` dan TANPA "use client". Semua yang
 * diekspor dari modul "use client" berubah menjadi client reference, sehingga
 * server component boleh merender komponennya tapi tidak boleh memanggil
 * fungsinya — `revealDelay()` di dalam server component akan melempar
 * "Attempted to call revealDelay() from the server". Karena ini fungsi murni,
 * modul netral membuatnya bisa dipakai kedua sisi.
 */

export const REVEAL_DURATION_MS = 500;
export const REVEAL_DISTANCE = "16px";
export const REVEAL_EASE = "cubic-bezier(0.16,1,0.3,1)";

/** Jeda antar item dalam satu kelompok. */
const STAGGER_MS = 70;

/**
 * Tanpa batas, daftar 12 item di Global Reach baru menggerakkan item terakhir
 * pada milidetik ke-840 — terasa lamban, bukan halus.
 */
const MAX_DELAY_MS = 350;

export function revealDelay(index: number): number {
  return Math.min(index * STAGGER_MS, MAX_DELAY_MS);
}
