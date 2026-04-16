'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  email: string,
  password: string,
  callbackUrl: string
): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'E-Mail-Adresse oder Passwort ist falsch.' }
        default:
          return { error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' }
      }
    }
    // signIn mit redirectTo wirft eine NEXT_REDIRECT Exception — das ist normal
    throw error
  }
}
