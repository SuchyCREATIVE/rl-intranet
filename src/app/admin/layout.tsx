import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { LayoutDashboard, Users, Mail, Settings, HelpCircle, ShieldCheck } from 'lucide-react'
import AdminSidebarClient from './AdminSidebarClient'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Benutzer', icon: Users },
  { href: '/admin/email', label: 'E-Mail', icon: Mail },
  { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
  { href: '/admin/help', label: 'Hilfe', icon: HelpCircle },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session
  try {
    session = await auth()
  } catch (e: unknown) {
    const err = e as Error
    return (
      <div style={{ padding: 32, fontFamily: 'monospace', color: 'red' }}>
        <h2>auth() Fehler im Admin-Layout</h2>
        <p><strong>Message:</strong> {err?.message ?? String(e)}</p>
        <pre style={{ background: '#f0f0f0', padding: 16, overflow: 'auto', fontSize: 12 }}>{err?.stack ?? ''}</pre>
      </div>
    )
  }

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  if (session.user.role !== 'admin') {
    redirect('/login?error=unauthorized')
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: '#111827' }}
      >
        {/* Logo / Brand */}
        <div className="flex flex-col gap-1 px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: '#DCFF0C' }}
            >
              Räderlogistik
            </span>
          </Link>
          {/* Admin Badge */}
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck
              size={13}
              style={{ color: '#DCFF0C' }}
              className="flex-shrink-0"
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ color: '#111827', background: '#DCFF0C' }}
            >
              Admin-Bereich
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <AdminSidebarClient navItems={adminNavItems} />
        </nav>

        {/* Footer: User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#DCFF0C', color: '#111827' }}
            >
              {session.user.name?.charAt(0).toUpperCase() ??
                session.user.email?.charAt(0).toUpperCase() ??
                'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name ?? session.user.email}
              </p>
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0"
          style={{ background: '#ffffff' }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Admin-Bereich</span>
          </div>
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Zurück zum Intranet
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
