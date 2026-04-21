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
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
    <div style="background:#1c1c1c;padding:20px 28px;">
      <p style="color:#ffffff;font-size:14px;font-weight:bold;margin:0;">Räderlogistik Intranet</p>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:4px 0 0 0;">Deine E-Mail-Signatur</p>
    </div>
    <div style="padding:28px;">
      <p style="font-size:14px;color:#333333;margin:0 0 8px 0;font-weight:bold;">So verwendest du die Signatur in Outlook Mac:</p>
      <ol style="font-size:13px;color:#555555;margin:0 0 24px 0;padding-left:20px;line-height:1.8;">
        <li>Klicke direkt vor das Foto unten, dann <strong>⌘+A</strong> (alles markieren)</li>
        <li>Kopieren: <strong>⌘+C</strong></li>
        <li>Outlook → Einstellungen (⌘,) → Signaturen → Neue Signatur → ins Feld klicken → <strong>⌘+V</strong></li>
      </ol>
      <hr style="border:none;border-top:2px solid #DCFF0C;margin:0 0 24px 0;" />
      ${html}
    </div>
  </div>
</body></html>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send signature error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
