export type CompanyKey = 'raederlogistik' | 'reifen-gerlach' | 'rtg'

export interface SignatureData {
  company: CompanyKey
  firstName: string
  lastName: string
  position: string
  phone?: string
  fax?: string
  mobile?: string
  whatsapp?: string
  email: string
  website?: string
  photoUrl?: string
  bannerUrl?: string
  logoUrl?: string
  showStandorte?: boolean
  showLegalFooter?: boolean
  // Individuelle Adresse (für Franchise-Standorte)
  street?: string
  zipCity?: string
  zoomLink?: string
}

export const COMPANY_CONFIG: Record<CompanyKey, {
  legalName: string
  descriptor: string
  address: string
  city: string
  website: string
  logo: string
  legal: {
    ceo: string
    court: string
    taxNo: string
    vatId: string
  }
}> = {
  'raederlogistik': {
    legalName: 'Räderlogistik Franchise GmbH',
    descriptor: 'Der Serviceprovider für das Autohaus',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
    legal: {
      ceo: 'Sven Gerlach',
      court: 'Amtsgericht Düsseldorf HRB100524',
      taxNo: '135/5758/0355',
      vatId: 'DE360841095',
    },
  },
  'reifen-gerlach': {
    legalName: 'Reifen Gerlach GmbH',
    descriptor: 'Der Serviceprovider für das Autohaus',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Gerlach-Rand-100.jpg',
    legal: {
      ceo: 'Sven Gerlach, Ingo Grimm',
      court: 'Amtsgericht Düsseldorf HRB66350',
      taxNo: '135/5759/1668',
      vatId: 'DE278645994',
    },
  },
  'rtg': {
    legalName: 'RTG GmbH',
    descriptor: 'PREMIO Reifen & Autoservice',
    address: 'Düsseldorfer Straße 64',
    city: '40721 Hilden',
    website: 'https://www.raederlogistik.de/',
    logo: '/logos/raederlogistik-Logo-Rand-100.jpg',
    legal: {
      ceo: 'Sven Gerlach / Manuel Ising',
      court: 'Amtsgericht Düsseldorf HRB100230',
      taxNo: '135/5760/2844',
      vatId: 'DE278645994',
    },
  },
}

const FALLBACK_STANDORTE = [
  'Augsburg', 'Dresden', 'Erkrath', 'Hamburg', 'Hermsdorf',
  'Hilden', 'München', 'Nürnberg', 'Offenburg', 'Paderborn',
  'Rheinberg', 'Sangerhausen', 'Steinen', 'Westerwald',
]

