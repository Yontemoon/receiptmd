import { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editedRows: Record<string, string>
    setEditedRows: React.Dispatch<React.SetStateAction<{}>>
    updateData: (rowIndex: number, columnId: string, value: string) => void
    revertData: (rowIndex: number, revert: boolean) => void
    addRow: (newRowData: TData) => void
    removeRow: (index: number) => void
    removeSelectedRows: (selected: number[]) => void
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    type: React.HTMLInputTypeAttribute
  }
}
