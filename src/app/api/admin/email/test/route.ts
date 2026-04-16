import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
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

// ─── POST: Test-Mail senden ───────────────────────────────────────────────────
export async function POST() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { session } = guard
  const adminEmail = session.user?.email

  if (!adminEmail) {
    return NextResponse.json({ error: 'Admin-E-Mail nicht gefunden.' }, { status: 400 })
  }

  // SMTP-Settings aus DB laden
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_secure'],
      },
    },
  })

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  const host = map['smtp_host']
  if (!host) {
    return NextResponse.json(
      { error: 'SMTP ist nicht konfiguriert. Bitte zuerst die SMTP-Einstellungen speichern.' },
      { status: 400 }
    )
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(map['smtp_port'] ?? '587', 10),
    secure: map['smtp_secure'] === 'true',
    auth: {
      user: map['smtp_user'] ?? '',
      pass: map['smtp_pass'] ?? '',
    },
  })

  // Verbindung verifizieren
  try {
    await transporter.verify()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `SMTP-Verbindung fehlgeschlagen: ${message}` },
      { status: 500 }
    )
  }

  const from = map['smtp_from'] ?? map['smtp_user'] ?? ''

  await transporter.sendMail({
    from: `"RL Intranet" <${from}>`,
    to: adminEmail,
    subject: 'Test-E-Mail vom RL Intranet',
    text: `Hallo,\n\ndies ist eine Test-E-Mail vom RL Intranet.\n\nDie SMTP-Konfiguration funktioniert korrekt.\n\nGesendet am: ${new Date().toLocaleString('de-DE')}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Test-E-Mail vom RL Intranet</h2>
        <p>Hallo,</p>
        <p>dies ist eine Test-E-Mail vom RL Intranet.</p>
        <p style="color: #16a34a; font-weight: bold;">Die SMTP-Konfiguration funktioniert korrekt.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          Gesendet am: ${new Date().toLocaleString('de-DE')}
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true, sentTo: adminEmail })
}
