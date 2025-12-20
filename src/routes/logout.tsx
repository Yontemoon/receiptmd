import { redirect, createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "~/utils/supabase"

const logoutFn = createServerFn().handler(async () => {
  const { error } = await auth.signOut()

  if (error) {
    return {
      error: true,
      message: error.message,
    }
  }

  throw redirect({
    href: "/login",
  })
})

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
})
