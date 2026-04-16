import { ExternalLink, Construction } from 'lucide-react'

export const metadata = {
  title: 'Links – Räderlogistik Intranet',
}

export default function LinksPage() {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Links</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <Construction className="w-10 h-10 text-amber-500" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Hier werden bald nützliche Links erscheinen
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            Dieser Bereich befindet sich noch im Aufbau. In Kürze finden Sie hier
            eine Sammlung nützlicher interner und externer Links für Ihren Arbeitsalltag.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              { label: 'Interne Systeme', placeholder: 'ERP, CRM, ...' },
              { label: 'Partner-Portale', placeholder: 'Lieferanten, Partner, ...' },
              { label: 'Formulare', placeholder: 'HR, Buchhaltung, ...' },
              { label: 'Externe Ressourcen', placeholder: 'Brancheninfos, Normen, ...' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50"
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm text-gray-400 mt-1 italic">{item.placeholder}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
