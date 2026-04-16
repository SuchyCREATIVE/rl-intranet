import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/debug-auth']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log('[MW] pathname:', pathname, 'isPublic:', isPublicPath(pathname))

  // Öffentliche Routen durchlassen
  if (isPublicPath(pathname)) {
    console.log('[MW] PUBLIC - passing through')
    return NextResponse.next()
  }

  // JWT-Token aus Cookie lesen (kein Prisma, kein Edge-Problem)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'rl-intranet-secret-2026',
    cookieName: '__Secure-authjs.session-token',
    secureCookie: true,
  })

  // Nicht eingeloggt → /login
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // /admin/* nur für Rolle "admin"
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
