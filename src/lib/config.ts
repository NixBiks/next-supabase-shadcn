import { object, string, parse } from 'valibot'

const environment = parse(
  object({
    NEXT_PUBLIC_SUPABASE_URL: string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
  }),
  process.env
)

export { environment }
