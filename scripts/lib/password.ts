import { randomInt } from 'crypto'

/**
 * Pembuat kata sandi awal untuk akun yang dibuat atau direset lewat skrip.
 *
 * Abjadnya sengaja dipersempit karena sandi ini dibacakan atau disalin lewat
 * pesan sebelum pemiliknya menggantinya sendiri:
 *
 * - Tanpa `-` dan `_`. Aplikasi pesan dan pengolah kata gemar mengubah tanda
 *   hubung menjadi en-dash, sehingga sandi yang disalin tidak lagi sama dengan
 *   yang tersimpan.
 * - Tanpa 0/O/o dan 1/l/I. Pasangan karakter ini nyaris tak terbedakan pada
 *   banyak fonta, dan salah satu ujungnya selalu salah ketik.
 *
 * Sisa abjadnya 56 karakter; pada panjang 16 entropinya sekitar 93 bit, jauh
 * di atas kebutuhan sandi sementara.
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

export const PASSWORD_LENGTH = 16

/** Kata sandi acak yang aman disalin lewat pesan. */
export function generatePassword(length: number = PASSWORD_LENGTH): string {
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[randomInt(ALPHABET.length)]
  }
  return out
}
