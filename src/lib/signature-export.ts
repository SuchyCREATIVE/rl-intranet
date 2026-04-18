export type CompanyKey = 'raederlogistik' | 'reifen-gerlach' | 'rtg'

export interface SignatureData {
  company: CompanyKey
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
  logoUrl?: string      // Überschreibt das Firmen-Standard-Logo
  showStandorte?: boolean
  // Individuelle Adresse (überschreibt Firmenwert – für Franchise-Standorte)
  street?: string
  zipCity?: string
  // Zoom-Meeting-Link
  zoomLink?: string
}

export const COMPANY_CONFIG: Record<CompanyKey, {
  legalName: string
  address: string
  city: string
  website: string
  logo: string
}> = {
  'raederlogistik': {
    legalName: 'Räderlogistik Franchise GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
  },
  'reifen-gerlach': {
    legalName: 'Reifen Gerlach GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand-100.jpg',
  },
  'rtg': {
    legalName: 'RTG GmbH',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
  },
}

const FALLBACK_STANDORTE = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf',
  'Hilden', 'München', 'Nürnberg', 'Offenburg', 'Paderborn',
  'Rheinberg', 'Sangerhausen', 'Steinen', 'Westerwald',
]

// ── Markenfarben ───────────────────────────────────────────────────────────────
const Y  = '#DCFF0C'   // RL-Gelb
const DB = '#1c1c1c'   // Dunkler Hintergrund linke Spalte
const LB = '#efefef'   // Heller Hintergrund mittlere Spalte
const WH = '#ffffff'   // Weiß für rechte Spalte
const TD = '#222222'   // Text dunkel
const TG = '#666666'   // Text grau
const F  = 'Arial, Helvetica, sans-serif'

function buildSignatureHTML(
  data: SignatureData,
  logoSrc: string,
  standorte: string[],
): string {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website
  const street  = data.street  || company.address
  const zipCity = data.zipCity || company.city
  const cities  = standorte.length > 0 ? standorte : FALLBACK_STANDORTE

  // ── Kontaktzeilen ─────────────────────────────────────────────────────────
  const contactRows: string[] = []
  if (data.phone) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:14px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Telefon</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">
        <a href="tel:${data.phone.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.phone}</a>
      </td>
    </tr>`)
  if (data.fax) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:14px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Telefax</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">${data.fax}</td>
    </tr>`)
  if (data.mobile) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:14px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Mobil</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">
        <a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.mobile}</a>
      </td>
    </tr>`)
  contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:14px;white-space:nowrap;vertical-align:top;">Mail</td>
      <td style="font-family:${F};font-size:12px;color:${TD};">
        <a href="mailto:${data.email}" style="color:${TD};text-decoration:none;">${data.email}</a>
      </td>
    </tr>`)
  if (data.zoomLink) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:14px;padding-top:3px;white-space:nowrap;vertical-align:top;">Zoom</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-top:3px;">
        <a href="${data.zoomLink}" target="_blank" style="color:${TD};text-decoration:none;">Meeting-Link</a>
      </td>
    </tr>`)

  // ── Foto (linke Spalte) ───────────────────────────────────────────────────
  const photoBlock = data.photoUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="background-color:${Y};border-radius:54px;padding:4px;line-height:0;">
            <img src="${data.photoUrl}" width="96" height="96"
              alt="${data.firstName} ${data.lastName}"
              style="display:block;width:96px;height:96px;border-radius:50%;object-fit:cover;" />
          </td>
        </tr>
      </table>`
    : ''

  // ── Standorte-Zeile (colspan 4 wegen gelbem Akzentstreifen) ───────────────
  const standorteRow = data.showStandorte !== false
    ? `<tr>
        <td colspan="4" style="background-color:${DB};padding:8px 16px;border-top:2px solid ${Y};">
          <span style="font-family:${F};font-size:11px;color:#aaaaaa;">
            <strong style="color:${Y};font-weight:600;">Für Sie vor Ort:&nbsp;</strong>${cities.join('&nbsp;&nbsp;|&nbsp;&nbsp;')}
          </span>
        </td>
       </tr>`
    : ''

  // ── Banner (optional, colspan 4) ─────────────────────────────────────────
  const bannerRow = data.bannerUrl
    ? `<tr>
        <td colspan="4" style="padding:0;">
          <img src="${data.bannerUrl}" alt="Banner"
            style="display:block;max-width:600px;width:100%;height:auto;" />
        </td>
       </tr>`
    : ''

  return `<table cellpadding="0" cellspacing="0" border="0" width="600"
  style="max-width:600px;width:100%;border-collapse:collapse;">
  <tbody>
    <tr>

      <!-- ── Linke Spalte: Dunkel + Foto ── -->
      <td width="150" bgcolor="${DB}" valign="middle" align="center"
          style="width:150px;background-color:${DB};vertical-align:middle;text-align:center;padding:20px 14px;">
        ${photoBlock}
      </td>

      <!-- ── Mittlere Spalte: Kontakt ── -->
      <td bgcolor="${LB}" valign="top"
          style="background-color:${LB};vertical-align:top;padding:18px 18px 18px 20px;">

        <div style="font-family:${F};font-size:16px;font-weight:bold;color:${TD};line-height:1.2;margin:0;">
          ${data.firstName} ${data.lastName}
        </div>
        <div style="font-family:${F};font-size:13px;font-style:italic;color:${TG};line-height:1.2;margin:2px 0 0 0;">
          ${data.position}
        </div>

        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          <tbody>${contactRows.join('')}</tbody>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          <tbody>
            <tr><td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:2px;">${company.legalName}</td></tr>
            <tr><td style="font-family:${F};font-size:12px;color:${TG};padding-bottom:2px;">${street}</td></tr>
            <tr><td style="font-family:${F};font-size:12px;color:${TG};">${zipCity}</td></tr>
          </tbody>
        </table>

        <div style="margin-top:10px;font-family:${F};font-size:12px;">
          <a href="${websiteUrl}" target="_blank" style="color:${TG};text-decoration:none;">${websiteUrl}</a>
        </div>

      </td>

      <!-- ── Rechte Spalte: Logo (weiß) ── -->
      <td width="130" bgcolor="${WH}" valign="top" align="center"
          style="width:130px;background-color:${WH};vertical-align:top;text-align:center;padding:18px 12px 18px 14px;">
        <img src="${logoSrc}" width="96" height="auto" alt="${company.legalName}"
          style="display:block;width:96px;height:auto;margin:0 auto;" />
      </td>

      <!-- ── Gelber Akzentstreifen (rechter Rand, wie PDF-Vorlage) ── -->
      <td width="6" bgcolor="${Y}"
          style="width:6px;min-width:6px;background-color:${Y};vertical-align:top;">
      </td>

    </tr>

    ${standorteRow}
    ${bannerRow}

  </tbody>
</table>`
}

export function generateSignatureHTMLSync(
  data: SignatureData,
  standorte: string[],
  baseUrl?: string,
): string {
  const company = COMPANY_CONFIG[data.company]
  const prefix = baseUrl || ''
  const logoPath = data.logoUrl || company.logo
  const logoSrc = logoPath.startsWith('http') ? logoPath : `${prefix}${logoPath}`
  return buildSignatureHTML(data, logoSrc, standorte)
}

export async function generateSignatureHTML(
  data: SignatureData,
  standorte: string[],
  baseUrl?: string,
): Promise<string> {
  return generateSignatureHTMLSync(data, standorte, baseUrl)
}
