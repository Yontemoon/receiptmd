import { createFileRoute } from "@tanstack/react-router"
import React, { useTransition } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import FileInput from "~/components/file-input"
import { TItem, TReceipt } from "~/types/parsed.types"
import { DataTable } from "~/components/table/table"
import { ParsedItemColumn } from "~/components/columns/parsed-receipt"

export const Route = createFileRoute("/_authed/app")({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [info, setInfo] = React.useState<TReceipt | null>(null)
  const [items, setItems] = React.useState<TItem[]>([])
  const [file, setFile] = React.useState<File | null>(null)

  const handleClick = async () => {
    if (file) {
      setInfo(null)
      startTransition(async () => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/parse_receipt", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()

        if (data.message) {
          setInfo(data.message)
          setItems(data.message.items)
        }
      })
    }
  }

  const handleConfirmingParsedData = async () => {
    startTransition(async () => {
      const response = await fetch("/api/receipt", {
        method: "POST",
        body: JSON.stringify(info),
      })

      const { success, message } = await response.json()
      console.log(success)
      console.log(message)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px] m-4">
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {info ? (
              <>
                <h2>Date Purchased: {info.transaction.date}</h2>
                <h2>Date Purchased: {info.transaction.time}</h2>
                <h2>Company Store: {info.merchant.name}</h2>
                <h2>Store Number: {info.merchant.store_number}</h2>
                <h2>Address: {info.merchant.street_line}</h2>
                <h2>City: {info.merchant.city}</h2>
                <h2>State: {info.merchant.state}</h2>
                <h2>Zip Code: {info.merchant.zipcode}</h2>
                <div>
                  {items && (
                    <DataTable
                      columns={ParsedItemColumn}
                      data={items}
                      setData={setItems}
                      defaultNewRow={{
                        normalized_name: "",
                        unit_price: 0,
                        total_line_price: 0,
                        category: "",
                        sku_or_upc: "",
                        quantity: 1,
                        raw_text: "",
                        sku: "",
                        tax_code: "",
                        standard_unit: "USD",
                      }}
                      totals={info.totals}
                    />
                  )}
                </div>
                <Button
                  onClick={handleConfirmingParsedData}
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Confirm Edits"}
                </Button>
              </>
            ) : (
              "No data yet..."
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <FileInput
            file={file}
            onChange={(file) => {
              setFile(file)
            }}
          />
          <Button onClick={handleClick} disabled={isPending} className="w-full">
            {isPending ? (
              <span className=" flex items-center gap-2">
                <Spinner /> Parsing
              </span>
            ) : (
              "Parse"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
