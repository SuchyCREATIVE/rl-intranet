import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 Minuten

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count += 1
  return true
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  message: z.string().min(1, 'Nachricht ist erforderlich').max(5000),
  website: z.string().optional(), // Honeypot
})

// ─── SMTP-Settings aus DB ─────────────────────────────────────────────────────
async function getSmtpSettings() {
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_secure'],
      },
    },
  })

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return {
    host: map['smtp_host'] ?? '',
    port: parseInt(map['smtp_port'] ?? '587', 10),
    secure: map['smtp_secure'] === 'true',
    user: map['smtp_user'] ?? '',
    pass: map['smtp_pass'] ?? '',
    from: map['smtp_from'] ?? map['smtp_user'] ?? '',
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // Rate Limit prüfen
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiger Request-Body.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierungsfehler', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { name, email, message, website } = parsed.data

  // Honeypot: Wenn "website" ausgefüllt → Bot, aber 200 zurückgeben
  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  // SMTP-Konfiguration aus DB laden
  const smtp = await getSmtpSettings()

  if (!smtp.host) {
    return NextResponse.json({ error: 'SMTP nicht konfiguriert.' }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })

  await transporter.sendMail({
    from: `"Kontaktformular" <${smtp.from}>`,
    to: smtp.from,
    replyTo: email,
    subject: `Neue Kontaktanfrage von ${name}`,
    text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    html: `
      <h2>Neue Kontaktanfrage</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr />
      <p><strong>Nachricht:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  })

  return NextResponse.json({ success: true })
}
