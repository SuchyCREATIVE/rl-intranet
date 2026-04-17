import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/auth', destination: '/login', permanent: false },
      { source: '/signin', destination: '/login', permanent: false },
    ]
  },
  async headers() {
    const noCache = [
      { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
      { key: 'Pragma', value: 'no-cache' },
      { key: 'Expires', value: '0' },
      // nginx-spezifisch: überschreibt proxy_ignore_headers Cache-Control
      { key: 'X-Accel-Expires', value: '0' },
    ]
    return [
      // Alle Seiten-Routen nie cachen (nicht /_next/static – die haben Content-Hash-Namen)
      {
        source: '/((?!_next/static|_next/image|favicon).*)',
        headers: noCache,
      },
    ]
  },
}

export default nextConfig
