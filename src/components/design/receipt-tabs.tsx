import React from "react"
import { Link } from "@tanstack/react-router"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { formatDate } from "~/lib/utils"

type PropTypes = {
  ReceiptData: {
    id: number
    purchasedTimestamp: string
    company: string | null | undefined
  }[]
}

const ReceiptTabs = ({ ReceiptData }: PropTypes) => {
  return (
    <Tabs orientation="vertical" className="w-full max-w-50">
      <TabsList className="w-full">
        {ReceiptData.map((receiptInfo) => {
          const formattedDate = formatDate(receiptInfo.purchasedTimestamp)
          return (
            <TabsTrigger
              value={receiptInfo.id.toString()}
              key={receiptInfo.id}
              asChild
            >
              <Link
                to="/receipt/$receiptId"
                params={{
                  receiptId: receiptInfo.id.toString(),
                }}
                className="py-2 hover:underline flex flex-col text-left"
              >
                <div className="font-medium">{formattedDate}</div>
                <span>{receiptInfo.company}</span>
              </Link>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export default ReceiptTabs
