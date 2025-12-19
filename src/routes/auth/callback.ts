import { createFileRoute } from "@tanstack/react-router"
import { getSupabaseServerClient } from "~/utils/supabase"
import { redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url)

        const code = requestUrl.searchParams.get("code")

        // const next = requestUrl.searchParams.get("next") || "/"

        if (code) {
          const supabase = getSupabaseServerClient()

          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (!error) {
            throw redirect({
              to: "/app",
            })
          }
        }

        // ! Add route for auth error
        return Response.json({ foo: "bar" })
      },
    },
  },
})
