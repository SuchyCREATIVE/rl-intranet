import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { to, html, name } = await request.json()

    if (!to || !html) {
      return NextResponse.json({ error: 'E-Mail-Adresse und HTML erforderlich' }, { status: 400 })
    }

    // SMTP-Settings aus DB laden (wie der Admin-Test-Mail-Route)
    const settings = await prisma.settings.findMany({
      where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_secure'] } },
    })
    const map = Object.fromEntries(settings.map(s => [s.key, s.value]))

    if (!map['smtp_host']) {
      return NextResponse.json({ error: 'SMTP nicht konfiguriert' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: map['smtp_host'],
      port: parseInt(map['smtp_port'] ?? '587', 10),
      secure: map['smtp_secure'] === 'true',
      auth: { user: map['smtp_user'] ?? '', pass: map['smtp_pass'] ?? '' },
    })

    const from = map['smtp_from'] ?? map['smtp_user'] ?? ''

    await transporter.sendMail({
      from: `"Räderlogistik Intranet" <${from}>`,
      to,
      subject: `Deine E-Mail-Signatur${name ? ': ' + name : ''} – Räderlogistik`,
      // Nur die Signatur als Body – kein Wrapper, direkt kopierbar mit ⌘+A, ⌘+C
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">${html}</body></html>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send signature error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
