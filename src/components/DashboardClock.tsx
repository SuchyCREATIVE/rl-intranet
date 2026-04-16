'use client'

import { useState, useEffect } from 'react'

const DAY_NAMES = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
  'Donnerstag', 'Freitag', 'Samstag',
]

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function DashboardClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) {
    return (
      <div className="p-5 text-center">
        <div className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
          --:--:--
        </div>
        <div className="text-sm text-gray-500 mt-1">Laden...</div>
      </div>
    )
  }

  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())
  const dayName = DAY_NAMES[now.getDay()]
  const day = now.getDate()
  const month = MONTH_NAMES[now.getMonth()]
  const year = now.getFullYear()

  return (
    <div className="p-5 text-center">
      {/* Time */}
      <div className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight font-mono">
        {hours}
        <span className="animate-pulse text-gray-400">:</span>
        {minutes}
        <span className="text-lg font-normal text-gray-400">:{seconds}</span>
      </div>
      {/* Date */}
      <div className="text-sm font-medium text-gray-700 mt-1">
        {dayName}
      </div>
      <div className="text-sm text-gray-500">
        {day}. {month} {year}
      </div>
      {/* KW */}
      <div className="text-xs text-gray-400 mt-1">
        KW {getWeekNumber(now)}
      </div>
    </div>
  )
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
