import { getCookies, setCookie } from "@tanstack/react-start/server"
import { createServerClient } from "@supabase/ssr"
import { Database } from "~/types/database.types"
import { Provider } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL as string
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL")
if (!supabaseKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY")

const getSupabaseServerClient = () => {
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies: Array<{ name: string; value: string }>) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value)
        })
      },
    },
  })
}

const auth = {
  emailPasswordSignin: async (email: string, password: string) => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  oAuthSignin: async (provider: Provider, origin: string) => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  },

  signUp: async (email: string, password: string) => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getSession: async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  getUser: async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },
}

export { getSupabaseServerClient, auth }
