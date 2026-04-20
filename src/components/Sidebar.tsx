'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Mail,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

interface NavGroup {
  label?: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Startseite', href: '/dashboard', icon: <Home className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Signaturen', href: '/signaturen', icon: <Mail className="w-4 h-4" /> },
      { label: 'Links', href: '/links', icon: <ExternalLink className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Admin', href: '/admin', icon: <ShieldCheck className="w-4 h-4" />, adminOnly: true },
    ],
  },
]

interface SidebarProps {
  userEmail?: string
  userName?: string
  userRole?: string
}

export function Sidebar({ userEmail, userName, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isAdmin = userRole === 'ADMIN' || userRole === 'admin'

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ redirect: false })
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 248 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden"
      style={{ backgroundColor: '#1c1c1c' }}
    >
      {/* Logo Area */}
      <div
        className="flex items-center justify-between px-4 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 60 }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <Image
                src="/logos/raederlogistik-Logo-negativ.svg"
                alt="Räderlogistik"
                width={130}
                height={40}
                priority
                className="h-9 w-auto shrink-0"
              />
              <div className="w-px h-5 shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Intranet
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center w-full"
            >
              <Image
                src="/logos/raederlogistik-Logo-Rand-256x256px.png"
                alt="RL"
                width={28}
                height={28}
                className="w-7 h-7 object-contain opacity-80"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin)
          if (visibleItems.length === 0) return null

          return (
            <div key={groupIdx} className={groupIdx > 0 ? 'mt-5' : ''}>
              <AnimatePresence>
                {!collapsed && group.label && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-4 mb-1"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {group.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <ul className="space-y-0.5 px-2">
                {visibleItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`
                          group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                          transition-all duration-150 relative
                          ${collapsed ? 'justify-center' : ''}
                        `}
                        style={{
                          color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                          backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                        }}
                        onMouseEnter={e => {
                          if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
                        }}
                        onMouseLeave={e => {
                          if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                        }}
                      >
                        {/* Gelber Akzentstreifen links bei aktivem Item */}
                        {active && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                            style={{ backgroundColor: '#DCFF0C' }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          />
                        )}

                        <span className="shrink-0" style={{ color: active ? '#DCFF0C' : 'rgba(255,255,255,0.35)' }}>
                          {item.icon}
                        </span>

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 space-y-0.5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${collapsed ? 'justify-center' : ''}`}>
          <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <User className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-medium truncate whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {userName || 'Benutzer'}
                </p>
                <p className="text-xs truncate whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {userEmail || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Abmelden' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-50 ${collapsed ? 'justify-center' : ''}`}
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {isLoggingOut ? 'Abmelden...' : 'Abmelden'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg"
        style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
        aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  )
}
