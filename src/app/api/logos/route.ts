import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { COMPANY_CONFIG, CompanyKey } from '@/lib/signature-export'

// Standard-Logos aus COMPANY_CONFIG (immer verfügbar, ohne DB)
function getBuiltinLogos(company: CompanyKey) {
  const cfg = COMPANY_CONFIG[company]
  return [
    { id: `builtin-${company}`, company, label: 'Standard', filePath: cfg.logo, isActive: false, builtin: true },
  ]
}

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get('company') as CompanyKey | null

  try {
    const where = company ? { company } : {}
    const dbLogos = await prisma.companyLogo.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    })

    // Standard-Logos aus Config davorstellen
    const companies: CompanyKey[] = company ? [company] : ['raederlogistik', 'reifen-gerlach', 'rtg']
    const builtin = companies.flatMap(getBuiltinLogos)

    // Wenn kein DB-Logo aktiv ist, Standard-Logo als aktiv markieren
    const anyActive = dbLogos.some(l => l.isActive)
    const builtinWithActive = builtin.map(b => ({
      ...b,
      isActive: !anyActive && b.company === (company ?? b.company),
    }))

    return NextResponse.json([...builtinWithActive, ...dbLogos])
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Logos' }, { status: 500 })
  }
}
