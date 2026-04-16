'use client'

import { useState } from 'react'
import { UserPlus, Pencil, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react'
import UserForm from './UserForm'

interface UserRow {
  id: string
  username: string
  email: string
  role: string
  createdAt: Date
  lastLoginAt: Date | null
}

interface UsersTableProps {
  initialUsers: UserRow[]
}

function formatDate(date: Date | null): string {
  if (!date) return '–'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditUser(null)
    setShowForm(true)
  }

  function openEdit(user: UserRow) {
    setEditUser(user)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditUser(null)
  }

  async function handleDelete(user: UserRow) {
    const confirmed = window.confirm(
      `Benutzer "${user.username}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
    )
    if (!confirmed) return

    setDeletingId(user.id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Fehler beim Löschen.')
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch {
      setError('Netzwerkfehler beim Löschen.')
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved(saved: UserRow) {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === saved.id)
      if (exists) {
        return prev.map((u) => (u.id === saved.id ? saved : u))
      }
      return [...prev, saved]
    })
    closeForm()
  }

  return (
    <>
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 ml-4 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
          style={{ background: '#DCFF0C', color: '#111827' }}
        >
          <UserPlus size={16} />
          Neuer Benutzer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Benutzername</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">E-Mail</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Rolle</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Erstellt</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Letzte Anmeldung</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Keine Benutzer vorhanden.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#DCFF0C', color: '#111827' }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      {user.username}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{user.email}</td>
                  <td className="px-5 py-3.5">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        <ShieldCheck size={11} />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        <UserIcon size={11} />
                        Redakteur
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={deletingId === user.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        title="Löschen"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <UserForm
          user={editUser}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
