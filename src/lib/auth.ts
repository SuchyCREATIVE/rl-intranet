import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { NextAuthConfig } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
    }
  }
  interface User {
    role: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: string
    email: string
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'rl-intranet-secret-2026',
  basePath: '/api/auth',
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-Mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email as string
        const password = credentials.password as string
        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user || !user.passwordHash) return null
          const valid = await bcrypt.compare(password, user.passwordHash)
          if (!valid) return null
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: string }).role
        token.email = (user.email ?? '') as string
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
