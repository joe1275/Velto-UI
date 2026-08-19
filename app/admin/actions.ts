'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE = 'velto-admin-access'

function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE ?? '88117756'
}

export async function authenticateAdmin(passcode: string) {
  const expected = getAdminPasscode()
  if (!expected || passcode !== expected) return { ok: false, message: 'Invalid passcode.' }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, 'granted', {
    httpOnly: true,
    sameSite: 'lax',   // ← غير من none
    secure: false,      // ← غير من true
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return { ok: true }
}

export async function createAdminComponent(component: {
  title: string
  description: string
  category: string
  code: string
}) {
  const cookieStore = await cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'granted') {
    return { error: 'Admin access required.' }
  }

  const cleanEnv = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '')
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL)
  // Writes use the secret/service-role key so they bypass RLS.
  const key =
    cleanEnv(process.env.API_KEY) ??
    cleanEnv(process.env.JWT_2) ??
    cleanEnv(process.env.SUPABASE_SECRET_KEY) ??
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!url || !key) return { error: 'Supabase configuration is missing.' }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  const { error } = await supabase.from('Components').insert(component)
  return error ? { error: error.message } : { error: null }
}

export async function checkAdminAccess() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'granted'
}
