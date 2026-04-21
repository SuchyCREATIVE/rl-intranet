import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, html, name } = await request.json()

    if (!to || !html) {
      return NextResponse.json({ error: 'E-Mail-Adresse und Signatur-HTML erforderlich' }, { status: 400 })
    }

    if (!process.env.SMTP_PASS) {
      return NextResponse.json({ error: 'SMTP nicht konfiguriert (SMTP_PASS fehlt)' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.scpreview.de',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Räderlogistik Intranet" <${process.env.SMTP_FROM || 'noreply@raederlogistik.de'}>`,
      to,
      subject: `Deine E-Mail-Signatur${name ? ': ' + name : ''} – Räderlogistik`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
    <div style="background:#1c1c1c;padding:20px 28px;">
      <p style="color:#ffffff;font-size:14px;font-weight:bold;margin:0;">Räderlogistik Intranet</p>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:4px 0 0 0;">Deine E-Mail-Signatur</p>
    </div>
    <div style="padding:28px;">
      <p style="font-size:14px;color:#333333;margin:0 0 8px 0;font-weight:bold;">So verwendest du die Signatur:</p>
      <ol style="font-size:13px;color:#555555;margin:0 0 24px 0;padding-left:20px;line-height:1.8;">
        <li>Markiere alles unterhalb der Linie (Klick vor das Logo, dann ⇧+Ende bis zum letzten Zeichen)</li>
        <li>Kopieren: <strong>⌘+C</strong></li>
        <li>Outlook → Einstellungen (⌘,) → Signaturen → Neue Signatur → ins Feld klicken → <strong>⌘+V</strong></li>
      </ol>
      <hr style="border:none;border-top:2px solid #DCFF0C;margin:0 0 24px 0;" />
      ${html}
    </div>
  </div>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send signature error:', error)
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
  }
}
