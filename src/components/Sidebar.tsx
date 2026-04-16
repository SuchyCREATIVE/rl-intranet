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

const navItems: NavItem[] = [
  {
    label: 'Startseite',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Signaturen',
    href: '/signaturen',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: 'Links',
    href: '/links',
    icon: <ExternalLink className="w-5 h-5" />,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: <ShieldCheck className="w-5 h-5" />,
    adminOnly: true,
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

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

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
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden"
      style={{ backgroundColor: '#111827' }}
    >
      {/* Logo Area */}
      <div
        className="flex items-center justify-between px-4 py-5 border-b"
        style={{ borderColor: '#1f2937' }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center overflow-hidden"
            >
              <Image
                src="/logos/raederlogistik-Logo-negativ.svg"
                alt="Räderlogistik"
                width={140}
                height={38}
                priority
                className="h-8 w-auto"
              />
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
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {visibleItems.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-all duration-150 relative
                    ${
                      active
                        ? 'text-[#DCFF0C] bg-[#1f2937]'
                        : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#DCFF0C]"
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}

                  {/* Icon */}
                  <span className={`shrink-0 ${active ? 'text-[#DCFF0C]' : 'text-gray-500 group-hover:text-white'}`}>
                    {item.icon}
                  </span>

                  {/* Label */}
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
      </nav>

      {/* User + Logout Area */}
      <div className="border-t px-2 py-3 space-y-1" style={{ borderColor: '#1f2937' }}>
        {/* User Info */}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
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
                <p className="text-sm font-medium text-gray-200 truncate whitespace-nowrap">
                  {userName || 'Benutzer'}
                </p>
                <p className="text-xs text-gray-500 truncate whitespace-nowrap">
                  {userEmail || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Abmelden' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-gray-400 hover:text-red-400 hover:bg-[#1f2937]
            transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
            ${collapsed ? 'justify-center' : ''}
          `}
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

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-[#374151] border border-[#4b5563] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#4b5563] transition-all duration-150 shadow-lg"
        aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.aside>
  )
}
