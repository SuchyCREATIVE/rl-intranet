import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const result: Record<string, unknown> = {}
  
  try {
    // Test 1: DB verbindung
    const user = await prisma.user.findUnique({ where: { email: 'dennis@suchycreative.de' } })
    result.userFound = !!user
    result.userEmail = user?.email
    result.userRole = user?.role
    
    if (user) {
      // Test 2: Passwort
      const valid = await bcrypt.compare('password', user.passwordHash)
      result.passwordValid = valid
      
      // Test 3: lastLoginAt update
      try {
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        result.lastLoginAtUpdate = 'OK'
      } catch(e) {
        result.lastLoginAtUpdate = `ERROR: ${e instanceof Error ? e.message : String(e)}`
      }
    }
  } catch(e) {
    result.error = e instanceof Error ? e.message : String(e)
    result.stack = e instanceof Error ? e.stack : undefined
  }
  
  return NextResponse.json(result)
}
