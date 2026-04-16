import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  ExternalLink,
  Bell,
  ArrowRight,
  Info,
  Calendar,
  Clock,
} from 'lucide-react'
import { DashboardClock } from '@/components/DashboardClock'

export const metadata = {
  title: 'Startseite – Räderlogistik Intranet',
}

interface QuickCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

const quickCards: QuickCard[] = [
  {
    title: 'Signaturen erstellen',
    description: 'E-Mail-Signaturen für Mitarbeiter generieren und verwalten.',
    href: '/signaturen',
    icon: <Mail className="w-6 h-6" />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Links',
    description: 'Nützliche Links und interne Ressourcen auf einen Blick.',
    href: '/links',
    icon: <ExternalLink className="w-6 h-6" />,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
]

// Placeholder announcements
const announcements = [
  {
    id: 1,
    title: 'Liebe Partner,',
    content:
      'Willkommen im neuen Räderlogistik Intranet. Hier finden Sie zukünftig alle wichtigen Informationen und Tools für Ihren Arbeitsalltag.',
    date: '16.04.2026',
    category: 'Allgemein',
  },
]

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userName = session.user.name || session.user.email?.split('@')[0] || 'Mitarbeiter'

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Startseite</h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left + Center Column */}
          <div className="xl:col-span-2 space-y-6">

            {/* Welcome Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-stretch">
                {/* Yellow accent bar */}
                <div className="w-1 bg-[#DCFF0C] shrink-0" />
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#DCFF0C]/10 rounded-lg shrink-0">
                      <Info className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Räderlogistik Intranet
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Willkommen zurück, <span className="font-medium text-gray-900">{userName}</span>!
                        Hier finden Sie alle wichtigen Werkzeuge und Informationen für Ihren Arbeitsalltag
                        bei Räderlogistik.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Nutzen Sie die Navigation auf der linken Seite, um zwischen den verschiedenen
                        Bereichen zu wechseln. Bei Fragen wenden Sie sich an die IT-Abteilung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Schnellzugriff
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickCards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-lg border ${card.color}`}>
                        {card.icon}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Aktuelles & Meldungen
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                {announcements.map((item) => (
                  <div key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <span className="text-xs text-gray-400 shrink-0 mt-0.5">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
                <div className="px-5 py-4 text-center">
                  <p className="text-sm text-gray-400 italic">
                    Hier werden zukünftig neue Meldungen erscheinen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Date & Time Widget */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-600">Datum & Uhrzeit</h2>
              </div>
              <DashboardClock />
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-600">Kalender</h2>
              </div>
              <MiniCalendar />
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Ihr Profil</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm text-gray-600">
                    Rolle:{' '}
                    <span className="font-medium capitalize">
                      {session.user.role?.toLowerCase() === 'admin' ? 'Administrator' : 'Benutzer'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mini Calendar Component (server-side rendered, static for current month)
function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ]

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  // First day of month (0=Sun, convert to Mon-based)
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Fill to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="p-4">
      {/* Month Header */}
      <div className="flex items-center justify-center mb-3">
        <span className="text-sm font-semibold text-gray-800">
          {monthNames[month]} {year}
        </span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center p-0.5"
          >
            {day !== null ? (
              <span
                className={`
                  w-7 h-7 flex items-center justify-center text-xs rounded-full font-medium
                  ${day === today
                    ? 'bg-[#DCFF0C] text-gray-900 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {day}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
