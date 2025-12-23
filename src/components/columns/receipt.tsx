import { Undo2, Check, Trash, Pencil } from "lucide-react"
import { Tables } from "~/types/database.types"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { ColumnHeader } from "~/components/table/header-dropdown"
import EditCell from "~/components/table/edit-cell"
import { Checkbox } from "~/components/ui/checkbox"

const ReceiptItemColumn: ColumnDef<
  Tables<"receipt_items"> & { products: Tables<"products"> | null }
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="w-full max-w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="w-full max-w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "raw_receipt_label",
    header: ({ column }) => {
      return <ColumnHeader title="Receipt Label" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
  },
  {
    accessorKey: "products.normalized_name",
    header: ({ column }) => {
      return <ColumnHeader title="Readable Name" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
  },
  {
    accessorKey: "total_line_price",
    header: ({ column }) => {
      return <ColumnHeader title="Total Price" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
    meta: {
      type: "number",
      isCurrency: true,
    },
  },
  {
    accessorKey: "unit_price",
    header: ({ column }) => {
      return <ColumnHeader title="Unit Price" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
    meta: {
      type: "number",
      isCurrency: true,
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return <ColumnHeader title="Quantity" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "products.standard_unit",
    header: ({ column }) => {
      return <ColumnHeader title="Unit" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
  },
  {
    accessorKey: "products.category",
    header: ({ column }) => {
      return <ColumnHeader title="Category" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta

      const setEditedRows = (e: React.MouseEvent<HTMLButtonElement>) => {
        const elName = e.currentTarget.name
        meta?.setEditedRows((old: []) => ({
          ...old,
          [row.id]: !old[Number(row.id)],
        }))
        if (elName !== "edit") {
          meta?.revertData(row.index, e.currentTarget.name === "cancel")
        }
      }

      const RemoveRow = () => {
        const rowIndex = row.index
        meta?.removeRow(rowIndex)
      }

      return meta?.editedRows[row.id] ? (
        <>
          <Button
            onClick={setEditedRows}
            size={"icon"}
            variant={"outline"}
            name="cancel"
          >
            <Undo2 />
          </Button>{" "}
          <Button
            onClick={setEditedRows}
            size={"icon"}
            variant={"outline"}
            name="done"
          >
            <Check />
          </Button>
        </>
      ) : (
        <div className="space-x-2">
          <Button
            onClick={setEditedRows}
            size={"icon"}
            variant={"outline"}
            name="edit"
          >
            <Pencil />
          </Button>
          <Button
            onClick={RemoveRow}
            name="remove"
            variant={"outline"}
            size={"icon"}
          >
            <Trash />
          </Button>
        </div>
      )
    },
  },
]

export { ReceiptItemColumn }
