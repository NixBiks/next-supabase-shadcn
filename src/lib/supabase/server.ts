import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { environment } from '@/lib/config'
import { type Database } from '@/lib/database.types'

export const createClientWithCustomOptions = (
  options: Parameters<typeof createServerClient>[2]
) => {
  return createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options
  )
}

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createClientWithCustomOptions({
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(key, value, options) {
        try {
          cookieStore.set({ name: key, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name, options) {
        try {
          cookieStore.delete({ name, ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
