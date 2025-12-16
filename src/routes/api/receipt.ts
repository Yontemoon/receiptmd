import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/receipt")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ hello: "world" })
      },
      POST: async () => {
        return Response.json({ hello: "world" })
      },
    },
  },
})
