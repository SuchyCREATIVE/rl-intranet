import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Users, Mail, ShieldCheck, ArrowRight, UserCheck, Clock } from 'lucide-react'

async function getStats() {
  try {
    const [totalUsers, adminCount, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])
    return { totalUsers, adminCount, recentUsers }
  } catch (e: unknown) {
    console.error('[AdminPage] getStats() FEHLER:', e)
    throw e
  }
}

export default async function AdminDashboardPage() {
  console.log('[AdminPage] render start')
  let stats
  try {
    stats = await getStats()
    console.log('[AdminPage] stats OK:', stats)
  } catch (e: unknown) {
    const err = e as Error
    return (
      <div style={{ padding: 32, fontFamily: 'monospace', color: 'red', background: '#fff' }}>
        <h2>Admin-Page Fehler (getStats)</h2>
        <p>{err?.message ?? String(e)}</p>
        <pre style={{ fontSize: 12, background: '#f0f0f0', padding: 16 }}>{err?.stack}</pre>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck size={24} style={{ color: '#DCFF0C' }} className="flex-shrink-0" />
          Admin-Bereich
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Verwaltung von Benutzern, E-Mail-Einstellungen und weiteren Konfigurationen.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(220, 255, 12, 0.15)' }}
          >
            <Users size={20} style={{ color: '#DCFF0C' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Benutzer gesamt</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(220, 255, 12, 0.15)' }}
          >
            <UserCheck size={20} style={{ color: '#DCFF0C' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.adminCount}</p>
            <p className="text-sm text-gray-500">Administratoren</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(220, 255, 12, 0.15)' }}
          >
            <Clock size={20} style={{ color: '#DCFF0C' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.recentUsers}</p>
            <p className="text-sm text-gray-500">Neu (letzte 30 Tage)</p>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Benutzer verwalten */}
          <Link
            href="/admin/users"
            className="group bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4 hover:border-[#DCFF0C] hover:shadow-md transition-all duration-200"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: '#111827' }}
            >
              <Users size={22} style={{ color: '#DCFF0C' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-900">
                Benutzer verwalten
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Benutzer anlegen, bearbeiten und löschen. Rollen und Zugriffsrechte vergeben.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: '#DCFF0C' }}>
                <span style={{ color: '#111827' }} className="group-hover:underline">Zur Benutzerverwaltung</span>
                <ArrowRight size={12} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* E-Mail-Einstellungen */}
          <Link
            href="/admin/email"
            className="group bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4 hover:border-[#DCFF0C] hover:shadow-md transition-all duration-200"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: '#111827' }}
            >
              <Mail size={22} style={{ color: '#DCFF0C' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">E-Mail-Einstellungen</h3>
              <p className="text-sm text-gray-500 mt-1">
                SMTP-Server konfigurieren, Verbindung testen und Absenderangaben hinterlegen.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium">
                <span style={{ color: '#111827' }} className="group-hover:underline">Zu den E-Mail-Einstellungen</span>
                <ArrowRight size={12} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Info box */}
      <div
        className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: 'rgba(220, 255, 12, 0.08)', borderColor: 'rgba(220, 255, 12, 0.3)' }}
      >
        <ShieldCheck size={18} style={{ color: '#DCFF0C' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Du befindest dich im Admin-Bereich. Änderungen hier betreffen alle Benutzer des Intranets.
          Bei Fragen hilft dir die{' '}
          <Link href="/admin/help" className="underline font-medium hover:text-gray-900">
            Hilfe-Seite
          </Link>{' '}
          weiter.
        </p>
      </div>
    </div>
  )
}
