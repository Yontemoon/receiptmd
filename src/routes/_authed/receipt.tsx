import { createFileRoute, Outlet, Await } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getReceipts } from "~/utils/supabase/receipt"
import ReceiptTabs from "~/components/design/receipt-tabs"

export const fetchReceipts = createServerFn({ method: "GET" }).handler(
  async () => {
    const data = await getReceipts()
    return data
  }
)

export const Route = createFileRoute("/_authed/receipt")({
  component: RouteComponent,

  loader: async () => {
    const data = await fetchReceipts()
    return data
  },
})

function RouteComponent() {
  const receiptData = Route.useLoaderData()

  const receiptTabs = receiptData.map((receipt) => {
    return {
      id: receipt.receipt_id,
      purchasedTimestamp: receipt.purchased_at,
      company: receipt.store?.company?.name,
    }
  })

  return (
    <div className="p-2 flex gap-2">
      <ReceiptTabs ReceiptData={receiptTabs} />
      <Outlet />
    </div>
  )
}
