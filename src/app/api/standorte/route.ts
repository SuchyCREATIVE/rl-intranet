import { NextResponse } from 'next/server'

// In-Memory-Cache: 6 Stunden
let cache: { cities: string[]; fetchedAt: number } | null = null
const CACHE_TTL = 6 * 60 * 60 * 1000

// Fallback-Liste (falls Website nicht erreichbar)
const FALLBACK_CITIES = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf', 'Hilden',
  'München', 'Nürnberg', 'Offenburg', 'Paderborn', 'Rheinberg', 'Sangerhausen',
  'Steinen', 'Westerwald',
]

async function fetchCitiesFromWebsite(): Promise<string[]> {
  const res = await fetch('https://raederlogistik.de/standorte/', {
    next: { revalidate: 0 },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RL-Intranet/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const matches = [...html.matchAll(/premium-maps-info-title'>räderlogistik\.de<br>([^<]+)/g)]
  const cities = [...new Set(matches.map(m => m[1].trim()))].sort()
  return cities.length > 0 ? cities : FALLBACK_CITIES
}

export async function GET() {
  try {
    const now = Date.now()
    if (cache && now - cache.fetchedAt < CACHE_TTL) {
      return NextResponse.json({ cities: cache.cities, source: 'cache' })
    }
    const cities = await fetchCitiesFromWebsite()
    cache = { cities, fetchedAt: now }
    return NextResponse.json({ cities, source: 'live' })
  } catch {
    const cities = cache?.cities ?? FALLBACK_CITIES
    return NextResponse.json({ cities, source: 'fallback' })
  }
}
