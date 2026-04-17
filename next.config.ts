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
    ]
    return [
      // Alle HTML-Seiten nie cachen (verhindert stale-chunk-Probleme nach Turbopack-Build)
      { source: '/(.*)', headers: noCache },
    ]
  },
}

export default nextConfig
