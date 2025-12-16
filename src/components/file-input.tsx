import React from "react"
import { Trash } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components//ui/button"

const FileInput = ({
  file,
  onChange,
}: {
  file: File | null
  onChange: (file: File) => void
}) => {
  const [fileState, setFileState] = React.useState<File | null>(null)

  return (
    <div className="hover:bg-primary/5 border border-dashed p-3">
      <Input
        className=" "
        type="file"
        name="myImage"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files[0]) {
            setFileState(event.target.files[0])
            onChange(event.target.files[0])
          }
        }}
      />

      {file && (
        <div>
          <img
            alt="not found"
            className="w-62.5"
            src={fileState ? URL.createObjectURL(fileState) : ""}
          />
          <br />
          <Button
            size={"icon-lg"}
            variant={"outline"}
            onClick={() => {
              setFileState(null)
            }}
          >
            <Trash />
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileInput
