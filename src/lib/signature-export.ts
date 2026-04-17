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

export const COMPANY_CONFIG = {
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
}

const FALLBACK_STANDORTE = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf',
  'Hilden', 'München', 'Nürnberg', 'Offenburg', 'Paderborn',
  'Rheinberg', 'Sangerhausen', 'Steinen', 'Westerwald',
]

const Y  = '#DCFF0C'       // RL-Gelb
const DB = '#1c1c1c'       // Dunkler Hintergrund links
const LB = '#efefef'       // Heller Hintergrund Mitte/Rechts
const TD = '#222222'       // Text dunkel
const TG = '#666666'       // Text grau
const F  = 'Arial, Helvetica, sans-serif'

function buildSignatureHTML(
  data: SignatureData,
  logoSrc: string,
  standorte: string[],
): string {
  const company = COMPANY_CONFIG[data.company]
  const websiteUrl = data.website || company.website
  const cities = standorte.length > 0 ? standorte : FALLBACK_STANDORTE

  // ── Kontaktzeilen ──────────────────────────────────────────────────────────
  const contactRows: string[] = []
  if (data.phone) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:10px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Telefon</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">
        <a href="tel:${data.phone.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.phone}</a>
      </td>
    </tr>`)
  if (data.fax) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:10px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Telefax</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">${data.fax}</td>
    </tr>`)
  if (data.mobile) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:10px;padding-bottom:3px;white-space:nowrap;vertical-align:top;">Mobil</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:3px;">
        <a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.mobile}</a>
      </td>
    </tr>`)
  contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:10px;white-space:nowrap;vertical-align:top;">Mail</td>
      <td style="font-family:${F};font-size:12px;color:${TD};">
        <a href="mailto:${data.email}" style="color:${TD};text-decoration:none;">${data.email}</a>
      </td>
    </tr>`)

  // ── Foto (linke Spalte) ────────────────────────────────────────────────────
  const photoBlock = data.photoUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="background-color:${Y};border-radius:54px;padding:3px;line-height:0;">
            <img src="${data.photoUrl}" width="96" height="96" alt="${data.firstName} ${data.lastName}"
              style="display:block;width:96px;height:96px;border-radius:50%;object-fit:cover;" />
          </td>
        </tr>
      </table>`
    : ''

  // ── Standorte-Zeile ────────────────────────────────────────────────────────
  const standorteRow = data.showStandorte !== false
    ? `<tr>
        <td colspan="3" style="background-color:${DB};padding:7px 14px;border-top:2px solid ${Y};">
          <span style="font-family:${F};font-size:11px;color:#aaa;">
            <strong style="color:${Y};font-weight:600;">Für Sie vor Ort:&nbsp;</strong>${cities.join(' &nbsp;|&nbsp; ')}
          </span>
        </td>
       </tr>`
    : ''

  // ── Banner (optional) ──────────────────────────────────────────────────────
  const bannerRow = data.bannerUrl
    ? `<tr>
        <td colspan="3" style="padding:0;">
          <img src="${data.bannerUrl}" alt="Banner"
            style="display:block;max-width:600px;width:100%;height:auto;" />
        </td>
       </tr>`
    : ''

  return `<table cellpadding="0" cellspacing="0" border="0" width="600"
  style="max-width:600px;width:100%;border-collapse:collapse;background-color:${LB};">
  <tbody>
    <tr>

      <!-- ── Linke Spalte: Dunkel + Foto ── -->
      <td width="155" bgcolor="${DB}" valign="middle" align="center"
          style="width:155px;background-color:${DB};vertical-align:middle;text-align:center;padding:20px 14px;">
        ${photoBlock}
      </td>

      <!-- ── Mittlere Spalte: Kontakt ── -->
      <td bgcolor="${LB}" valign="top"
          style="background-color:${LB};vertical-align:top;padding:18px 18px 18px 20px;">

        <!-- Name -->
        <div style="font-family:${F};font-size:16px;font-weight:bold;color:${TD};line-height:1.2;margin:0;">
          ${data.firstName} ${data.lastName}
        </div>
        <!-- Position -->
        <div style="font-family:${F};font-size:13px;font-style:italic;color:${TG};line-height:1.2;margin:2px 0 0 0;">
          ${data.position}
        </div>

        <!-- Kontakt-Tabelle -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          <tbody>
            ${contactRows.join('')}
          </tbody>
        </table>

        <!-- Adress-Block -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          <tbody>
            <tr>
              <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:2px;">${company.legalName}</td>
            </tr>
            <tr>
              <td style="font-family:${F};font-size:12px;color:${TG};padding-bottom:2px;">${company.address}</td>
            </tr>
            <tr>
              <td style="font-family:${F};font-size:12px;color:${TG};">${company.city}</td>
            </tr>
          </tbody>
        </table>

        <!-- Website -->
        <div style="margin-top:10px;font-family:${F};font-size:12px;">
          <a href="${websiteUrl}" target="_blank" style="color:${TG};text-decoration:none;">${websiteUrl}</a>
        </div>

      </td>

      <!-- ── Rechte Spalte: Logo ── -->
      <td width="110" bgcolor="${LB}" valign="top" align="center"
          style="width:110px;background-color:${LB};vertical-align:top;text-align:center;padding:16px 12px 16px 6px;">

        <!-- Logo -->
        <img src="${logoSrc}" width="90" height="auto" alt="${company.legalName}"
          style="display:block;width:90px;height:auto;margin:0 auto;" />

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
  const logoPrefix = baseUrl || ''
  const logoSrc = `${logoPrefix}${company.logo}`
  return buildSignatureHTML(data, logoSrc, standorte)
}

export async function generateSignatureHTML(
  data: SignatureData,
  standorte: string[],
  baseUrl?: string,
): Promise<string> {
  return generateSignatureHTMLSync(data, standorte, baseUrl)
}
