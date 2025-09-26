/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Ensure static files can be served
  async rewrites() {
    return [
      // Keep original static file serving as fallback
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
      {
        source: '/certificates/:path*',
        destination: '/api/certificates/:path*',
      },
      {
        source: '/documents/:path*',
        destination: '/api/documents/:path*',
      },
    ]
  },
}

export default nextConfig