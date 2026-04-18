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

  const initials = (data.firstName.charAt(0) + data.lastName.charAt(0)).toUpperCase()

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <table cellPadding={0} cellSpacing={0} border={0} width={600}
      style={{ maxWidth: 600, width: '100%', borderCollapse: 'collapse', fontSize: 0 }}>
      <tbody>

        {/* ── Hauptzeile ── */}
        <tr>

          {/* Linke Spalte: Dunkel, Foto oder Initialen */}
          <td width={155} style={{
            width: 155, backgroundColor: DB,
            verticalAlign: 'middle', textAlign: 'center',
            padding: '22px 14px',
          }}>
            {data.photoUrl ? (
              <div style={{ display: 'inline-block', backgroundColor: Y, borderRadius: 56, padding: 4, lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.photoUrl}
                  width={96} height={96}
                  alt={`${data.firstName} ${data.lastName}`}
                  style={{ display: 'block', width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ display: 'inline-block', backgroundColor: Y, borderRadius: 56, padding: 4, lineHeight: 0 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  backgroundColor: DB, fontFamily: F,
                  fontSize: 32, fontWeight: 'bold', color: Y,
                  textAlign: 'center', lineHeight: '96px',
                  display: 'block',
                }}>
                  {initials}
                </div>
              </div>
            )}
          </td>

          {/* Mittlere Spalte: Kontaktdaten */}
          <td style={{ backgroundColor: LB, verticalAlign: 'top', padding: '20px 20px 20px 22px' }}>

            {/* Name */}
            <p style={{ fontFamily: F, fontSize: 16, fontWeight: 'bold', color: TD, margin: 0, lineHeight: 1.2 }}>
              {data.firstName} {data.lastName}
            </p>
            {/* Position */}
            <p style={{ fontFamily: F, fontSize: 12, fontStyle: 'italic', color: TG, margin: '3px 0 0 0', lineHeight: 1.2 }}>
              {data.position}
            </p>

            {/* Kontaktzeilen */}
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

            {/* Firmenadresse */}
            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 14 }}>
              <tbody>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 1, fontWeight: 'bold' }}>{company.legalName}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 11, color: TG, paddingBottom: 5, fontStyle: 'italic' }}>{company.descriptor}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG, paddingBottom: 1 }}>{street}</td></tr>
                <tr><td style={{ fontFamily: F, fontSize: 12, color: TG }}>{zipCity}</td></tr>
              </tbody>
            </table>

            {/* Website */}
            <p style={{ fontFamily: F, fontSize: 12, margin: '12px 0 0 0' }}>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: TG, textDecoration: 'none' }}>{websiteUrl}</a>
            </p>

          </td>

          {/* Rechte Spalte: Logo (weiß) */}
          <td width={130} style={{
            width: 130, backgroundColor: WH,
            verticalAlign: 'top', textAlign: 'center',
            padding: '20px 14px 20px 16px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              width={98}
              alt={company.legalName}
              style={{ display: 'block', width: 98, height: 'auto', margin: '0 auto' }}
            />
          </td>

          {/* Gelber Akzentstreifen rechts */}
          <td width={5} style={{ width: 5, minWidth: 5, backgroundColor: Y }} />

        </tr>

        {/* ── Standorte-Zeile ── */}
        {data.showStandorte !== false && (
          <tr>
            <td colSpan={4} style={{ backgroundColor: DB, padding: '9px 18px', borderTop: `3px solid ${Y}` }}>
              <span style={{ fontFamily: F, fontSize: 11, color: '#999999' }}>
                <strong style={{ color: Y, fontWeight: 700 }}>Für Sie vor Ort:&nbsp;</strong>
                {cities.join('\u00a0\u00a0|\u00a0\u00a0')}
              </span>
            </td>
          </tr>
        )}

        {/* ── Legal Footer ── */}
        {data.showLegalFooter !== false && (
          <tr>
            <td colSpan={4} style={{ backgroundColor: '#f9f9f9', padding: '8px 18px', borderTop: '1px solid #e0e0e0' }}>
              <span style={{ fontFamily: F, fontSize: 10, color: '#aaaaaa', lineHeight: 1.4, display: 'block' }}>
                {company.legalName}&nbsp;&nbsp;·&nbsp;&nbsp;Geschäftsführer: {company.legal.ceo}&nbsp;&nbsp;·&nbsp;&nbsp;Sitz der Gesellschaft: Hilden&nbsp;&nbsp;·&nbsp;&nbsp;{company.legal.court}&nbsp;&nbsp;·&nbsp;&nbsp;Steuernummer: {company.legal.taxNo}&nbsp;&nbsp;·&nbsp;&nbsp;USt.-ID: {company.legal.vatId}
              </span>
            </td>
          </tr>
        )}

        {/* ── Banner ── */}
        {data.bannerUrl && (
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
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
