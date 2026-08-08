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
};

export default nextConfig;
