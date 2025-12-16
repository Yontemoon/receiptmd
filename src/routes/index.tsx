import { createFileRoute } from "@tanstack/react-router"
import React, { useTransition } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const [file, setFile] = React.useState<File | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleClick = async () => {
    if (file) {
      startTransition(async () => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/parse_receipt", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        console.log(data)
        if (data.message) {
          const parsed = JSON.parse(data.message)

          setInfo(parsed)
        }
      })
    }
  }

  return (
    <div className="flex items-center  justify-center w-full">
      <div className="p-2 max-w-lg space-y-3">
        <Input
          type="file"
          onChange={(e) => {
            const files = e.target.files
            console.log(file)
            if (files) {
              setFile(files[0])
            }
          }}
        />
        <Button onClick={handleClick} disabled={isPending} className="w-full">
          {isPending ? "Adding..." : "Add"}
        </Button>
        <div>{info && JSON.stringify(info)}</div>
      </div>
    </div>
  )
}
