import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getReceiptById } from "~/utils/supabase/receipt"
import { getReceiptItems } from "~/utils/supabase/receipt_items"

const getReceipt = createServerFn({ method: "GET" })
  .inputValidator((d: number) => d)
  .handler(async ({ data: receiptId }) => {
    const data = await getReceiptItems(receiptId)
    return data
  })

export const Route = createFileRoute("/_authed/receipt/$receiptId")({
  loader: ({ params: { receiptId } }) => {
    return getReceipt({ data: Number(receiptId) })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const receiptItems = Route.useLoaderData()

  return (
    <div>
      <ul>
        {receiptItems.map((receiptItem) => {
          return (
            <li key={receiptItem.product_id}>
              {receiptItem.products?.normalized_name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
