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
  bannerUrl?: string
  showStandorte?: boolean
}

const COMPANY_CONFIG = {
  'raederlogistik': {
    displayName: 'räderlogistik.de',
    tagline: 'Der Serviceprovider für das Autohaus',
    subtext: 'c/o Reifen Gerlach GmbH',
    legalName: 'Räderlogistik Franchise GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
    ustId: '',
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
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand-100.jpg',
    ustId: 'DE278645994',
    legalFooter: 'Reifen Gerlach GmbH | Geschäftsführer: Sven Gerlach und Ingo Grimm | Sitz der Gesellschaft: Hilden | Amtsgericht Düsseldorf HRB66350 | Steuernummer: 135/5759/1668 | USt.-ID: DE278645994',
  },
}

const NEON = '#EAFF00'
const GRAY = '#7A7A7A'
const DARK = '#222222'
const FONT = "'Roboto', Arial, sans-serif"

const FALLBACK_CITIES = 'Augsburg | Dresden | Erkrath | Hamburg | Hermsdorf | Hilden | München | Nürnberg | Offenburg | Paderborn | Rheinberg | Sangerhausen | Steinen | Westerwald'

function buildSignatureHTML(
  data: SignatureData,
  logoSrc: string,
  standorte?: string[],
): string {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website
  const citiesLine = standorte && standorte.length > 0 ? standorte.join(' | ') : FALLBACK_CITIES

  const photoCell = data.photoUrl
    ? `<td width="52" style="width:52px;vertical-align:top;padding-right:12px;">
        <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid ${NEON};display:inline-block;">
          <img src="${data.photoUrl}" width="48" height="48" alt="${data.firstName} ${data.lastName}"
            style="width:48px;height:48px;object-fit:cover;display:block;" />
        </div>
       </td>`
    : ''

  const phoneRow = data.phone
    ? `<tr>
        <td style="font-family:${FONT};font-size:12px;color:${GRAY};padding-right:8px;padding-bottom:2px;white-space:nowrap;">Telefon</td>
        <td style="font-family:${FONT};font-size:12px;color:${DARK};padding-bottom:2px;">
          <a href="tel:${data.phone.replace(/\s/g, '')}" style="color:${DARK};text-decoration:none;">${data.phone}</a>
        </td>
       </tr>`
    : ''

  const mobileRow = data.mobile
    ? `<tr>
        <td style="font-family:${FONT};font-size:12px;color:${GRAY};padding-right:8px;padding-bottom:2px;white-space:nowrap;">Mobil</td>
        <td style="font-family:${FONT};font-size:12px;color:${DARK};padding-bottom:2px;">
          <a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:${DARK};text-decoration:none;">${data.mobile}</a>
        </td>
       </tr>`
    : ''

  const faxRow = data.fax
    ? `<tr>
        <td style="font-family:${FONT};font-size:12px;color:${GRAY};padding-right:8px;padding-bottom:2px;white-space:nowrap;">Telefax</td>
        <td style="font-family:${FONT};font-size:12px;color:${DARK};padding-bottom:2px;">${data.fax}</td>
       </tr>`
    : ''

  const standorteRow = data.showStandorte !== false
    ? `<tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:${FONT};font-size:11px;color:${GRAY};line-height:1.5;">
            <span style="font-weight:600;">Für Sie vor Ort:</span> ${citiesLine}
          </div>
        </td>
       </tr>
       <tr>
        <td style="padding:0;">
          <div style="height:1px;background-color:#e5e5e5;margin-bottom:10px;"></div>
        </td>
       </tr>`
    : ''

  const bannerRow = data.bannerUrl
    ? `<tr>
        <td style="padding-bottom:0;">
          <img src="${data.bannerUrl}" alt="Banner" style="display:block;max-width:600px;width:100%;height:auto;" />
        </td>
       </tr>`
    : ''

  const ustIdSuffix = company.ustId ? ` | USt.-ID: ${company.ustId}` : ''

  return `<table cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;font-family:${FONT};border-collapse:collapse;color:${DARK};">
  <tbody>

    <!-- Row 1: Name + Logo -->
    <tr>
      <td style="vertical-align:top;padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
          <tbody>
            <tr>
              ${photoCell}
              <!-- Name + Position -->
              <td style="vertical-align:top;">
                <div style="font-family:${FONT};font-size:18px;font-weight:700;color:${DARK};line-height:1.2;">${data.firstName} ${data.lastName}</div>
                <div style="font-family:${FONT};font-size:13px;color:${GRAY};font-style:italic;margin-top:3px;">${data.position}</div>
              </td>
              <!-- Logo -->
              <td width="120" style="width:120px;vertical-align:top;text-align:right;">
                <img src="${logoSrc}" width="110" height="38" alt="${company.legalName}"
                  style="display:inline-block;max-width:110px;height:auto;" />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Neon Divider -->
    <tr>
      <td style="padding:0;">
        <div style="height:2px;background-color:${NEON};margin-bottom:10px;"></div>
      </td>
    </tr>

    ${standorteRow}

    <!-- Row 3: Contact -->
    <tr>
      <td style="padding-bottom:10px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tbody>
            ${phoneRow}
            ${mobileRow}
            ${faxRow}
            <tr>
              <td style="font-family:${FONT};font-size:12px;color:${GRAY};padding-right:8px;padding-bottom:2px;white-space:nowrap;">E-Mail</td>
              <td style="font-family:${FONT};font-size:12px;color:${DARK};padding-bottom:2px;">
                <a href="mailto:${data.email}" style="color:${DARK};text-decoration:none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="font-family:${FONT};font-size:12px;color:${GRAY};padding-right:8px;white-space:nowrap;">Web</td>
              <td style="font-family:${FONT};font-size:12px;">
                <a href="${websiteUrl}" target="_blank" style="color:${DARK};text-decoration:none;font-style:italic;">${websiteUrl}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Thin divider -->
    <tr>
      <td style="padding:0;">
        <div style="height:1px;background-color:#e5e5e5;margin-bottom:10px;"></div>
      </td>
    </tr>

    <!-- Row 4: Company info -->
    <tr>
      <td style="padding-bottom:${data.bannerUrl ? '12px' : '0'};">
        <div style="font-family:${FONT};font-size:12px;color:${DARK};font-weight:600;">${company.displayName}</div>
        ${company.tagline ? `<div style="font-family:${FONT};font-size:11px;color:${GRAY};">${company.tagline}</div>` : ''}
        ${company.subtext ? `<div style="font-family:${FONT};font-size:11px;color:${GRAY};">${company.subtext}</div>` : ''}
        <div style="font-family:${FONT};font-size:11px;color:${GRAY};margin-top:2px;">${company.address} &middot; ${company.city}</div>
      </td>
    </tr>

    ${bannerRow}

    <!-- Neon Divider vor Footer -->
    <tr>
      <td style="padding-top:${data.bannerUrl ? '0' : '10px'};">
        <div style="height:2px;background-color:${NEON};margin-bottom:8px;"></div>
      </td>
    </tr>

    <!-- Row 6: Legal Footer -->
    <tr>
      <td>
        <div style="font-family:${FONT};font-size:10px;color:${GRAY};line-height:1.6;">
          ${company.legalFooter}${ustIdSuffix}
        </div>
      </td>
    </tr>

  </tbody>
</table>`
}

export function generateSignatureHTMLSync(
  data: SignatureData,
  _qrCodeDataUrl: string,
  baseUrl?: string,
  standorte?: string[],
): string {
  const company = COMPANY_CONFIG[data.company]
  const logoPrefix = baseUrl || ''
  const logoSrc = `${logoPrefix}${company.logo}`
  return buildSignatureHTML(data, logoSrc, standorte)
}

export async function generateSignatureHTML(
  data: SignatureData,
  baseUrl?: string,
  standorte?: string[],
): Promise<string> {
  const company = COMPANY_CONFIG[data.company]
  const logoPrefix = baseUrl || ''
  const logoSrc = `${logoPrefix}${company.logo}`
  return buildSignatureHTML(data, logoSrc, standorte)
}
