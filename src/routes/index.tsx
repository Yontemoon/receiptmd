import { createFileRoute } from "@tanstack/react-router"
import React, { useTransition } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import FileInput from "~/components/file-input"
import { TItem, TReceipt } from "~/types/parsed.types"
import { DataTable } from "~/components/table/table"
import { ParsedItemColumn } from "~/components/columns/parsed-receipt"
export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
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
    console.log(items)
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
                <h2>Date Purchased: {info.date}</h2>
                <h2>Company Store: {info.company}</h2>

                <h2>Address: {info.address}</h2>
                <h2>City: {info.city}</h2>
                <h2>State: {info.state}</h2>
                <h2>Zip Code: {info.zipcode}</h2>
                <div>
                  {items && (
                    <DataTable
                      columns={ParsedItemColumn}
                      data={items}
                      setData={setItems}
                      defaultNewRow={{
                        normalize_name: "",
                        price: 0,
                        quantity: 1,
                        receipt_label: "",
                        sku: "",
                        tax_code: "",
                      }}
                    />
                  )}
                </div>
                <Button onClick={handleConfirmingParsedData}>
                  Confirm Edits
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
                <Spinner /> Adding
              </span>
            ) : (
              "Add"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
