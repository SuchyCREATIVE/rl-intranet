import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_COMPANIES = ['raederlogistik', 'reifen-gerlach', 'rtg']

export async function GET() {
  try {
    const templates = await prisma.signatureTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching signature templates:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Signaturen' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, company,
      firstName, lastName, position,
      phone, fax, mobile, whatsapp,
      email, website,
      photoUrl, logoUrl,
      banners,          // string[] → wird als JSON gespeichert
      showStandorte,
      legalCompanies,   // CompanyKey[] → wird als JSON gespeichert
      street, zipCity,
      zoomLink,
    } = body

    if (!company || !firstName || !lastName || !position || !email) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }
    if (!VALID_COMPANIES.includes(company)) {
      return NextResponse.json({ error: 'Ungültiger Firmenwert' }, { status: 400 })
    }

    const template = await prisma.signatureTemplate.create({
      data: {
        name: name || null,
        company,
        firstName,
        lastName,
        position,
        phone: phone || null,
        fax: fax || null,
        mobile: mobile || null,
        whatsapp: whatsapp || null,
        email,
        website: website || null,
        photoUrl: photoUrl || null,
        logoUrl: logoUrl || null,
        banners: Array.isArray(banners) ? JSON.stringify(banners) : (banners || null),
        showStandorte: showStandorte !== false,
        legalCompanies: Array.isArray(legalCompanies) ? JSON.stringify(legalCompanies) : (legalCompanies || null),
        street: street || null,
        zipCity: zipCity || null,
        zoomLink: zoomLink || null,
      },
    })
    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating signature template:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name, company,
      firstName, lastName, position,
      phone, fax, mobile, whatsapp,
      email, website,
      photoUrl, logoUrl,
      banners,
      showStandorte,
      legalCompanies,
      street, zipCity,
      zoomLink,
    } = body

    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })
    if (!VALID_COMPANIES.includes(company)) {
      return NextResponse.json({ error: 'Ungültiger Firmenwert' }, { status: 400 })
    }

    const template = await prisma.signatureTemplate.update({
      where: { id },
      data: {
        name: name || null,
        company,
        firstName,
        lastName,
        position,
        phone: phone || null,
        fax: fax || null,
        mobile: mobile || null,
        whatsapp: whatsapp || null,
        email,
        website: website || null,
        photoUrl: photoUrl || null,
        logoUrl: logoUrl || null,
        banners: Array.isArray(banners) ? JSON.stringify(banners) : (banners || null),
        showStandorte: showStandorte !== false,
        legalCompanies: Array.isArray(legalCompanies) ? JSON.stringify(legalCompanies) : (legalCompanies || null),
        street: street || null,
        zipCity: zipCity || null,
        zoomLink: zoomLink || null,
      },
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating signature template:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })
    await prisma.signatureTemplate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting signature template:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
