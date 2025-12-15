import { createFileRoute } from "@tanstack/react-router"
import React from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const [file, setFile] = React.useState<File | null>(null)

  const handleClick = async () => {
    if (file) {
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
        console.log(parsed)
      }
    }
  }

  return (
    <div className="p-2">
      <Input
        type="file"
        onChange={(e) => {
          const files = e.target.files
          console.log(file)
          if (files) {
            setFile(files[0])
          }

          // setFile(e.target.value)
        }}
      />
      <Button onClick={handleClick}>Add Image</Button>
    </div>
  )
}
