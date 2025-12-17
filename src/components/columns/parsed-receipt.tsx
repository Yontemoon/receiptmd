import { Undo2, Check, Trash, Pencil } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { TItem } from "~/types/parsed.types"
import { Button } from "~/components/ui/button"
import { ColumnHeader } from "~/components/table/header-dropdown"
import EditCell from "~/components/table/edit-cell"
import { Checkbox } from "~/components/ui/checkbox"

const ParsedItemColumn: ColumnDef<TItem>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "normalize_name",
    header: ({ column }) => {
      return <ColumnHeader title="Name" column={column} />
    },
    cell: ({ getValue, row, column, table }) => {
      return (
        <EditCell getValue={getValue} row={row} column={column} table={table} />
      )
    },
  },
  {
    accessorKey: "receipt_label",
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
    accessorKey: "price",
    header: ({ column }) => {
      return <ColumnHeader title="Price" column={column} />
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

export { ParsedItemColumn }
