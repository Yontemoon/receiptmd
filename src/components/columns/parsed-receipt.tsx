import { ColumnDef } from "@tanstack/react-table"
import { TItem } from "~/types/parsed.types"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ColumnHeader } from "~/components/table/header-dropdown"

const ParsedItemColumn: ColumnDef<TItem>[] = [
  {
    accessorKey: "normalize_name",
    header: ({ column }) => {
      return <ColumnHeader title="Name" column={column} />
    },
  },
  {
    accessorKey: "receipt_label",
    header: ({ column }) => {
      return <ColumnHeader title="Receipt Label" column={column} />
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <ColumnHeader title="Price" column={column} />
    },
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return <ColumnHeader title="Quantity" column={column} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.receipt_label)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { ParsedItemColumn }
