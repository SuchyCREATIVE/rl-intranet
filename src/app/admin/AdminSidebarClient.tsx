'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

interface AdminSidebarClientProps {
  navItems: NavItem[]
}

export default function AdminSidebarClient({ navItems }: AdminSidebarClientProps) {
  const pathname = usePathname()

  function isActive(item: NavItem): boolean {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(item)
        const Icon = item.icon
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                active
                  ? {
                      background: 'rgba(220, 255, 12, 0.12)',
                      color: '#DCFF0C',
                    }
                  : {
                      color: '#d1d5db',
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#1f2937'
                  e.currentTarget.style.color = '#ffffff'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.color = '#d1d5db'
                }
              }}
            >
              <Icon
                size={17}
                style={{ color: active ? '#DCFF0C' : 'currentColor' }}
                className="flex-shrink-0"
              />
              {item.label}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#DCFF0C' }}
                />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
