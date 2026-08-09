import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // File statis yang diunggah admin dilayani lewat API sebagai fallback
  // (public/ tetap diprioritaskan karena rewrites ini bertipe afterFiles).
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "/api/images/:path*",
      },
      {
        source: "/certificates/:path*",
        destination: "/api/certificates/:path*",
      },
      {
        source: "/documents/:path*",
        destination: "/api/documents/:path*",
      },
    ];
  },

  /**
   * Dokumen HTML harus selalu divalidasi ulang ke server.
   *
   * Setiap build menghasilkan nama berkas JS dan CSS yang baru, sedangkan
   * berkas build lama ikut terhapus. Bila peramban menyimpan HTML lama, ia
   * akan meminta aset yang sudah tidak ada: gayanya hilang dan skripnya gagal
   * dimuat, sehingga tombol tidak bereaksi sama sekali. Next.js sendiri hanya
   * mengirim `s-maxage` yang berlaku untuk CDN, sehingga peramban bebas
   * menyimpan halaman selama yang ia mau.
   *
   * `max-age=0, must-revalidate` tetap memakai ETag, jadi kunjungan berikutnya
   * biasanya hanya menerima 304 tanpa mengunduh ulang. Aset di /_next/static
   * sengaja dikecualikan karena namanya sudah mengandung hash dan aman
   * disimpan selamanya.
   */
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
