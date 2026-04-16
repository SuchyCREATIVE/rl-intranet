import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/login', destination: '/auth', permanent: false },
      { source: '/signin', destination: '/auth', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: '/auth',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
