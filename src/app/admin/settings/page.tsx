import { Settings, Clock } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={22} className="text-gray-700 flex-shrink-0" />
          Allgemeine Einstellungen
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Systemweite Konfiguration des Intranets.
        </p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(220, 255, 12, 0.12)' }}
        >
          <Clock size={26} style={{ color: '#DCFF0C' }} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">Weitere Einstellungen folgen</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Dieser Bereich wird in einer zukünftigen Version mit weiteren Konfigurationsoptionen
            ausgebaut – z.B. Unternehmensname, Logo, Wartungsmodus.
          </p>
        </div>
      </div>
    </div>
  )
}
