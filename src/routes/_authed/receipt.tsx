import { createFileRoute, Outlet, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getReceipts } from "~/utils/supabase/receipt"

export const fetchReceipts = createServerFn({ method: "GET" }).handler(
  async () => {
    const data = await getReceipts()

    return data
  }
)

export const Route = createFileRoute("/_authed/receipt")({
  component: RouteComponent,
  loader: () => fetchReceipts(),
})

function RouteComponent() {
  const receipts = Route.useLoaderData()
  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {receipts.map((receipt) => {
          return (
            <li key={receipt.receipt_id} className="whitespace-nowrap">
              <Link
                to="/receipt/$receiptId"
                params={{
                  receiptId: receipt.receipt_id.toString(),
                }}
                className="block py-1 hover:underline"
                activeProps={{ className: "text-black font-bold" }}
              >
                <div>{receipt.purchased_at}</div>
              </Link>
            </li>
          )
        })}
      </ul>
      <Outlet />
    </div>
  )
}
