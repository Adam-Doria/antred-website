import { createBrowserClient as supabaseCreateBrwoserClient } from '@supabase/ssr'

export function createBrowserClient() {
  return supabaseCreateBrwoserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
