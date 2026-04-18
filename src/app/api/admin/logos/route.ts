import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return false
  return true
}

// POST: Neues Logo hochladen
export async function POST(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const company = formData.get('company') as string
    const label = formData.get('label') as string

    if (!file || !company || !label) {
      return NextResponse.json({ error: 'Datei, Firma und Bezeichnung erforderlich' }, { status: 400 })
    }

    const validCompanies = ['raederlogistik', 'reifen-gerlach', 'rtg']
    if (!validCompanies.includes(company)) {
      return NextResponse.json({ error: 'Ungültige Firma' }, { status: 400 })
    }

    // Datei speichern
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${company}-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'logos', 'uploaded')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    const logo = await prisma.companyLogo.create({
      data: {
        company,
        label,
        filePath: `/logos/uploaded/${filename}`,
        isActive: false,
      },
    })

    return NextResponse.json(logo, { status: 201 })
  } catch (error) {
    console.error('Logo-Upload-Fehler:', error)
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }
}

// PATCH: Logo als aktiv setzen (deaktiviert alle anderen der Firma)
export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  try {
    const { id, isActive } = await request.json() as { id: string; isActive: boolean }
    const logo = await prisma.companyLogo.findUnique({ where: { id } })
    if (!logo) return NextResponse.json({ error: 'Logo nicht gefunden' }, { status: 404 })

    if (isActive) {
      // Alle anderen Logos dieser Firma deaktivieren
      await prisma.companyLogo.updateMany({
        where: { company: logo.company },
        data: { isActive: false },
      })
    }

    const updated = await prisma.companyLogo.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Logo-Update-Fehler:', error)
    return NextResponse.json({ error: 'Aktualisierung fehlgeschlagen' }, { status: 500 })
  }
}

// DELETE: Logo löschen
export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })

    const logo = await prisma.companyLogo.findUnique({ where: { id } })
    if (!logo) return NextResponse.json({ error: 'Logo nicht gefunden' }, { status: 404 })

    // Datei vom Server löschen (nur hochgeladene Logos)
    if (logo.filePath.startsWith('/logos/uploaded/')) {
      const fullPath = join(process.cwd(), 'public', logo.filePath)
      if (existsSync(fullPath)) await unlink(fullPath)
    }

    await prisma.companyLogo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logo-Lösch-Fehler:', error)
    return NextResponse.json({ error: 'Löschen fehlgeschlagen' }, { status: 500 })
  }
}
