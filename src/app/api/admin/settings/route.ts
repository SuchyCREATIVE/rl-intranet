import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Session } from 'next-auth'

const SMTP_KEYS = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_secure'] as const

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

// ─── GET: SMTP-Settings ───────────────────────────────────────────────────────
export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const settings = await prisma.settings.findMany({
    where: { key: { in: [...SMTP_KEYS] } },
  })

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  // Passwort nicht im Klartext zurückgeben – nur ob gesetzt
  return NextResponse.json({
    settings: {
      smtp_host: map['smtp_host'] ?? '',
      smtp_port: map['smtp_port'] ?? '587',
      smtp_user: map['smtp_user'] ?? '',
      smtp_pass: map['smtp_pass'] ? '••••••••' : '',
      smtp_from: map['smtp_from'] ?? '',
      smtp_secure: map['smtp_secure'] ?? 'false',
    },
  })
}

// ─── POST: SMTP-Settings speichern ───────────────────────────────────────────
const settingsSchema = z.object({
  smtp_host: z.string().min(1, 'SMTP-Host ist erforderlich'),
  smtp_port: z.string().regex(/^\d+$/, 'Port muss eine Zahl sein').default('587'),
  smtp_user: z.string().min(1, 'SMTP-Benutzer ist erforderlich'),
  smtp_pass: z.string().optional(), // optional: leer = nicht ändern
  smtp_from: z.string().email('Ungültige Absender-E-Mail'),
  smtp_secure: z.enum(['true', 'false']).default('false'),
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

  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierungsfehler', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_secure } = parsed.data

  const upserts: Array<{ key: string; value: string }> = [
    { key: 'smtp_host', value: smtp_host },
    { key: 'smtp_port', value: smtp_port },
    { key: 'smtp_user', value: smtp_user },
    { key: 'smtp_from', value: smtp_from },
    { key: 'smtp_secure', value: smtp_secure },
  ]

  // Passwort nur updaten wenn ein neues angegeben wurde (nicht Platzhalter-Wert)
  if (smtp_pass && smtp_pass !== '••••••••' && smtp_pass.length > 0) {
    upserts.push({ key: 'smtp_pass', value: smtp_pass })
  }

  await prisma.$transaction(
    upserts.map(({ key, value }) =>
      prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )

  return NextResponse.json({ success: true })
}
