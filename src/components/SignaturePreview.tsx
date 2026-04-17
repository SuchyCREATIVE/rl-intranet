'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { SignatureData, COMPANY_CONFIG, buildVCard } from '@/lib/signature-export'

const Y  = '#DCFF0C'
const DB = '#1c1c1c'
const LB = '#efefef'
const TD = '#222222'
const TG = '#666666'
const F  = 'Arial, Helvetica, sans-serif'

interface SignaturePreviewProps {
  data: SignatureData
}

export default function SignaturePreview({ data }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const [mounted, setMounted] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const vCard = buildVCard(data, company)
    QRCode.toDataURL(vCard, { width: 76, margin: 1, color: { dark: '#000000', light: '#efefef' } })
      .then(setQrDataUrl)
      .catch(() => {})
  }, [data, company])

  if (!mounted) return null

  return (
    <table cellPadding={0} cellSpacing={0} border={0} width={600}
      style={{ maxWidth: 600, width: '100%', borderCollapse: 'collapse', backgroundColor: LB }}>
      <tbody>
        <tr>

          {/* ── Linke Spalte: Dunkel + Foto ── */}
          <td width={155} style={{
            width: 155, backgroundColor: DB,
            verticalAlign: 'middle', textAlign: 'center',
            padding: '20px 14px',
          }}>
            {data.photoUrl ? (
              <table cellPadding={0} cellSpacing={0} border={0} style={{ margin: '0 auto' }}>
                <tbody>
                  <tr>
                    <td style={{
                      backgroundColor: Y,
                      borderRadius: 54,
                      padding: 3,
                      lineHeight: 0,
                      display: 'inline-block',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.photoUrl}
                        width={96} height={96}
                        alt={`${data.firstName} ${data.lastName}`}
                        style={{
                          display: 'block', width: 96, height: 96,
                          borderRadius: '50%', objectFit: 'cover',
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null}
          </td>

          {/* ── Mittlere Spalte: Kontakt ── */}
          <td style={{
            backgroundColor: LB,
            verticalAlign: 'top',
            padding: '18px 18px 18px 20px',
          }}>
            {/* Name */}
            <div style={{
              fontFamily: F, fontSize: 16, fontWeight: 'bold',
              color: TD, lineHeight: 1.2, margin: 0,
            }}>
              {data.firstName} {data.lastName}
            </div>
            {/* Position */}
            <div style={{
              fontFamily: F, fontSize: 13, fontStyle: 'italic',
              color: TG, lineHeight: 1.2, margin: '2px 0 0 0',
            }}>
              {data.position}
            </div>

            {/* Kontakt-Tabelle */}
            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 12 }}>
              <tbody>
                {data.phone && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 10, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefon</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>
                      <a href={`tel:${data.phone.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.phone}</a>
                    </td>
                  </tr>
                )}
                {data.fax && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 10, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Telefax</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>{data.fax}</td>
                  </tr>
                )}
                {data.mobile && (
                  <tr>
                    <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 10, paddingBottom: 3, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mobil</td>
                    <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 3 }}>
                      <a href={`tel:${data.mobile.replace(/\s/g, '')}`} style={{ color: TD, textDecoration: 'none' }}>{data.mobile}</a>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingRight: 10, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Mail</td>
                  <td style={{ fontFamily: F, fontSize: 12, color: TD }}>
                    <a href={`mailto:${data.email}`} style={{ color: TD, textDecoration: 'none' }}>{data.email}</a>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Adress-Block */}
            <table cellPadding={0} cellSpacing={0} border={0} style={{ marginTop: 12 }}>
              <tbody>
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TD, paddingBottom: 2 }}>{company.legalName}</td>
                </tr>
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TG, paddingBottom: 2 }}>{company.address}</td>
                </tr>
                <tr>
                  <td style={{ fontFamily: F, fontSize: 12, color: TG }}>{company.city}</td>
                </tr>
              </tbody>
            </table>

            {/* Website */}
            <div style={{ marginTop: 10, fontFamily: F, fontSize: 12 }}>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                style={{ color: TG, textDecoration: 'none' }}>{websiteUrl}</a>
            </div>
          </td>

          {/* ── Rechte Spalte: Logo + QR ── */}
          <td width={110} style={{
            width: 110, backgroundColor: LB,
            verticalAlign: 'top', textAlign: 'center',
            padding: '16px 12px 16px 6px',
          }}>
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={company.logo}
              width={90} height="auto"
              alt={company.legalName}
              style={{ display: 'block', width: 90, height: 'auto', margin: '0 auto' }}
            />

            {/* QR-Code */}
            {qrDataUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  width={76} height={76}
                  alt="QR-Code"
                  style={{ display: 'block', width: 76, height: 76, margin: '10px auto 0' }}
                />
                <div style={{ fontFamily: F, fontSize: 9, color: '#999', textAlign: 'center', marginTop: 4 }}>
                  Visitenkarte
                </div>
              </>
            )}
          </td>

        </tr>

        {/* ── Banner (optional) ── */}
        {data.bannerUrl && (
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerUrl}
                alt="Banner"
                style={{ display: 'block', maxWidth: 600, width: '100%', height: 'auto' }}
              />
            </td>
          </tr>
        )}

      </tbody>
    </table>
  )
}
