import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Login } from "../components/Login"
import { getSupabaseServerClient } from "../utils/supabase"

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const { user } = Route.useRouteContext()
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/app"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/receipt"
          activeProps={{
            className: "font-bold",
          }}
        >
          Receipts
        </Link>
        <div className="ml-auto">
          {user ? (
            <>
              <span className="mr-2">{user.email}</span>
              <Link to="/logout">Logout</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
      <Outlet />
    </>
  )
}
