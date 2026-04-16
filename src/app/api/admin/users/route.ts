import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Session } from 'next-auth'

// ─── Auth Guard ───────────────────────────────────────────────────────────────
async function requireAdmin(): Promise<
  { ok: true; session: Session } | { ok: false; response: NextResponse }
> {
  const session = await auth()
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ error: 'Nicht authentifiziert.' }, { status: 401 }) }
  }
  if (session.user.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 }) }
  }
  return { ok: true, session }
}

// ─── GET: Alle User listen ────────────────────────────────────────────────────
export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ users })
}

// ─── POST: User anlegen ───────────────────────────────────────────────────────
const createUserSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  role: z.enum(['admin', 'redakteur']).default('redakteur'),
})

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiger Request-Body.' }, { status: 400 })
  }

  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierungsfehler', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { username, email, password, role } = parsed.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'E-Mail oder Benutzername bereits vergeben.' },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { username, email, passwordHash, role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ user }, { status: 201 })
}
