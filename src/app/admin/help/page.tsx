import Link from 'next/link'
import {
  HelpCircle,
  Users,
  Mail,
  KeyRound,
  UserPlus,
  ShieldCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react'

const faqs = [
  {
    icon: KeyRound,
    question: 'Wie ändere ich mein Passwort?',
    answer:
      'Gehe zu "Benutzer verwalten", klicke auf den Bearbeiten-Button neben deinem Account und gib ein neues Passwort ein. Das Passwort muss mindestens 8 Zeichen lang sein.',
  },
  {
    icon: UserPlus,
    question: 'Wie lege ich neue Benutzer an?',
    answer:
      'Öffne "Benutzer verwalten" und klicke auf "Neuer Benutzer". Fülle Benutzername, E-Mail, Passwort und Rolle aus. Der Benutzer kann sich danach mit den angegebenen Zugangsdaten einloggen.',
  },
  {
    icon: ShieldCheck,
    question: 'Was ist der Unterschied zwischen Admin und Redakteur?',
    answer:
      'Admins haben vollen Zugriff auf den Admin-Bereich und können Benutzer sowie Einstellungen verwalten. Redakteure haben nur Zugriff auf das reguläre Intranet.',
  },
  {
    icon: Trash2,
    question: 'Kann ich meinen eigenen Account löschen?',
    answer:
      'Nein. Das System verhindert das Löschen des eigenen Accounts, um unbeabsichtigte Sperrungen zu vermeiden. Ein anderer Admin kann den Account ggf. löschen.',
  },
  {
    icon: Mail,
    question: 'Wie teste ich die E-Mail-Konfiguration?',
    answer:
      'Speichere zunächst deine SMTP-Einstellungen unter "E-Mail-Einstellungen". Klicke dann auf "Test-Mail senden". Eine Test-E-Mail wird an die konfigurierte Absender-Adresse verschickt.',
  },
  {
    icon: Mail,
    question: 'Was muss ich für Microsoft 365 eintragen?',
    answer:
      'Host: smtp.office365.com · Port: 587 · Sicherheit: STARTTLS · Benutzername: die vollständige E-Mail-Adresse des Postfachs · Passwort: das E-Mail-Passwort oder App-Passwort.',
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle size={22} className="text-gray-700 flex-shrink-0" />
          Hilfe
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Anleitungen und häufig gestellte Fragen zum Admin-Bereich.
        </p>
      </div>

      {/* Quick start */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Schnellstart</h2>
        <div className="space-y-3">
          {[
            {
              step: '1',
              text: 'Benutzer anlegen',
              desc: 'Gehe zu "Benutzer" und lege alle Mitarbeiter mit ihrer E-Mail und Rolle an.',
              href: '/admin/users',
            },
            {
              step: '2',
              text: 'E-Mail konfigurieren',
              desc: 'Trage die SMTP-Daten unter "E-Mail" ein und sende eine Test-Mail.',
              href: '/admin/email',
            },
            {
              step: '3',
              text: 'Intranet testen',
              desc: 'Logge dich mit einem Testbenutzer im Intranet ein und prüfe alle Funktionen.',
              href: '/',
            },
          ].map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="flex items-start gap-4 p-3.5 rounded-lg border border-gray-100 hover:border-[#DCFF0C] hover:bg-gray-50 transition-all group"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: '#DCFF0C', color: '#111827' }}
              >
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Häufige Fragen (FAQ)</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const Icon = faq.icon
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(220, 255, 12, 0.12)' }}
                >
                  <Icon size={16} style={{ color: '#DCFF0C' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/admin/users"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Users size={15} />
          Benutzerverwaltung
        </Link>
        <Link
          href="/admin/email"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Mail size={15} />
          E-Mail-Einstellungen
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <HelpCircle size={15} />
          Admin-Dashboard
        </Link>
      </div>
    </div>
  )
}
