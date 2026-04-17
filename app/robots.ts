import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Intranet – niemals crawlen
  return {
    rules: { userAgent: '*', disallow: '/' },
  }
}
