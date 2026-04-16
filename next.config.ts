import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/signin',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/signin',
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
