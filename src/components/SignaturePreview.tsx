'use client'

import { useEffect, useState } from 'react'
import { SignatureData, COMPANY_CONFIG, CompanyKey } from '@/lib/signature-export'

const FALLBACK_STANDORTE = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf',
  'Hilden', 'München', 'Nürnberg', 'Offenburg', 'Paderborn',
  'Rheinberg', 'Sangerhausen', 'Steinen', 'Westerwald',
]

const Y  = '#DCFF0C'
const LB = '#efefef'
const WH = '#ffffff'
const TD = '#222222'
const TG = '#888888'
const F  = 'Arial, Helvetica, sans-serif'

interface SignaturePreviewProps {
  data: SignatureData
  standorte?: string[]
}

export default function SignaturePreview({ data, standorte = [] }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website
  const street  = data.street  || company.address
  const zipCity = data.zipCity || company.city
  const cities  = standorte.length > 0 ? standorte : FALLBACK_STANDORTE
  const logoSrc = data.logoUrl || company.logo
  const legalKeys: CompanyKey[] = data.legalCompanies ?? [data.company]

  const initials = (data.firstName.charAt(0) + data.lastName.charAt(0)).toUpperCase()

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <table cellPadding={0} cellSpacing={0} border={0} width={600}
      style={{ maxWidth: 600, width: '100%', borderCollapse: 'collapse', fontSize: 0 }}>
      <tbody>
        <tr>

          {/* Linke Spalte: Weiß + Reifenspuren als Hintergrund */}
          <td width={155} style={{
            width: 155,
            backgroundColor: LB,
            backgroundImage: 'url(/logos/reifenspuren.png)',
            backgroundSize: '220%',
            backgroundPosition: '0% center',
            backgroundRepeat: 'no-repeat',
            verticalAlign: 'middle',
            textAlign: 'center',
            padding: '22px 12px',
          }}>
            {data.photoUrl ? (
              <div style={{ display: 'inline-block', backgroundColor: Y, borderRadius: 60, padding: 4, lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.photoUrl}
                  width={100} height={100}
                  alt={`${data.firstName} ${data.lastName}`}
                  style={{ display: 'block', width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ display: 'inline-block', backgroundColor: Y, borderRadius: 60, padding: 4, lineHeight: 0 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  backgroundColor: WH, fontFamily: F,
                  fontSize: 34, fontWeight: 'bold', color: '#555555',
                  textAlign: 'center', lineHeight: '100px',
                  display: 'block',
                }}>
                  {initials}
                </div>
              </div>
            )}
          </td>

          {/* Mittlere Spalte: Kontaktdaten */}
          <td style={{ backgroundColor: LB, verticalAlign: 'top', padding: '20px 20px 20px 22px' }}>

            <p style={{ fontFamily: F, fontSize: 16, fontWeight: 'bold', color: TD, margin: 0, lineHeight: 1.2 }}>
              {data.firstName} {data.lastName}
            </p>
            <p style={{ fontFamily: F, fontSize: 12, fontStyle: 'italic', color: TG, margin: '3px 0 0 0', lineHeight: 1.2 }}>
              {data.position}
            </p>

            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 14 }}>
              <tbody>
                {data.phone && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, paddingBottom: 4, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefon</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 4 }}>
                      <a href={`tel:${data.phone.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.phone}</a>
                    </td>
                  </tr>
                )}
                {data.fax && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, paddingBottom: 4, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefax</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 4 }}>{data.fax}</td>
                  </tr>
                )}
                {data.mobile && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, paddingBottom: 4, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mobil</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 4 }}>
                      <a href={`tel:${data.mobile.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.mobile}</a>
                    </td>
                  </tr>
                )}
                {data.whatsapp && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, paddingBottom: 4, whiteSpace: 'nowrap', verticalAlign: 'top' }}>WhatsApp</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 4 }}>
                      <a href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.whatsapp}</a>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mail</td>
                  <td style={{ fontFamily: F, fontSize: 12, color: TD }}>
                    <a href={`mailto:${data.email}`} style={{ color: TD, textDecoration: 'none' }}>{data.email}</a>
                  </td>
                </tr>
                {data.zoomLink && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 16, paddingTop: 4, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Zoom</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingTop: 4 }}>
                      <a href={data.zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: TD, textDecoration: 'none' }}>Meeting-Link</a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 14 }}>
              <tbody>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TD, fontWeight: 'bold', paddingBottom: 1 }}>{company.legalName}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 11, color: TG, fontStyle: 'italic', paddingBottom: 5 }}>{company.descriptor}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG, paddingBottom: 1 }}>{street}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG }}>{zipCity}</td></tr>
              </tbody>
            </table>

            <p style={{ fontFamily: F, fontSize: 12, margin: '12px 0 0 0' }}>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: TG, textDecoration: 'none' }}>{websiteUrl}</a>
            </p>

          </td>

          {/* Rechte Spalte: Logo */}
          <td width={130} style={{
            width: 130, backgroundColor: WH,
            verticalAlign: 'top', textAlign: 'center',
            padding: '20px 14px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={98} alt={company.legalName}
              style={{ display: 'block', width: 98, height: 'auto', margin: '0 auto' }} />
          </td>

          {/* Gelber Akzentstreifen */}
          <td width={5} style={{ width: 5, minWidth: 5, backgroundColor: Y }} />

        </tr>

        {/* Standorte */}
        {data.showStandorte !== false && (
          <tr>
            <td colSpan={4} style={{ backgroundColor: Y, padding: '9px 18px', borderTop: '1px solid #c8d400' }}>
              <span style={{ fontFamily: F, fontSize: 11, color: '#111111' }}>
                <strong style={{ fontWeight: 700 }}>Für Sie vor Ort:&nbsp;</strong>
                {cities.join('\u00a0\u00a0|\u00a0\u00a0')}
              </span>
            </td>
          </tr>
        )}

        {/* Rechtliche Angaben (je Firma eine Zeile) */}
        {legalKeys.map(key => {
          const c = COMPANY_CONFIG[key]
          return (
            <tr key={key}>
              <td colSpan={4} style={{ backgroundColor: '#f9f9f9', padding: '6px 18px', borderTop: '1px solid #e8e8e8' }}>
                <span style={{ fontFamily: F, fontSize: 10, color: '#aaaaaa', lineHeight: 1.4, display: 'block' }}>
                  <strong style={{ color: '#888888' }}>{c.legalName}</strong>
                  &nbsp;&nbsp;·&nbsp;&nbsp;Geschäftsführer: {c.legal.ceo}
                  &nbsp;&nbsp;·&nbsp;&nbsp;Sitz der Gesellschaft: Hilden
                  &nbsp;&nbsp;·&nbsp;&nbsp;{c.legal.court}
                  &nbsp;&nbsp;·&nbsp;&nbsp;Steuernummer: {c.legal.taxNo}
                  &nbsp;&nbsp;·&nbsp;&nbsp;USt.-ID: {c.legal.vatId}
                </span>
              </td>
            </tr>
          )
        })}

        {/* Banner (mehrere) */}
        {(data.banners ?? []).map((url, i) => (
          <tr key={i}>
            <td colSpan={4} style={{ padding: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Banner ${i + 1}`}
                style={{ display: 'block', maxWidth: 600, width: '100%', height: 'auto' }} />
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}
