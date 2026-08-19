import { Gallery } from '@/components/gallery'
import { getComponents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data, error } = await getComponents()
  if (error) console.error('[v0] Components load failed:', error.message)
  return <Gallery initialComponents={(data ?? []) as never[]} />
}
