'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Save, Send, Loader2, CheckCircle, AlertCircle, Info, Eye, EyeOff } from 'lucide-react'

// ─── Schema ───────────────────────────────────────────────────────────────────

const smtpSchema = z.object({
  smtp_host: z.string().min(1, 'SMTP-Host ist erforderlich'),
  smtp_port: z.string().regex(/^\d+$/, 'Port muss eine Zahl sein'),
  smtp_user: z.string().min(1, 'SMTP-Benutzer ist erforderlich'),
  smtp_pass: z.string().optional(),
  smtp_from: z.string().email('Ungültige Absender-E-Mail'),
  smtp_from_name: z.string().optional(),
  smtp_secure: z.enum(['true', 'false']),
})

type SmtpFormData = z.infer<typeof smtpSchema>

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SmtpFormData>({
    resolver: zodResolver(smtpSchema),
    defaultValues: {
      smtp_host: '',
      smtp_port: '587',
      smtp_user: '',
      smtp_pass: '',
      smtp_from: '',
      smtp_from_name: '',
      smtp_secure: 'false',
    },
  })

  // Load current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings')
        if (!res.ok) return
        const data = await res.json()
        const s = data.settings
        reset({
          smtp_host: s.smtp_host ?? '',
          smtp_port: s.smtp_port ?? '587',
          smtp_user: s.smtp_user ?? '',
          smtp_pass: s.smtp_pass ?? '',
          smtp_from: s.smtp_from ?? '',
          smtp_from_name: s.smtp_from_name ?? '',
          smtp_secure: s.smtp_secure === 'true' ? 'true' : 'false',
        })
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [reset])

  async function onSave(data: SmtpFormData) {
    setSaveStatus('saving')
    setSaveMessage(null)
    setTestMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        setSaveStatus('error')
        setSaveMessage(json.error ?? 'Fehler beim Speichern.')
        return
      }

      setSaveStatus('success')
      setSaveMessage('Einstellungen wurden gespeichert.')
      // Refetch to get masked password
      const refreshRes = await fetch('/api/admin/settings')
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        const s = refreshData.settings
        reset({
          smtp_host: s.smtp_host ?? '',
          smtp_port: s.smtp_port ?? '587',
          smtp_user: s.smtp_user ?? '',
          smtp_pass: s.smtp_pass ?? '',
          smtp_from: s.smtp_from ?? '',
          smtp_from_name: s.smtp_from_name ?? '',
          smtp_secure: s.smtp_secure === 'true' ? 'true' : 'false',
        })
      }
    } catch {
      setSaveStatus('error')
      setSaveMessage('Netzwerkfehler. Bitte versuche es erneut.')
    }

    setTimeout(() => setSaveStatus('idle'), 4000)
  }

  async function handleTestMail() {
    setTestStatus('sending')
    setTestMessage(null)
    setSaveMessage(null)

    try {
      const res = await fetch('/api/admin/email/test', { method: 'POST' })
      const json = await res.json()

      if (!res.ok) {
        setTestStatus('error')
        setTestMessage(json.error ?? 'Test-Mail konnte nicht gesendet werden.')
        return
      }

      setTestStatus('success')
      setTestMessage(json.message ?? 'Test-Mail wurde erfolgreich gesendet.')
    } catch {
      setTestStatus('error')
      setTestMessage('Netzwerkfehler. Bitte versuche es erneut.')
    }

    setTimeout(() => setTestStatus('idle'), 6000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail size={22} className="text-gray-700 flex-shrink-0" />
          E-Mail-Einstellungen
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          SMTP-Konfiguration für den Versand von System-E-Mails.
        </p>
      </div>

      {/* Microsoft 365 hint */}
      <div
        className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
        style={{ background: 'rgba(220, 255, 12, 0.07)', borderColor: 'rgba(220, 255, 12, 0.35)' }}
      >
        <Info size={16} style={{ color: '#DCFF0C' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Microsoft 365:</span> Host{' '}
          <code className="bg-white/70 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">
            smtp.office365.com
          </code>{' '}
          &middot; Port{' '}
          <code className="bg-white/70 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">
            587
          </code>{' '}
          (STARTTLS) &middot; Sicherheit: <strong>STARTTLS</strong> (kein SSL/TLS)
        </p>
      </div>

      {/* Status messages */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm border ${
            saveStatus === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {saveStatus === 'success' ? (
            <CheckCircle size={15} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={15} className="flex-shrink-0" />
          )}
          {saveMessage}
        </div>
      )}

      {testMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm border ${
            testStatus === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {testStatus === 'success' ? (
            <CheckCircle size={15} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={15} className="flex-shrink-0" />
          )}
          {testMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Server-Konfiguration
          </h2>

          {/* Host + Port */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SMTP-Host <span className="text-red-500">*</span>
              </label>
              <input
                {...register('smtp_host')}
                type="text"
                placeholder="smtp.office365.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
              />
              {errors.smtp_host && (
                <p className="text-red-500 text-xs mt-1">{errors.smtp_host.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                {...register('smtp_port')}
                type="text"
                placeholder="587"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
              />
              {errors.smtp_port && (
                <p className="text-red-500 text-xs mt-1">{errors.smtp_port.message}</p>
              )}
            </div>
          </div>

          {/* Sicherheit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Verbindungssicherheit
            </label>
            <select
              {...register('smtp_secure')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition bg-white"
            >
              <option value="false">STARTTLS (Port 587 – empfohlen für Microsoft 365)</option>
              <option value="true">SSL/TLS (Port 465)</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Zugangsdaten
          </h2>

          {/* Benutzername */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Benutzername <span className="text-red-500">*</span>
            </label>
            <input
              {...register('smtp_user')}
              type="text"
              autoComplete="off"
              placeholder="intranet@raederlogistik.de"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
            />
            {errors.smtp_user && (
              <p className="text-red-500 text-xs mt-1">{errors.smtp_user.message}</p>
            )}
          </div>

          {/* Passwort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort</label>
            <div className="relative">
              <input
                {...register('smtp_pass')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="(gespeichert – leer lassen zum Beibehalten)"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Absender
          </h2>

          {/* Absender-E-Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Absender-E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              {...register('smtp_from')}
              type="email"
              placeholder="intranet@raederlogistik.de"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
            />
            {errors.smtp_from && (
              <p className="text-red-500 text-xs mt-1">{errors.smtp_from.message}</p>
            )}
          </div>

          {/* Absender-Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Absender-Name{' '}
              <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              {...register('smtp_from_name')}
              type="text"
              placeholder="Räderlogistik Intranet"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            type="button"
            onClick={handleTestMail}
            disabled={testStatus === 'sending'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {testStatus === 'sending' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {testStatus === 'sending' ? 'Sende...' : 'Test-Mail senden'}
          </button>

          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: '#DCFF0C', color: '#111827' }}
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saveStatus === 'saving' ? 'Speichern...' : 'Einstellungen speichern'}
          </button>
        </div>
      </form>
    </div>
  )
}
