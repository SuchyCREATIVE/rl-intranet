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

// ─── PATCH: User bearbeiten ───────────────────────────────────────────────────
const updateUserSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'redakteur']).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { id } = await params

  const targetUser = await prisma.user.findUnique({ where: { id } })
  if (!targetUser) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden.' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiger Request-Body.' }, { status: 400 })
  }

  const parsed = updateUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierungsfehler', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { username, email, password, role } = parsed.data

  // Duplikat-Check für username/email (außer für den User selbst)
  if (username || email) {
    const duplicate = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])] },
        ],
      },
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'E-Mail oder Benutzername bereits vergeben.' },
        { status: 409 }
      )
    }
  }

  const updateData: Record<string, unknown> = {}
  if (username) updateData.username = username
  if (email) updateData.email = email
  if (role) updateData.role = role
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 12)
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  })

  return NextResponse.json({ user: updated })
}

// ─── DELETE: User löschen ─────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { session } = guard
  const { id } = await params

  // Selbst-Löschung verhindern
  if (session.user.id === id) {
    return NextResponse.json(
      { error: 'Du kannst deinen eigenen Account nicht löschen.' },
      { status: 400 }
    )
  }

  const targetUser = await prisma.user.findUnique({ where: { id } })
  if (!targetUser) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden.' }, { status: 404 })
  }

  // Sessions des Users löschen (FK-Constraint)
  await prisma.session.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
