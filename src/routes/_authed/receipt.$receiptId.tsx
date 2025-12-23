import React from "react"
import {
  createFileRoute,
  useRouter,
  useLoaderData,
  useRouterState,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getReceiptItems } from "~/utils/supabase/receipt_items"
import { deleteReceipt } from "~/utils/supabase/receipt"
import { Button } from "~/components/ui/button"
import { useTransition } from "react"
import { DataTable } from "~/components/table"
import { ReceiptItemColumn } from "~/components/columns/receipt"
import { TTotals } from "~/types/parsed.types"

const fetchReceipt = createServerFn({ method: "GET" })
  .inputValidator((d: number) => d)
  .handler(async ({ data: receiptId }) => {
    const data = await getReceiptItems(receiptId)

    return data
  })

const deleteReceiptAction = createServerFn({ method: "GET" })
  .inputValidator((receiptNum: number) => receiptNum)
  .handler(async ({ data: receiptId }) => {
    const { success } = await deleteReceipt(receiptId)
    return success
  })

export const Route = createFileRoute("/_authed/receipt/$receiptId")({
  pendingComponent: () => {
    return <div>Loading...</div>
  },
  loader: ({ params: { receiptId } }) => {
    return fetchReceipt({ data: Number(receiptId) })
  },

  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { receiptId } = params
  const receiptItems = Route.useLoaderData()
  const parentReceiptData = useLoaderData({
    from: "/_authed/receipt",
  })
  const receiptIds = parentReceiptData.map((receipt) => receipt.receipt_id)

  const navigate = Route.useNavigate()
  const routerState = useRouterState()
  const isLoading = routerState.isLoading
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tableData, setTableData] = React.useState(receiptItems.receipt_items)

  const totalsFormatted: TTotals = {
    subtotal: receiptItems.subtotal || 0,
    tax: receiptItems.tax || 0,
    tip: receiptItems.tip || 0,
    grand_total: receiptItems.grand_total || 0,
  }

  if (isLoading) {
    return <div>Loading....</div>
  }

  return (
    <div className="w-full container mx-auto">
      <h1>{receiptItems.store_id}</h1>
      <h1>{receiptItems.store?.company?.name}</h1>
      <h1>{receiptItems.store?.street_line}</h1>
      <h1>{receiptItems.store?.state}</h1>
      <h1>{receiptItems.store?.city}</h1>
      <DataTable
        data={tableData}
        columns={ReceiptItemColumn}
        setData={setTableData}
        totals={totalsFormatted}
      />

      <Button
        onClick={async () => {
          startTransition(async () => {
            const receiptNum = Number(receiptId)
            const success = await deleteReceiptAction({ data: receiptNum })

            if (success) {
              await router.invalidate({
                filter(match) {
                  return match.id === "/post"
                },
              })

              const newReceipts = receiptIds.filter(
                (receipt) => receipt !== Number(params.receiptId)
              )

              navigate({
                to: "/receipt/$receiptId",
                params: {
                  receiptId: newReceipts[0].toString(),
                },
              })
            }
          })
        }}
        disabled={isPending}
      >
        Delete Receipt
      </Button>
    </div>
  )
}
