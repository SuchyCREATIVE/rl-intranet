import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = await bcrypt.hash('password', 12)

  await prisma.user.upsert({
    where: { email: 'dennis@suchycreative.de' },
    update: {},
    create: {
      username: 'dennis',
      email: 'dennis@suchycreative.de',
      passwordHash: hash,
      role: 'admin',
    },
  })

  const smtpDefaults = [
    { key: 'smtp_host',      value: 'mail.scpreview.de' },
    { key: 'smtp_port',      value: '587' },
    { key: 'smtp_user',      value: 'website@scpreview.de' },
    { key: 'smtp_pass',      value: '' },
    { key: 'smtp_from',      value: 'noreply@raederlogistik.de' },
    { key: 'smtp_from_name', value: 'Räderlogistik Intranet' },
  ]

  for (const s of smtpDefaults) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }

  console.log('✅ Admin dennis@suchycreative.de angelegt')
  console.log('✅ SMTP-Startdaten gesetzt')
}

main().finally(() => prisma.$disconnect())
