import { createClient } from '@supabase/supabase-js'

// Strip surrounding quotes/whitespace that can sneak in from a .env file.
// A value like 'https://xyz.supabase.co' (with literal quotes) produces an
// invalid URL and causes "TypeError: fetch failed" at runtime.
function cleanEnv(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, '')
}

const supabaseUrl =
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
  cleanEnv(process.env.SUPABASE_URL) ??
  'https://placeholder.supabase.co'
// Public/anon key used for read-only gallery queries.
const supabaseKey =
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
  cleanEnv(process.env.SUPABASE_ANON_KEY) ??
  'placeholder-key'
  
export const supabase = createClient(supabaseUrl, supabaseKey)

export type ComponentRecord = {
  id: string
  title: string
  description: string
  category: string
  code: string
  created_at: string
}

export async function getComponents() {
  return supabase.from('Components').select('*').order('created_at', { ascending: false })
}

export async function createComponent(component: Omit<ComponentRecord, 'id' | 'created_at'>) {
  return supabase.from('Components').insert(component).select().single()
}
