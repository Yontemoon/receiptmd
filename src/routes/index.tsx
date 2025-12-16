import { createFileRoute } from "@tanstack/react-router"
import React, { useTransition } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const [file, setFile] = React.useState<File | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
        }
      })
    }
  }

  return (
    <div className="flex items-center  justify-center w-full">
      <div className="p-2 max-w-lg space-y-3 w-full">
        <Input
          type="file"
          disabled={isPending}
          onChange={(e) => {
            const files = e.target.files
            if (files) {
              setFile(files[0])
            }
          }}
        />
        <Button onClick={handleClick} disabled={isPending} className="w-full">
          {isPending ? "Adding..." : "Add"}
        </Button>
        {isPending && <Spinner />}
        <div>{info && JSON.stringify(info, null, 2)}</div>
      </div>
    </div>
  )
}
