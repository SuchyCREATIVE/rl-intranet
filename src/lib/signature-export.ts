import QRCode from 'qrcode'

export interface SignatureData {
  company: 'raederlogistik' | 'reifen-gerlach'
  firstName: string
  lastName: string
  position: string
  phone?: string
  fax?: string
  mobile?: string
  email: string
  website?: string
  photoUrl?: string
}

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

export async function generateSignatureHTML(data: SignatureData, baseUrl?: string): Promise<string> {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  // Generate QR code as base64 PNG
  let qrCodeDataUrl = ''
  try {
    qrCodeDataUrl = await QRCode.toDataURL(websiteUrl, {
      width: 80,
      margin: 1,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
    })
  } catch {
    // fallback: use QR code service
    qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(websiteUrl)}`
  }

  const logoPrefix = baseUrl ? baseUrl : ''
  const logoSrc = `${logoPrefix}${company.logo}`

  const photoSection = data.photoUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding:0;">
            <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;display:inline-block;">
              <img src="${data.photoUrl}" width="80" height="80" alt="${data.firstName} ${data.lastName}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;" />
            </div>
          </td>
        </tr>
      </table>`
    : `<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding:0;">
            <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;background-color:#2a2a2a;display:inline-block;">
              <table cellpadding="0" cellspacing="0" border="0" width="80" height="80">
                <tr><td align="center" valign="middle" style="color:#DCFF0C;font-size:28px;font-family:Arial,sans-serif;font-weight:bold;">
                  ${data.firstName.charAt(0)}${data.lastName.charAt(0)}
                </td></tr>
              </table>
            </div>
          </td>
        </tr>
      </table>`

  const phoneRow = data.phone
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x260E;</span>&nbsp;<a href="tel:${data.phone.replace(/\s/g, '')}" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.phone}</a></td></tr>`
    : ''

  const faxRow = data.fax
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x2117;</span>&nbsp;<span style="color:#444444;font-family:Arial,sans-serif;font-size:12px;">${data.fax}</span></td></tr>`
    : ''

  const mobileRow = data.mobile
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x1F4F1;</span>&nbsp;<a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.mobile}</a></td></tr>`
    : ''

  const html = `<table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#f5f5f5;font-family:Arial,sans-serif;border-left:4px solid #DCFF0C;">
  <tr>
    <!-- Left Column: Photo + Banner -->
    <td width="160" valign="top" style="width:160px;background-color:#1a1a1a;padding:16px 12px;vertical-align:top;">
      ${photoSection}
      <table cellpadding="0" cellspacing="0" border="0" width="136">
        <tr>
          <td style="padding-top:4px;border-top:2px solid #DCFF0C;">
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#DCFF0C;font-weight:bold;letter-spacing:1px;text-transform:uppercase;display:block;">${company.name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding-top:2px;">
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#aaaaaa;display:block;">${company.address}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#aaaaaa;display:block;">${company.city}</span>
          </td>
        </tr>
      </table>
    </td>
    <!-- Middle Column: Contact Info -->
    <td width="300" valign="top" style="width:300px;padding:16px 16px 16px 20px;vertical-align:top;background-color:#f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="264">
        <tr>
          <td style="padding-bottom:4px;border-bottom:2px solid #DCFF0C;">
            <strong style="font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;font-weight:bold;display:block;">${data.firstName} ${data.lastName}</strong>
            <em style="font-family:Arial,sans-serif;font-size:12px;color:#555555;font-style:italic;display:block;margin-top:2px;">${data.position}</em>
          </td>
        </tr>
        <tr><td style="padding-top:8px;"></td></tr>
        ${phoneRow}
        ${mobileRow}
        ${faxRow}
        <tr>
          <td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
            <span style="color:#DCFF0C;font-size:12px;">&#x2709;</span>&nbsp;<a href="mailto:${data.email}" style="color:#1a1a1a;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
            <span style="color:#DCFF0C;font-size:12px;">&#x1F310;</span>&nbsp;<a href="${websiteUrl}" target="_blank" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${websiteUrl.replace(/^https?:\/\//, '')}</a>
          </td>
        </tr>
      </table>
    </td>
    <!-- Right Column: Logo + QR Code -->
    <td width="136" valign="top" style="width:136px;padding:16px 12px;vertical-align:top;background-color:#f5f5f5;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" width="112" align="center">
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <img src="${logoSrc}" width="112" height="40" alt="${company.name}" style="display:block;max-width:112px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <a href="${websiteUrl}" target="_blank" style="display:block;">
              <img src="${qrCodeDataUrl}" width="80" height="80" alt="QR Code" style="display:block;margin:0 auto;border:3px solid #1a1a1a;" />
            </a>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#888888;display:block;margin-top:4px;">scan me</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`

  return html
}

