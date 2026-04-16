'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, Eye, EyeOff } from 'lucide-react'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createSchema = z.object({
  username: z.string().min(2, 'Mindestens 2 Zeichen').max(50, 'Maximal 50 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  role: z.enum(['admin', 'redakteur']),
})

const editSchema = z.object({
  username: z.string().min(2, 'Mindestens 2 Zeichen').max(50, 'Maximal 50 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'Passwort muss mindestens 8 Zeichen lang sein',
    }),
  role: z.enum(['admin', 'redakteur']),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string
  username: string
  email: string
  role: string
  createdAt: Date
  lastLoginAt: Date | null
}

interface UserFormProps {
  user: UserRow | null
  onClose: () => void
  onSaved: (user: UserRow) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserForm({ user, onClose, onSaved }: UserFormProps) {
  const isEditing = user !== null
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFormData | EditFormData>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      role: (user?.role as 'admin' | 'redakteur') ?? 'redakteur',
    },
  })

  // Reset when user changes
  useEffect(() => {
    reset({
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      role: (user?.role as 'admin' | 'redakteur') ?? 'redakteur',
    })
    setServerError(null)
  }, [user, reset])

  async function onSubmit(data: CreateFormData | EditFormData) {
    setServerError(null)

    try {
      const url = isEditing ? `/api/admin/users/${user.id}` : '/api/admin/users'
      const method = isEditing ? 'PATCH' : 'POST'

      // For edit: omit empty password
      const body: Record<string, unknown> = { ...data }
      if (isEditing && !body.password) {
        delete body.password
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error ?? 'Ein Fehler ist aufgetreten.')
        return
      }

      onSaved(json.user)
    } catch {
      setServerError('Netzwerkfehler. Bitte versuche es erneut.')
    }
  }

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          style={{ background: '#111827' }}
        >
          <h2 className="text-base font-semibold text-white">
            {isEditing ? `Benutzer bearbeiten: ${user.username}` : 'Neuen Benutzer anlegen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {serverError}
            </div>
          )}

          {/* Benutzername */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Benutzername <span className="text-red-500">*</span>
            </label>
            <input
              {...register('username')}
              type="text"
              autoComplete="off"
              placeholder="z.B. max.mustermann"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="off"
              placeholder="max@raederlogistik.de"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Passwort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passwort{' '}
              {!isEditing && <span className="text-red-500">*</span>}
              {isEditing && (
                <span className="text-gray-400 font-normal text-xs ml-1">
                  (leer lassen = unverändert)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={
                  isEditing
                    ? '(gespeichert – leer lassen zum Beibehalten)'
                    : 'Mindestens 8 Zeichen'
                }
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Rolle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Rolle <span className="text-red-500">*</span>
            </label>
            <select
              {...register('role')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCFF0C] focus:border-transparent transition bg-white"
            >
              <option value="redakteur">Redakteur</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#DCFF0C', color: '#111827' }}
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? 'Speichern' : 'Benutzer anlegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
