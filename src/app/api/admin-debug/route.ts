import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: Record<string, unknown> = {}

  // Test 1: auth()
  try {
    const session = await auth()
    result.auth = session ? { ok: true, role: session.user?.role, email: session.user?.email } : { ok: false, session: null }
  } catch (e: unknown) {
    result.auth = { error: (e as Error)?.message, stack: (e as Error)?.stack }
  }

  // Test 2: prisma.user.count()
  try {
    const count = await prisma.user.count()
    result.prisma = { ok: true, userCount: count }
  } catch (e: unknown) {
    result.prisma = { error: (e as Error)?.message, stack: (e as Error)?.stack }
  }

  // Test 3: process.cwd() und NODE_ENV
  result.env = {
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  }

  return NextResponse.json(result, { status: 200 })
}
