import React from "react"
import { Input } from "../ui/input"
import { Row, Column, Table } from "@tanstack/react-table"
import { centsToDollars, isStringNumeric } from "~/lib/utils"

// ! Modify this
type PropTypes = {
  getValue: () => unknown
  row: Row<any>
  column: Column<any>
  table: Table<any>
}

const EditCell = ({ getValue, row, column, table }: PropTypes) => {
  const initialValue = getValue()
  const cellMeta = table.options.meta
  const columnMeta = column.columnDef.meta

  const [value, setValue] = React.useState<string>(initialValue as string)

  React.useEffect(() => {
    setValue(initialValue as string)
  }, [initialValue])

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value)
  }

  if (cellMeta?.editedRows[row.id]) {
    return (
      <Input
        type={columnMeta?.type || "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  }
  return (
    <span>
      {columnMeta?.isCurrency && isStringNumeric(value)
        ? centsToDollars(Number(value))
        : value}
    </span>
  )
}

export default EditCell