export function generateSignatureHTMLSync(data: SignatureData, qrCodeDataUrl: string, baseUrl?: string): string {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const logoPrefix = baseUrl ? baseUrl : ''
  const logoSrc = `${logoPrefix}${company.logo}`

  const photoSection = data.photoUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding:0;">
            <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;display:inline-block;">
              <img src="${data.photoUrl}" width="80" height="80" alt="${data.firstName} ${data.lastName}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;" />
            </div>
          </td>
        </tr>
      </table>`
    : `<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding:0;">
            <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;background-color:#2a2a2a;display:inline-block;">
              <table cellpadding="0" cellspacing="0" border="0" width="80" height="80">
                <tr><td align="center" valign="middle" style="color:#DCFF0C;font-size:28px;font-family:Arial,sans-serif;font-weight:bold;">
                  ${data.firstName.charAt(0)}${data.lastName.charAt(0)}
                </td></tr>
              </table>
            </div>
          </td>
        </tr>
      </table>`

  const phoneRow = data.phone
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x260E;</span>&nbsp;<a href="tel:${data.phone.replace(/\s/g, '')}" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.phone}</a></td></tr>`
    : ''

  const faxRow = data.fax
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x2117;</span>&nbsp;<span style="color:#444444;font-family:Arial,sans-serif;font-size:12px;">${data.fax}</span></td></tr>`
    : ''

  const mobileRow = data.mobile
    ? `<tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;"><span style="color:#DCFF0C;font-size:12px;">&#x1F4F1;</span>&nbsp;<a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.mobile}</a></td></tr>`
    : ''

  return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#f5f5f5;font-family:Arial,sans-serif;border-left:4px solid #DCFF0C;">
  <tr>
    <td width="160" valign="top" style="width:160px;background-color:#1a1a1a;padding:16px 12px;vertical-align:top;">
      ${photoSection}
      <table cellpadding="0" cellspacing="0" border="0" width="136">
        <tr>
          <td style="padding-top:4px;border-top:2px solid #DCFF0C;">
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#DCFF0C;font-weight:bold;letter-spacing:1px;text-transform:uppercase;display:block;">${company.name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding-top:2px;">
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#aaaaaa;display:block;">${company.address}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#aaaaaa;display:block;">${company.city}</span>
          </td>
        </tr>
      </table>
    </td>
    <td width="300" valign="top" style="width:300px;padding:16px 16px 16px 20px;vertical-align:top;background-color:#f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="264">
        <tr>
          <td style="padding-bottom:4px;border-bottom:2px solid #DCFF0C;">
            <strong style="font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;font-weight:bold;display:block;">${data.firstName} ${data.lastName}</strong>
            <em style="font-family:Arial,sans-serif;font-size:12px;color:#555555;font-style:italic;display:block;margin-top:2px;">${data.position}</em>
          </td>
        </tr>
        <tr><td style="padding-top:8px;"></td></tr>
        ${phoneRow}
        ${mobileRow}
        ${faxRow}
        <tr>
          <td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
            <span style="color:#DCFF0C;font-size:12px;">&#x2709;</span>&nbsp;<a href="mailto:${data.email}" style="color:#1a1a1a;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
            <span style="color:#DCFF0C;font-size:12px;">&#x1F310;</span>&nbsp;<a href="${websiteUrl}" target="_blank" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${websiteUrl.replace(/^https?:\/\//, '')}</a>
          </td>
        </tr>
      </table>
    </td>
    <td width="136" valign="top" style="width:136px;padding:16px 12px;vertical-align:top;background-color:#f5f5f5;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" width="112" align="center">
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <img src="${logoSrc}" width="112" height="40" alt="${company.name}" style="display:block;max-width:112px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <a href="${websiteUrl}" target="_blank" style="display:block;">
              <img src="${qrCodeDataUrl}" width="80" height="80" alt="QR Code" style="display:block;margin:0 auto;border:3px solid #1a1a1a;" />
            </a>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:#888888;display:block;margin-top:4px;">scan me</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}
