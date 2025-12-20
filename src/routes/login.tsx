import React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Button } from "~/components/ui/button"
import { auth } from "~/utils/supabase"
import { Card, CardContent } from "~/components/ui/card"
import { z } from "zod"

export const Route = createFileRoute("/login")({
  component: LoginComp,
})

const ZSchema = z.object({
  origin: z.string(),
})

const googleLogin = createServerFn({ method: "POST" })
  .inputValidator(ZSchema)
  .handler(async ({ data }) => {
    const response = await auth.oAuthSignin("google", data.origin)

    return response.url
  })

function LoginComp() {
  const navigation = useNavigate()
  const [isPending, setIsPending] = React.useState(false)

  const handleLogin = async () => {
    setIsPending(true)
    const url = await googleLogin({
      data: {
        origin: window.location.origin,
      },
    })

    if (url) {
      await navigation({
        href: url,
        reloadDocument: true,
      })
    }
  }

  return (
    <div className="mx-auto flex max-w-sm justify-center mt-10 flex-col items-center gap-5">
      <h1 className="text-5xl mt-10">Receipt MD</h1>
      <div className="text-4xl text-center">
        Where you track
        <span className="font-bold"> your </span>
        spending
      </div>
      <Card>
        <CardContent className="w-full">
          <Button
            onClick={handleLogin}
            disabled={isPending}
            className="hover:cursor-pointer w-50"
          >
            {isPending ? "Loggin in..." : "Login with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
