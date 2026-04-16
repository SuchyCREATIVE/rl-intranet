import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  ExternalLink,
  Bell,
  Calendar,
  Clock,
} from 'lucide-react'
import { DashboardClock } from '@/components/DashboardClock'

export const metadata = {
  title: 'Startseite – Räderlogistik Intranet',
}

interface QuickButton {
  label: string
  href: string
  icon: React.ReactNode
}

const quickButtons: QuickButton[] = [
  {
    label: 'Signaturen',
    href: '/signaturen',
    icon: <Mail className="w-4 h-4" />,
  },
  {
    label: 'Links',
    href: '/links',
    icon: <ExternalLink className="w-4 h-4" />,
  },
]

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
  if (!session?.user) redirect('/auth')

  const userName = session.user.name || session.user.email?.split('@')[0] || 'Mitarbeiter'

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Startseite</h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">

            {/* Welcome */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                Räderlogistik Intranet
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Willkommen zurück,{' '}
                <span className="font-medium text-gray-900">{userName}</span>!
                Hier finden Sie alle wichtigen Werkzeuge und Informationen für Ihren Arbeitsalltag
                bei Räderlogistik. Nutzen Sie die Navigation auf der linken Seite, um zwischen den
                verschiedenen Bereichen zu wechseln.
              </p>
            </div>

            {/* Schnellzugriff */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Schnellzugriff
              </h2>
              <div className="flex flex-wrap gap-3">
                {quickButtons.map((btn) => (
                  <Link
                    key={btn.href}
                    href={btn.href}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: '#1a1f2e' }}
                  >
                    {btn.icon}
                    {btn.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Aktuelles & Meldungen */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700">Aktuelles & Meldungen</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {announcements.map((item) => (
                  <div key={item.id} className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <span className="text-xs text-gray-400 shrink-0">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wide">
                        Weiterlesen +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="px-6 py-4 text-center">
                  <p className="text-sm text-gray-400 italic">
                    Hier werden zukünftig neue Meldungen erscheinen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Kalender */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-700">Kalender</h2>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Kalender bearbeiten
                </button>
              </div>
              <MiniCalendar />
            </div>

            {/* Datum & Uhrzeit */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700">Datum & Uhrzeit</h2>
              </div>
              <DashboardClock />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ]

  const dayNames = ['M', 'D', 'M', 'D', 'F', 'S', 'S']

  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {monthNames[month]} {year}
        </span>
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <div key={idx} className="flex items-center justify-center p-0.5">
            {day !== null ? (
              <span
                className={`
                  w-7 h-7 flex items-center justify-center text-xs rounded-full font-medium cursor-default
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
