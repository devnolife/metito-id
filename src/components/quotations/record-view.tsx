'use client'

import { useEffect } from 'react'

/**
 * Mencatat kunjungan pelanggan tepat sekali per pemuatan halaman.
 *
 * Dilakukan dari klien, bukan saat render server, agar tidak ada mutasi di
 * dalam proses render dan agar prefetch tidak menghitung kunjungan palsu.
 */
export function RecordView({ token }: { token: string }) {
  useEffect(() => {
    let cancelled = false

    const record = async () => {
      try {
        await fetch(`/api/q/${encodeURIComponent(token)}/view`, { method: 'POST' })
      } catch {
        // Gagal mencatat kunjungan tidak boleh mengganggu pelanggan membaca.
      }
    }

    if (!cancelled) void record()

    return () => {
      cancelled = true
    }
  }, [token])

  return null
}
