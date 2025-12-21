import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/receipt/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/receipt/"!</div>
}
