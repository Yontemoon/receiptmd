import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/parse_receipt")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          hello: "world",
        })
      },
      POST: async ({ request }) => {
        const formData = await request.formData()

        const file = formData.get("file") as File | null
        console.log(file)

        if (!file) {
          return Response.json({
            status: 400,
            message: "Missing front or back image.",
          })
        }

        const fileBase64 = Buffer.from(await file.arrayBuffer()).toString(
          "base64"
        )

        const fileUrl = `data:${file.type};base64,${fileBase64}`

        const payload = {
          model: "Qwen/Qwen2.5-VL-72B-Instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
                  Extract the receipt. return the receipt of what the person bought, no explanation needed.
                  Return it in JSON format that is easily parsed.
                 Generate a list of items being bought, use the following structure "[{id: string, price: number, name: string}]".
                  `,
                },
                { type: "image_url", image_url: { url: fileUrl } },
              ],
            },
          ],
          max_tokens: 512,
          temperature: 0.1,
          top_p: 0.001,
          stream: false,
        }

        let output: string | null = null

        try {
          const response = await fetch(
            "https://api.hyperbolic.xyz/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.HYPERBOLIC_KEY}`,
              },
              body: JSON.stringify(payload),
            }
          )

          if (!response.ok) {
            throw new Error(`Hyperbolic returned ${response.status}`)
          }

          const json = await response.json()
          output = json.choices?.[0]?.message?.content ?? null
        } catch (err) {
          console.error("Hyperbolic failed → skipping validation:", err)

          // Skip validation so it doesn't block the user.
          return Response.json({
            status: 200,
            skipped: true,
            message: "Validation skipped due to API failure.",
          })
        }

        if (!output) {
          return Response.json({
            status: 200,
            skipped: true,
            message: "Validation skipped (empty response).",
          })
        }
        console.log(output)
        return Response.json({
          status: 200,
          skipped: false,
          message: output,
        })
      },
    },
  },
})
