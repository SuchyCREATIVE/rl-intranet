import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'

export default async function IntranetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const userName = session.user.name || session.user.email?.split('@')[0]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Top Bar */}
      <TopBar userName={userName} />

      {/* Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          userEmail={session.user.email}
          userName={session.user.name ?? undefined}
          userRole={session.user.role}
        />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
