'use client'

import { useEffect, useState } from 'react'
import { SignatureData, COMPANY_CONFIG } from '@/lib/signature-export'

const FALLBACK_STANDORTE = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf',
  'Hilden', 'München', 'Nürnberg', 'Offenburg', 'Paderborn',
  'Rheinberg', 'Sangerhausen', 'Steinen', 'Westerwald',
]

const Y  = '#DCFF0C'
const DB = '#1c1c1c'
const LB = '#efefef'
const WH = '#ffffff'   // Rechte Spalte weiß (wie PDF-Vorlage)
const TD = '#222222'
const TG = '#666666'
const F  = 'Arial, Helvetica, sans-serif'

interface SignaturePreviewProps {
  data: SignatureData
  standorte?: string[]
}

export default function SignaturePreview({ data, standorte = [] }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website
  const cities = standorte.length > 0 ? standorte : FALLBACK_STANDORTE
  const logoSrc = data.logoUrl || company.logo

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <table cellPadding={0} cellSpacing={0} border={0} width={600}
      style={{ maxWidth: 600, width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>

          {/* ── Linke Spalte: Dunkel + Foto ── */}
          <td width={155} style={{
            width: 155, backgroundColor: DB,
            verticalAlign: 'middle', textAlign: 'center',
            padding: '20px 14px',
          }}>
            {data.photoUrl && (
              <div style={{
                display: 'inline-block',
                backgroundColor: Y,
                borderRadius: 54,
                padding: 3,
                lineHeight: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.photoUrl}
                  width={96} height={96}
                  alt={`${data.firstName} ${data.lastName}`}
                  style={{ display: 'block', width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            )}
          </td>

          {/* ── Mittlere Spalte: Kontakt ── */}
          <td style={{
            backgroundColor: LB, verticalAlign: 'top',
            padding: '18px 18px 18px 20px',
          }}>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 'bold', color: TD, lineHeight: 1.2, margin: 0 }}>
              {data.firstName} {data.lastName}
            </div>
            <div style={{ fontFamily: F, fontSize: 13, fontStyle: 'italic', color: TG, lineHeight: 1.2, margin: '2px 0 0 0' }}>
              {data.position}
            </div>

            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 12 }}>
              <tbody>
                {data.phone && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 12, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefon</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>
                      <a href={`tel:${data.phone.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.phone}</a>
                    </td>
                  </tr>
                )}
                {data.fax && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 12, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefax</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>{data.fax}</td>
                  </tr>
                )}
                {data.mobile && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 12, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mobil</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>
                      <a href={`tel:${data.mobile.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.mobile}</a>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 12, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mail</td>
                  <td style={{ fontFamily: F, fontSize: 12, color: TD }}>
                    <a href={`mailto:${data.email}`} style={{ color: TD, textDecoration: 'none' }}>{data.email}</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 12 }}>
              <tbody>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 2 }}>{company.legalName}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG, paddingBottom: 2 }}>{company.address}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG }}>{company.city}</td></tr>
              </tbody>
            </table>

            <div style={{ marginTop: 10, fontFamily: F, fontSize: 12 }}>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                style={{ color: TG, textDecoration: 'none' }}>{websiteUrl}</a>
            </div>
          </td>

          {/* ── Rechte Spalte: Logo (weiß wie PDF-Vorlage) ── */}
          <td width={120} style={{
            width: 120, backgroundColor: WH,
            verticalAlign: 'top', textAlign: 'center',
            padding: '18px 14px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              width={92} height="auto"
              alt={company.legalName}
              style={{ display: 'block', width: 92, height: 'auto', margin: '0 auto' }}
            />
          </td>

        </tr>

        {/* ── Standorte-Zeile ── */}
        {data.showStandorte !== false && (
          <tr>
            <td colSpan={3} style={{
              backgroundColor: DB,
              padding: '8px 14px',
              borderTop: `2px solid ${Y}`,
            }}>
              <span style={{ fontFamily: F, fontSize: 11, color: '#aaa' }}>
                <strong style={{ color: Y, fontWeight: 600 }}>Für Sie vor Ort:&nbsp;</strong>
                {cities.join('\u00a0\u00a0|\u00a0\u00a0')}
              </span>
            </td>
          </tr>
        )}

        {/* ── Banner (optional) ── */}
        {data.bannerUrl && (
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.bannerUrl} alt="Banner"
                style={{ display: 'block', maxWidth: 600, width: '100%', height: 'auto' }} />
            </td>
          </tr>
        )}

      </tbody>
    </table>
  )
}
