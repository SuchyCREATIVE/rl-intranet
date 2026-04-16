import { prisma } from '@/lib/prisma'
import { Users, UserPlus } from 'lucide-react'
import UsersTable from './UsersTable'

async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}

export default async function UsersPage() {
  const users = await getAllUsers()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={22} className="text-gray-700 flex-shrink-0" />
            Benutzerverwaltung
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} {users.length === 1 ? 'Benutzer' : 'Benutzer'} im System
          </p>
        </div>
      </div>

      {/* Table with client interactions */}
      <UsersTable initialUsers={users} />
    </div>
  )
}
