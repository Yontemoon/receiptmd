import { createFileRoute, Link, Await, defer } from "@tanstack/react-router"
import React from "react"
import { Button } from "~/components/ui/button"

export const Route = createFileRoute("/")({
  component: Home,
  loader({ context }) {
    const userPromise = Promise.resolve(context.user)
    const deferred = defer(userPromise)
    return { userPromise: deferred }
  },
})

function Home() {
  const { userPromise } = Route.useLoaderData()

  return (
    <div>
      <div className="p-2 flex gap-2 text-lg">
        <div className="flex justify-between w-full">
          <Link to="/">ReceiptMD</Link>
          <React.Suspense fallback={<Button disabled>Login</Button>}>
            <Await promise={userPromise}>
              {(user) =>
                user ? (
                  <Button asChild>
                    <Link to="/app">Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={"/login"}>Login</Link>
                  </Button>
                )
              }
            </Await>
          </React.Suspense>
        </div>
      </div>
      <div>This is main body</div>
    </div>
  )
}
