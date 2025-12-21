import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"

export const Route = createFileRoute("/api/receipt/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params
        return json({ hello: id })
      },
    },
  },
})
