'use client'

import { useEffect, useState } from 'react'
import { SignatureData } from '@/lib/signature-export'

const COMPANY_CONFIG = {
  'raederlogistik': {
    name: 'Räderlogistik Franchise GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand.svg',
  },
  'reifen-gerlach': {
    name: 'Reifen Gerlach GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand.svg',
  },
}

interface SignaturePreviewProps {
  data: SignatureData
  qrCodeDataUrl?: string
}

export default function SignaturePreview({ data, qrCodeDataUrl }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const qrSrc = qrCodeDataUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(websiteUrl)}`

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        border={0}
        width={600}
        style={{
          width: 600,
          maxWidth: 600,
          backgroundColor: '#f5f5f5',
          fontFamily: 'Arial, sans-serif',
          borderLeft: '4px solid #DCFF0C',
        }}
      >
        <tbody>
          <tr>
            {/* Left Column */}
            <td
              width={160}
              valign="top"
              style={{
                width: 160,
                backgroundColor: '#1a1a1a',
                padding: '16px 12px',
                verticalAlign: 'top',
              }}
            >
              {/* Photo */}
              <table cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: 8 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}>
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '3px solid #DCFF0C',
                          display: 'inline-block',
                          backgroundColor: '#2a2a2a',
                        }}
                      >
                        {data.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={data.photoUrl}
                            width={80}
                            height={80}
                            alt={`${data.firstName} ${data.lastName}`}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <table cellPadding={0} cellSpacing={0} border={0} width={80} style={{ height: 80 }}>
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  valign="middle"
                                  style={{
                                    color: '#DCFF0C',
                                    fontSize: 28,
                                    fontFamily: 'Arial, sans-serif',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {data.firstName.charAt(0)}{data.lastName.charAt(0)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Company Banner */}
              <table cellPadding={0} cellSpacing={0} border={0} width={136}>
                <tbody>
                  <tr>
                    <td style={{ paddingTop: 4, borderTop: '2px solid #DCFF0C' }}>
                      <span
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 9,
                          color: '#DCFF0C',
                          fontWeight: 'bold',
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          display: 'block',
                        }}
                      >
                        {company.name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: 2 }}>
                      <span
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 9,
                          color: '#aaaaaa',
                          display: 'block',
                        }}
                      >
                        {company.address}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 9,
                          color: '#aaaaaa',
                          display: 'block',
                        }}
                      >
                        {company.city}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Middle Column */}
            <td
              width={300}
              valign="top"
              style={{
                width: 300,
                padding: '16px 16px 16px 20px',
                verticalAlign: 'top',
                backgroundColor: '#f5f5f5',
              }}
            >
              <table cellPadding={0} cellSpacing={0} border={0} width={264}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: 4, borderBottom: '2px solid #DCFF0C' }}>
                      <strong
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 16,
                          color: '#1a1a1a',
                          fontWeight: 'bold',
                          display: 'block',
                        }}
                      >
                        {data.firstName} {data.lastName}
                      </strong>
                      <em
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 12,
                          color: '#555555',
                          fontStyle: 'italic',
                          display: 'block',
                          marginTop: 2,
                        }}
                      >
                        {data.position}
                      </em>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: 8 }} />
                  </tr>
                  {data.phone && (
                    <tr>
                      <td
                        style={{
                          padding: '1px 0',
                          fontSize: 12,
                          color: '#444444',
                          fontFamily: 'Arial, sans-serif',
                        }}
                      >
                        <span style={{ color: '#DCFF0C', fontSize: 12 }}>&#x260E;</span>
                        &nbsp;
                        <a
                          href={`tel:${data.phone.replace(/\s/g, '')}`}
                          style={{
                            color: '#444444',
                            textDecoration: 'none',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: 12,
                          }}
                        >
                          {data.phone}
                        </a>
                      </td>
                    </tr>
                  )}
                  {data.mobile && (
                    <tr>
                      <td
                        style={{
                          padding: '1px 0',
                          fontSize: 12,
                          color: '#444444',
                          fontFamily: 'Arial, sans-serif',
                        }}
                      >
                        <span style={{ color: '#DCFF0C', fontSize: 12 }}>&#x1F4F1;</span>
                        &nbsp;
                        <a
                          href={`tel:${data.mobile.replace(/\s/g, '')}`}
                          style={{
                            color: '#444444',
                            textDecoration: 'none',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: 12,
                          }}
                        >
                          {data.mobile}
                        </a>
                      </td>
                    </tr>
                  )}
                  {data.fax && (
                    <tr>
                      <td
                        style={{
                          padding: '1px 0',
                          fontSize: 12,
                          color: '#444444',
                          fontFamily: 'Arial, sans-serif',
                        }}
                      >
                        <span style={{ color: '#DCFF0C', fontSize: 12 }}>&#x2117;</span>
                        &nbsp;
                        <span
                          style={{
                            color: '#444444',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: 12,
                          }}
                        >
                          {data.fax}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      style={{
                        padding: '1px 0',
                        fontSize: 12,
                        color: '#444444',
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      <span style={{ color: '#DCFF0C', fontSize: 12 }}>&#x2709;</span>
                      &nbsp;
                      <a
                        href={`mailto:${data.email}`}
                        style={{
                          color: '#1a1a1a',
                          textDecoration: 'none',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 12,
                        }}
                      >
                        {data.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: '1px 0',
                        fontSize: 12,
                        color: '#444444',
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      <span style={{ color: '#DCFF0C', fontSize: 12 }}>&#x1F310;</span>
                      &nbsp;
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#444444',
                          textDecoration: 'none',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 12,
                        }}
                      >
                        {websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Right Column */}
            <td
              width={136}
              valign="top"
              style={{
                width: 136,
                padding: '16px 12px',
                verticalAlign: 'top',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
              }}
            >
              <table cellPadding={0} cellSpacing={0} border={0} width={112} style={{ margin: '0 auto' }}>
                <tbody>
                  <tr>
                    <td align="center" style={{ paddingBottom: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company.logo}
                        width={112}
                        height={40}
                        alt={company.name}
                        style={{ display: 'block', maxWidth: 112, height: 'auto' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrSrc}
                          width={80}
                          height={80}
                          alt="QR Code"
                          style={{ display: 'block', margin: '0 auto', border: '3px solid #1a1a1a' }}
                        />
                      </a>
                      <span
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 9,
                          color: '#888888',
                          display: 'block',
                          marginTop: 4,
                        }}
                      >
                        scan me
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
