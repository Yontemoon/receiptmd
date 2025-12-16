import { getCookies, setCookie } from "@tanstack/react-start/server"
import { createServerClient } from "@supabase/ssr"
import { Database } from "~/types/database.types"

export function getSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies: any[]) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value)
          })
        },
      },
    }
  )
}
