'use client'

import { useEffect, useState } from 'react'
import { SignatureData } from '@/lib/signature-export'

export const COMPANY_CONFIG = {
  'raederlogistik': {
    displayName: 'räderlogistik.de',
    tagline: 'Der Serviceprovider für das Autohaus',
    subtext: 'c/o Reifen Gerlach GmbH',
    legalName: 'Räderlogistik Franchise GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand.svg',
    ustId: '',  // Wird vom Admin gepflegt
    legalFooter: 'Räderlogistik Franchise GmbH | Düsseldorfer Straße 64 | 40721 Hilden',
  },
  'reifen-gerlach': {
    displayName: 'Reifen Gerlach GmbH',
    tagline: 'Ihr Reifen- und Autoservice',
    subtext: '',
    legalName: 'Reifen Gerlach GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand.svg',
    ustId: 'DE278645994',
    legalFooter: 'Reifen Gerlach GmbH | Geschäftsführer: Sven Gerlach und Ingo Grimm | Sitz der Gesellschaft: Hilden | Amtsgericht Düsseldorf HRB66350 | Steuernummer: 135/5759/1668 | USt.-ID: DE278645994',
  },
}

const NEON = '#EAFF00'
const GRAY = '#7A7A7A'
const DARK = '#222222'
const FONT = "'Roboto', Arial, sans-serif"

interface SignaturePreviewProps {
  data: SignatureData
  standorte?: string[]
}

export default function SignaturePreview({ data, standorte = [] }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const citiesLine = standorte.length > 0
    ? standorte.join(' | ')
    : 'Augsburg | Dresden | Erkrath | Hamburg | Hermsdorf | Hilden | München | Nürnberg | Offenburg | Paderborn | Rheinberg | Sangerhausen | Steinen | Westerwald'

  return (
    <div style={{ fontFamily: FONT, lineHeight: 1.4, color: DARK }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ width: '100%', maxWidth: 600, fontFamily: FONT, borderCollapse: 'collapse' }}
      >
        <tbody>

          {/* ── Row 1: Name + Logo ── */}
          <tr>
            <td style={{ verticalAlign: 'top', paddingBottom: 12 }}>
              <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    {/* Photo (optional) */}
                    {data.photoUrl && (
                      <td width={52} style={{ width: 52, verticalAlign: 'top', paddingRight: 12 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: `2px solid ${NEON}`,
                          display: 'inline-block',
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={data.photoUrl}
                            width={48}
                            height={48}
                            alt={`${data.firstName} ${data.lastName}`}
                            style={{ width: 48, height: 48, objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      </td>
                    )}

                    {/* Name + Position */}
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{
                        fontFamily: FONT,
                        fontSize: 18,
                        fontWeight: 700,
                        color: DARK,
                        lineHeight: 1.2,
                      }}>
                        {data.firstName} {data.lastName}
                      </div>
                      <div style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        color: GRAY,
                        fontStyle: 'italic',
                        marginTop: 3,
                      }}>
                        {data.position}
                      </div>
                    </td>

                    {/* Logo */}
                    <td width={120} style={{ width: 120, verticalAlign: 'top', textAlign: 'right' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company.logo}
                        width={110}
                        height={38}
                        alt={company.legalName}
                        style={{ display: 'inline-block', maxWidth: 110, height: 'auto' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ── Divider ── */}
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ height: 2, backgroundColor: NEON, marginBottom: 10 }} />
            </td>
          </tr>

          {/* ── Row 2: Standorte ── */}
          {data.showStandorte !== false && (
            <tr>
              <td style={{ paddingBottom: 10 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600 }}>Für Sie vor Ort:</span>{' '}
                  {citiesLine}
                </div>
              </td>
            </tr>
          )}

          {/* ── Thin divider ── */}
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ height: 1, backgroundColor: '#e5e5e5', marginBottom: 10 }} />
            </td>
          </tr>

          {/* ── Row 3: Contact ── */}
          <tr>
            <td style={{ paddingBottom: 10 }}>
              <table cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                  {data.phone && (
                    <tr>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: GRAY, paddingRight: 8, paddingBottom: 2, whiteSpace: 'nowrap' }}>Telefon</td>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: DARK, paddingBottom: 2 }}>
                        <a href={`tel:${data.phone.replace(/\s/g, '')}`} style={{ color: DARK, textDecoration: 'none' }}>{data.phone}</a>
                      </td>
                    </tr>
                  )}
                  {data.mobile && (
                    <tr>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: GRAY, paddingRight: 8, paddingBottom: 2, whiteSpace: 'nowrap' }}>Mobil</td>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: DARK, paddingBottom: 2 }}>
                        <a href={`tel:${data.mobile.replace(/\s/g, '')}`} style={{ color: DARK, textDecoration: 'none' }}>{data.mobile}</a>
                      </td>
                    </tr>
                  )}
                  {data.fax && (
                    <tr>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: GRAY, paddingRight: 8, paddingBottom: 2, whiteSpace: 'nowrap' }}>Telefax</td>
                      <td style={{ fontFamily: FONT, fontSize: 12, color: DARK, paddingBottom: 2 }}>{data.fax}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ fontFamily: FONT, fontSize: 12, color: GRAY, paddingRight: 8, paddingBottom: 2, whiteSpace: 'nowrap' }}>E-Mail</td>
                    <td style={{ fontFamily: FONT, fontSize: 12, paddingBottom: 2 }}>
                      <a href={`mailto:${data.email}`} style={{ color: DARK, textDecoration: 'none' }}>{data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: FONT, fontSize: 12, color: GRAY, paddingRight: 8, whiteSpace: 'nowrap' }}>Web</td>
                    <td style={{ fontFamily: FONT, fontSize: 12 }}>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: DARK, textDecoration: 'none', fontStyle: 'italic' }}>{websiteUrl}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ── Thin divider ── */}
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ height: 1, backgroundColor: '#e5e5e5', marginBottom: 10 }} />
            </td>
          </tr>

          {/* ── Row 4: Company info ── */}
          <tr>
            <td style={{ paddingBottom: data.bannerUrl ? 12 : 0 }}>
              <div style={{ fontFamily: FONT, fontSize: 12, color: DARK, fontWeight: 600 }}>{company.displayName}</div>
              {company.tagline && (
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>{company.tagline}</div>
              )}
              {company.subtext && (
                <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY }}>{company.subtext}</div>
              )}
              <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY, marginTop: 2 }}>
                {company.address} · {company.city}
              </div>
            </td>
          </tr>

          {/* ── Row 5: Banner (optional) ── */}
          {data.bannerUrl && (
            <tr>
              <td style={{ paddingBottom: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.bannerUrl}
                  alt="Banner"
                  style={{ display: 'block', maxWidth: 600, width: '100%', height: 'auto' }}
                />
              </td>
            </tr>
          )}

          {/* ── Divider vor Footer ── */}
          <tr>
            <td style={{ paddingTop: data.bannerUrl ? 0 : 10 }}>
              <div style={{ height: 2, backgroundColor: NEON, marginBottom: 8 }} />
            </td>
          </tr>

          {/* ── Row 6: Legal Footer ── */}
          <tr>
            <td>
              <div style={{
                fontFamily: FONT,
                fontSize: 10,
                color: GRAY,
                lineHeight: 1.6,
              }}>
                {company.legalFooter}
                {company.ustId && ` | USt.-ID: ${company.ustId}`}
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}
