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
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
  },
  'reifen-gerlach': {
    name: 'Reifen Gerlach GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand-100.jpg',
  },
}

function buildSignatureHTML(
  data: SignatureData,
  logoSrc: string,
): string {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website

  const photoCell = data.photoUrl
    ? `<div style="width:88px;height:88px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;display:inline-block;">
        <img src="${data.photoUrl}" width="88" height="88" alt="${data.firstName} ${data.lastName}" style="width:88px;height:88px;border-radius:50%;object-fit:cover;display:block;" />
       </div>`
    : `<div style="width:88px;height:88px;border-radius:50%;overflow:hidden;border:3px solid #DCFF0C;background-color:#2a2a2a;display:inline-block;">
        <table cellpadding="0" cellspacing="0" border="0" width="88" height="88"><tr>
          <td align="center" valign="middle" style="color:#DCFF0C;font-size:30px;font-family:Arial,sans-serif;font-weight:bold;">
            ${data.firstName.charAt(0)}${data.lastName.charAt(0)}
          </td>
        </tr></table>
       </div>`

  const phoneRow = data.phone
    ? `<tr><td style="padding:2px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
        <span style="display:inline-block;width:52px;color:#888888;font-size:11px;">Telefon</span>
        <a href="tel:${data.phone.replace(/\s/g, '')}" style="color:#1a1a1a;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.phone}</a>
       </td></tr>`
    : ''

  const mobileRow = data.mobile
    ? `<tr><td style="padding:2px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
        <span style="display:inline-block;width:52px;color:#888888;font-size:11px;">Mobil</span>
        <a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:#1a1a1a;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.mobile}</a>
       </td></tr>`
    : ''

  const faxRow = data.fax
    ? `<tr><td style="padding:2px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
        <span style="display:inline-block;width:52px;color:#888888;font-size:11px;">Telefax</span>
        <span style="color:#1a1a1a;font-family:Arial,sans-serif;font-size:12px;">${data.fax}</span>
       </td></tr>`
    : ''

  return `<table cellpadding="0" cellspacing="0" border="0" style="width:700px;max-width:700px;background-color:#f0f0f0;font-family:Arial,sans-serif;">
  <tr>
    <!-- Left: Photo + Company -->
    <td width="180" valign="top" style="width:180px;background-color:#1a1a1a;padding:20px 16px;vertical-align:top;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;"><tr><td>
        ${photoCell}
      </td></tr></table>
      <table cellpadding="0" cellspacing="0" border="0" width="148">
        <tr><td style="padding-top:6px;border-top:2px solid #DCFF0C;">
          <span style="font-family:Arial,sans-serif;font-size:9px;color:#DCFF0C;font-weight:bold;letter-spacing:1px;text-transform:uppercase;display:block;">${company.name}</span>
        </td></tr>
        <tr><td style="padding-top:3px;">
          <span style="font-family:Arial,sans-serif;font-size:9px;color:#999999;display:block;">${company.address}</span>
        </td></tr>
        <tr><td>
          <span style="font-family:Arial,sans-serif;font-size:9px;color:#999999;display:block;">${company.city}</span>
        </td></tr>
      </table>
    </td>
    <!-- Middle: Contact Info -->
    <td valign="top" style="padding:20px 24px;vertical-align:top;background-color:#f0f0f0;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr><td style="padding-bottom:6px;border-bottom:2px solid #DCFF0C;">
          <strong style="font-family:Arial,sans-serif;font-size:17px;color:#1a1a1a;font-weight:bold;display:block;">${data.firstName} ${data.lastName}</strong>
          <em style="font-family:Arial,sans-serif;font-size:13px;color:#555555;font-style:italic;display:block;margin-top:3px;">${data.position}</em>
        </td></tr>
        <tr><td style="padding-top:10px;"></td></tr>
        ${phoneRow}
        ${mobileRow}
        ${faxRow}
        <tr><td style="padding:2px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">
          <span style="display:inline-block;width:52px;color:#888888;font-size:11px;">Mail</span>
          <a href="mailto:${data.email}" style="color:#1a1a1a;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">${data.email}</a>
        </td></tr>
        <tr><td style="padding-top:10px;"></td></tr>
        <tr><td style="padding:2px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">${company.name}</td></tr>
        <tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">${company.address}</td></tr>
        <tr><td style="padding:1px 0;font-size:12px;color:#444444;font-family:Arial,sans-serif;">${company.city}</td></tr>
        <tr><td style="padding-top:8px;"></td></tr>
        <tr><td style="padding:1px 0;font-size:12px;font-family:Arial,sans-serif;">
          <a href="${websiteUrl}" target="_blank" style="color:#444444;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-style:italic;">${websiteUrl}</a>
        </td></tr>
      </table>
    </td>
    <!-- Right: Logo only -->
    <td width="130" valign="top" style="width:130px;padding:20px 16px;vertical-align:top;background-color:#f0f0f0;text-align:center;">
      <img src="${logoSrc}" width="110" height="40" alt="${company.name}" style="display:block;max-width:110px;height:auto;margin:0 auto;" />
    </td>
  </tr>
</table>`
}

export function generateSignatureHTMLSync(data: SignatureData, _qrCodeDataUrl: string, baseUrl?: string): string {
  const company = COMPANY_CONFIG[data.company]
  const logoPrefix = baseUrl || ''
  const logoSrc = `${logoPrefix}${company.logo}`
  return buildSignatureHTML(data, logoSrc)
}

export async function generateSignatureHTML(data: SignatureData, baseUrl?: string): Promise<string> {
  const company = COMPANY_CONFIG[data.company]
  const logoPrefix = baseUrl || ''
  const logoSrc = `${logoPrefix}${company.logo}`
  return buildSignatureHTML(data, logoSrc)
}
