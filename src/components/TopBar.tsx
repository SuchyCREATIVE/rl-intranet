'use client'

import { Search } from 'lucide-react'

interface TopBarProps {
  userName?: string
}

export function TopBar({ userName }: TopBarProps) {
  const displayName = userName || 'Benutzer'

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 z-20">
      <div className="flex-1">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Start typing to search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-700 font-medium select-none">
        <span>Hi, {displayName}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  )
}
