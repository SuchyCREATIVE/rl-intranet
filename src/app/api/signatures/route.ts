import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.signatureTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching signature templates:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Signaturen' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      company,
      firstName,
      lastName,
      position,
      phone,
      fax,
      mobile,
      email,
      website,
      photoUrl,
    } = body

    if (!company || !firstName || !lastName || !position || !email) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen: company, firstName, lastName, position, email' },
        { status: 400 }
      )
    }

    if (company !== 'raederlogistik' && company !== 'reifen-gerlach') {
      return NextResponse.json(
        { error: 'Ungültiger Firmenwert. Erlaubt: raederlogistik, reifen-gerlach' },
        { status: 400 }
      )
    }

    const template = await prisma.signatureTemplate.create({
      data: {
        company,
        firstName,
        lastName,
        position,
        phone: phone || null,
        fax: fax || null,
        mobile: mobile || null,
        email,
        website: website || null,
        photoUrl: photoUrl || null,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating signature template:', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern der Signatur' },
      { status: 500 }
    )
  }
}
