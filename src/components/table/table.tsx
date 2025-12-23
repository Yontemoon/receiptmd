"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCaption,
} from "~/components/ui/table"
import { ViewOption } from "./column-toggle"
import { Button } from "../ui/button"
import { TTotals } from "~/types/parsed.types"
import { centsToDollars } from "~/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultNewRow?: TData
  totals: TTotals
  setData: React.Dispatch<React.SetStateAction<TData[]>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setData,
  defaultNewRow,
  totals,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  // const [tableData, setTableData] = React.useState<TData[]>([...data])
  const [originalData, setOriginalData] = React.useState<TData[]>([...data])
  const [editedRows, setEditedRows] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      editedRows,
      setEditedRows,
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          )
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          )
        }
      },
      addRow: (newRow) => {
        const setFunc = (old: TData[]) => [...old, newRow]

        setData(setFunc)
        setOriginalData(setFunc)
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: TData[]) => {
          return old.filter((_row, index) => {
            return index !== rowIndex
          })
        }

        setData(setFilterFunc)
        setOriginalData(setFilterFunc)
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: TData[]) => {
          return old.filter((_row, index) => {
            return !selectedRows.includes(index)
          })
        }
        setData(setFilterFunc)
        setOriginalData(setFilterFunc)
      },
    },
  })

  const removeRows = () => {
    const meta = table.options.meta

    if (meta) {
      meta.removeSelectedRows(
        table.getSelectedRowModel().rows.map((row) => row.index)
      )
      table.resetRowSelection()
    }
  }

  return (
    <div className="space-y-2">
      <ViewOption table={table} />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter className="w-full">
            <TableRow className="flex items-center gap-3 mt-3 ml-2 ">
              <TableCell>SubTotal</TableCell>
              <TableCell className="text-right">
                {centsToDollars(totals.subtotal)}
              </TableCell>
            </TableRow>
            <TableRow className="flex items-center gap-3 mt-3 ml-2 ">
              <TableCell>Tips</TableCell>
              <TableCell className="text-right">
                {centsToDollars(totals.tip)}
              </TableCell>
            </TableRow>
            <TableRow className="flex items-center gap-3 mt-3 ml-2 ">
              <TableCell>Tax</TableCell>
              <TableCell className="text-right">
                {centsToDollars(totals.tax)}
              </TableCell>
            </TableRow>
            <TableRow className="flex items-center gap-3 mt-3 ml-2 ">
              <TableCell>Totals</TableCell>
              <TableCell className="text-right">
                {centsToDollars(totals.grand_total)}
              </TableCell>
            </TableRow>

            <TableRow className="flex items-center gap-3 mt-3 ml-2 ">
              {defaultNewRow && (
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    const meta = table.options.meta
                    meta?.addRow(defaultNewRow)
                  }}
                >
                  <TableCell>Add Row +</TableCell>
                </Button>
              )}
              {table.getSelectedRowModel().rows.length > 0 ? (
                <Button
                  className="remove-button"
                  onClick={removeRows}
                  variant={"secondary"}
                >
                  Remove Selected x
                </Button>
              ) : null}
            </TableRow>
          </TableFooter>

          <TableCaption>
            Information is parsed through AI so information could be off.
          </TableCaption>
        </Table>
      </div>
    </div>
  )
}
