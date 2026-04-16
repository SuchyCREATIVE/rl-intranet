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
}

export default function SignaturePreview({ data }: SignaturePreviewProps) {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{
          width: '100%',
          maxWidth: 700,
          backgroundColor: '#f0f0f0',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <tbody>
          <tr>
            {/* Left Column: Photo + Company */}
            <td
              width={180}
              valign="top"
              style={{
                width: 180,
                backgroundColor: '#1a1a1a',
                padding: '20px 16px',
                verticalAlign: 'top',
              }}
            >
              {/* Photo Circle */}
              <table cellPadding={0} cellSpacing={0} border={0} style={{ marginBottom: 14 }}>
                <tbody>
                  <tr>
                    <td>
                      <div
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '3px solid #DCFF0C',
                          backgroundColor: '#2a2a2a',
                          display: 'inline-block',
                        }}
                      >
                        {data.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={data.photoUrl}
                            width={88}
                            height={88}
                            alt={`${data.firstName} ${data.lastName}`}
                            style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <table cellPadding={0} cellSpacing={0} border={0} width={88} style={{ height: 88 }}>
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  valign="middle"
                                  style={{ color: '#DCFF0C', fontSize: 30, fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
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

              {/* Company Info */}
              <table cellPadding={0} cellSpacing={0} border={0} width={148}>
                <tbody>
                  <tr>
                    <td style={{ paddingTop: 6, borderTop: '2px solid #DCFF0C' }}>
                      <span style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 9,
                        color: '#DCFF0C',
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        textTransform: 'uppercase' as const,
                        display: 'block',
                      }}>
                        {company.name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: 3 }}>
                      <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, color: '#999999', display: 'block' }}>
                        {company.address}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, color: '#999999', display: 'block' }}>
                        {company.city}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Middle Column: Contact Info */}
            <td
              valign="top"
              style={{
                padding: '20px 24px',
                verticalAlign: 'top',
                backgroundColor: '#f0f0f0',
              }}
            >
              <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%' }}>
                <tbody>
                  {/* Name + Position */}
                  <tr>
                    <td style={{ paddingBottom: 6, borderBottom: '2px solid #DCFF0C' }}>
                      <strong style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 17,
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        display: 'block',
                      }}>
                        {data.firstName} {data.lastName}
                      </strong>
                      <em style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 13,
                        color: '#555555',
                        fontStyle: 'italic',
                        display: 'block',
                        marginTop: 3,
                      }}>
                        {data.position}
                      </em>
                    </td>
                  </tr>
                  <tr><td style={{ paddingTop: 10 }} /></tr>

                  {/* Contact rows */}
                  {data.phone && (
                    <tr>
                      <td style={{ padding: '2px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                        <span style={{ display: 'inline-block', width: 52, color: '#888888', fontSize: 11 }}>Telefon</span>
                        <a href={`tel:${data.phone.replace(/\s/g, '')}`} style={{ color: '#1a1a1a', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
                          {data.phone}
                        </a>
                      </td>
                    </tr>
                  )}
                  {data.mobile && (
                    <tr>
                      <td style={{ padding: '2px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                        <span style={{ display: 'inline-block', width: 52, color: '#888888', fontSize: 11 }}>Mobil</span>
                        <a href={`tel:${data.mobile.replace(/\s/g, '')}`} style={{ color: '#1a1a1a', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
                          {data.mobile}
                        </a>
                      </td>
                    </tr>
                  )}
                  {data.fax && (
                    <tr>
                      <td style={{ padding: '2px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                        <span style={{ display: 'inline-block', width: 52, color: '#888888', fontSize: 11 }}>Telefax</span>
                        <span style={{ color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: 12 }}>{data.fax}</span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '2px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                      <span style={{ display: 'inline-block', width: 52, color: '#888888', fontSize: 11 }}>Mail</span>
                      <a href={`mailto:${data.email}`} style={{ color: '#1a1a1a', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
                        {data.email}
                      </a>
                    </td>
                  </tr>

                  {/* Spacer */}
                  <tr><td style={{ paddingTop: 10 }} /></tr>

                  {/* Company block */}
                  <tr>
                    <td style={{ padding: '2px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                      {company.name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                      {company.address}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1px 0', fontSize: 12, color: '#444444', fontFamily: 'Arial, sans-serif' }}>
                      {company.city}
                    </td>
                  </tr>

                  {/* Spacer */}
                  <tr><td style={{ paddingTop: 8 }} /></tr>

                  {/* Website */}
                  <tr>
                    <td style={{ padding: '1px 0', fontSize: 12, fontFamily: 'Arial, sans-serif' }}>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#444444', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 12, fontStyle: 'italic' }}>
                        {websiteUrl}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Right Column: Logo only */}
            <td
              width={130}
              valign="top"
              style={{
                width: 130,
                padding: '20px 16px',
                verticalAlign: 'top',
                backgroundColor: '#f0f0f0',
                textAlign: 'center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logo}
                width={110}
                height={40}
                alt={company.name}
                style={{ display: 'block', maxWidth: 110, height: 'auto', margin: '0 auto' }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