// ── Farben ────────────────────────────────────────────────────────────────────
const Y  = '#DCFF0C'   // RL-Gelb
const DB = '#1c1c1c'   // Dunkler Hintergrund
const LB = '#efefef'   // Heller Hintergrund Mitte
const WH = '#ffffff'   // Weiß rechte Spalte
const TD = '#222222'   // Text dunkel
const TG = '#888888'   // Text grau (Labels)
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

  // ── Initialen-Fallback wenn kein Foto ────────────────────────────────────
  const initials = (data.firstName.charAt(0) + data.lastName.charAt(0)).toUpperCase()

  // ── Foto oder Initialen (linke Spalte) ────────────────────────────────────
  const photoBlock = data.photoUrl
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="background-color:${Y};border-radius:56px;padding:4px;line-height:0;">
            <img src="${data.photoUrl}" width="96" height="96"
              alt="${data.firstName} ${data.lastName}"
              style="display:block;width:96px;height:96px;border-radius:50%;object-fit:cover;" />
          </td>
        </tr>
      </table>`
    : `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="background-color:${Y};border-radius:56px;padding:4px;line-height:0;">
            <div style="width:96px;height:96px;border-radius:50%;background-color:${DB};font-family:${F};font-size:32px;font-weight:bold;color:${Y};text-align:center;line-height:96px;display:block;">${initials}</div>
          </td>
        </tr>
      </table>`

  // ── Kontaktzeilen ─────────────────────────────────────────────────────────
  const contactRows: string[] = []

  if (data.phone) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;padding-bottom:4px;white-space:nowrap;vertical-align:top;">Telefon</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:4px;">
        <a href="tel:${data.phone.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.phone}</a>
      </td>
    </tr>`)

  if (data.fax) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;padding-bottom:4px;white-space:nowrap;vertical-align:top;">Telefax</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:4px;">${data.fax}</td>
    </tr>`)

  if (data.mobile) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;padding-bottom:4px;white-space:nowrap;vertical-align:top;">Mobil</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:4px;">
        <a href="tel:${data.mobile.replace(/\s/g, '')}" style="color:${TD};text-decoration:none;">${data.mobile}</a>
      </td>
    </tr>`)

  if (data.whatsapp) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;padding-bottom:4px;white-space:nowrap;vertical-align:top;">WhatsApp</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:4px;">
        <a href="https://wa.me/${data.whatsapp.replace(/\D/g, '')}" style="color:${TD};text-decoration:none;">${data.whatsapp}</a>
      </td>
    </tr>`)

  contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;white-space:nowrap;vertical-align:top;">Mail</td>
      <td style="font-family:${F};font-size:12px;color:${TD};">
        <a href="mailto:${data.email}" style="color:${TD};text-decoration:none;">${data.email}</a>
      </td>
    </tr>`)

  if (data.zoomLink) contactRows.push(`
    <tr>
      <td style="font-family:${F};font-size:12px;color:${TG};padding-right:16px;padding-top:4px;white-space:nowrap;vertical-align:top;">Zoom</td>
      <td style="font-family:${F};font-size:12px;color:${TD};padding-top:4px;">
        <a href="${data.zoomLink}" target="_blank" style="color:${TD};text-decoration:none;">Meeting-Link</a>
      </td>
    </tr>`)

  // ── Standorte-Zeile ───────────────────────────────────────────────────────
  const standorteRow = data.showStandorte !== false
    ? `<tr>
        <td colspan="4" style="background-color:${DB};padding:9px 18px;border-top:3px solid ${Y};">
          <span style="font-family:${F};font-size:11px;color:#999999;">
            <strong style="color:${Y};font-weight:700;">Für Sie vor Ort:&nbsp;</strong>${cities.join('&nbsp;&nbsp;|&nbsp;&nbsp;')}
          </span>
        </td>
       </tr>`
    : ''

  // ── Legal Footer ──────────────────────────────────────────────────────────
  const legalRow = data.showLegalFooter !== false
    ? `<tr>
        <td colspan="4" style="background-color:#f9f9f9;padding:8px 18px;border-top:1px solid #e0e0e0;">
          <span style="font-family:${F};font-size:10px;color:#aaaaaa;line-height:1.4;">
            ${company.legalName}&nbsp;&nbsp;·&nbsp;&nbsp;Geschäftsführer: ${company.legal.ceo}&nbsp;&nbsp;·&nbsp;&nbsp;Sitz der Gesellschaft: Hilden&nbsp;&nbsp;·&nbsp;&nbsp;${company.legal.court}&nbsp;&nbsp;·&nbsp;&nbsp;Steuernummer: ${company.legal.taxNo}&nbsp;&nbsp;·&nbsp;&nbsp;USt.-ID: ${company.legal.vatId}
          </span>
        </td>
       </tr>`
    : ''

  // ── Banner ────────────────────────────────────────────────────────────────
  const bannerRow = data.bannerUrl
    ? `<tr>
        <td colspan="4" style="padding:0;">
          <img src="${data.bannerUrl}" alt="Banner"
            style="display:block;max-width:600px;width:100%;height:auto;" />
        </td>
       </tr>`
    : ''

  return `<table cellpadding="0" cellspacing="0" border="0" width="600"
  style="max-width:600px;width:100%;border-collapse:collapse;font-size:0;">
  <tbody>

    <!-- ── Hauptzeile: 3 Spalten + gelber Rand ── -->
    <tr>

      <!-- Linke Spalte: Dunkel, Foto/Initialen -->
      <td width="155" bgcolor="${DB}" valign="middle" align="center"
          style="width:155px;background-color:${DB};vertical-align:middle;text-align:center;padding:22px 14px;">
        ${photoBlock}
      </td>

      <!-- Mittlere Spalte: Kontakt -->
      <td bgcolor="${LB}" valign="top"
          style="background-color:${LB};vertical-align:top;padding:20px 20px 20px 22px;">

        <!-- Name -->
        <p style="font-family:${F};font-size:16px;font-weight:bold;color:${TD};margin:0;line-height:1.2;">${data.firstName} ${data.lastName}</p>
        <!-- Position -->
        <p style="font-family:${F};font-size:12px;font-style:italic;color:${TG};margin:3px 0 0 0;line-height:1.2;">${data.position}</p>

        <!-- Kontaktdaten -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
          <tbody>${contactRows.join('')}</tbody>
        </table>

        <!-- Firmenadresse -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
          <tbody>
            <tr><td style="font-family:${F};font-size:12px;color:${TD};padding-bottom:1px;font-weight:600;">${company.legalName}</td></tr>
            <tr><td style="font-family:${F};font-size:11px;color:${TG};padding-bottom:4px;font-style:italic;">${company.descriptor}</td></tr>
            <tr><td style="font-family:${F};font-size:12px;color:${TG};padding-bottom:1px;">${street}</td></tr>
            <tr><td style="font-family:${F};font-size:12px;color:${TG};">${zipCity}</td></tr>
          </tbody>
        </table>

        <!-- Website -->
        <p style="font-family:${F};font-size:12px;margin:12px 0 0 0;">
          <a href="${websiteUrl}" target="_blank" style="color:${TG};text-decoration:none;">${websiteUrl}</a>
        </p>

      </td>

      <!-- Rechte Spalte: Logo (weiß) -->
      <td width="130" bgcolor="${WH}" valign="top" align="center"
          style="width:130px;background-color:${WH};vertical-align:top;text-align:center;padding:20px 14px 20px 16px;">
        <img src="${logoSrc}" width="98" height="auto" alt="${company.legalName}"
          style="display:block;width:98px;height:auto;margin:0 auto;" />
      </td>

      <!-- Gelber Akzentstreifen (wie PDF-Vorlage) -->
      <td width="5" bgcolor="${Y}"
          style="width:5px;min-width:5px;background-color:${Y};">
      </td>

    </tr>

    ${standorteRow}
    ${legalRow}
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
