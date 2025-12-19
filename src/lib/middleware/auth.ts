import { createMiddleware } from "@tanstack/react-start"
import { getSupabaseServerClient } from "~/utils/supabase"

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error } = await supabase.auth.getClaims()

  const result = await next({
    context: {
      user: data,
    },
  })
  return result
})

export { authMiddleware }
