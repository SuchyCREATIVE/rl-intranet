import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Login-Seite nicht cachen (verhindert nginx-Proxy-Cache mit veralteten Chunks)
        source: '/login',
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
