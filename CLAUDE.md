# CLAUDE.md – rl-intranet

## Projekt
- Kunde: Räderlogistik.de / Reifen Gerlach GmbH
- Branche: Reifenhandel / Franchise-System
- Live-Domain: intern.raederlogistik.de (geplant)
- Vorschau: https://rl-intranet.scpreview.de
- GitHub: https://github.com/SuchyCREATIVE/rl-intranet

## Zweck
Intranet-System als Ersatz für das bestehende WordPress-Intranet (intern.raederlogistik.de/wp-login.php).
Erster Showcase für den Kunden – Auftrag noch nicht erteilt.

## Tech-Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS v4 (Konfig: globals.css @theme Block – KEINE tailwind.config.ts!)
- Framer Motion, Lucide-React
- Prisma 7 + SQLite (better-sqlite3)
  ⚠️ Import: @/generated/prisma/client (NICHT @prisma/client!)
- NextAuth v5 (beta)
- Nodemailer (SMTP)
- bcryptjs
- qrcode (für Signatur-QR-Codes)

## Lokale Entwicklung
- URL: http://rl-intranet.test (Laravel Herd) oder http://localhost:3002
- Port: 3002
- Dev-Server: npm run dev
- DB-Studio: npm run db:studio

## Deploy
- Preview: ./deploy.sh preview
- Live:    ./deploy.sh live (erst nach Auftragserteilung!)
- SSH: web6@hosting.suchycreative.de
- Preview-Pfad: /var/www/vhosts/web6.d2-1053.ncsrv.de/rl-intranet.scpreview.de/
- PM2-Prozess: rl-intranet

## Initial-Admin
- User: dennis / dennis@suchycreative.de / password (bitte ändern!)
- DB Seed: npm run db:seed

## Kritische Hinweise
- Prisma 7: Import aus @/generated/prisma/client (NICHT @prisma/client)
- TailwindCSS v4: Konfiguration NUR in globals.css via @theme { ... }
- Port: 3002 (nicht 3001 – der ist von VS Code belegt)
- Nach Schema-Änderung: npx prisma generate && npx prisma db push

## Signaturen-Feature
Zwei Firmen:
1. räderlogistik.de – Logo: /logos/raederlogistik-Logo-Rand.svg
2. Reifen Gerlach GmbH – Logo: /logos/raederlogistik-Logo-Gerlach-Rand.svg

Outlook-kompatibel: Nur Tabellen-Layout, inline Styles, keine modernen CSS-Features.

## Projektphase
- [x] Grundstruktur
- [x] Next.js Setup + Prisma + Auth
- [ ] Design & Frontend (Login, Sidebar, Dashboard)
- [ ] Signaturen-Generator
- [ ] Admin-Bereich
- [ ] Preview testen
- [ ] Präsentation beim Kunden
- [ ] Live-Deploy (nach Auftragserteilung)

## Zuletzt gemacht
- Projekt-Setup: Next.js 15, Prisma 7, NextAuth v5, alle Dependencies
- GitHub-Repo angelegt: SuchyCREATIVE/rl-intranet
- Logos und Assets importiert

## Als nächstes
- Login-Seite gestalten
- Sidebar + Dashboard aufbauen
- Signaturen-Generator implementieren
