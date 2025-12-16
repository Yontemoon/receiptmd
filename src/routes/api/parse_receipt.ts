import { createFileRoute } from "@tanstack/react-router"
import { TReceipt } from "~/types/parsed.types"
import { OLLAMA_MODEL, QWEN_MODEL } from "~/utils/constants"
import { postParsedReceiptData } from "~/utils/supabase/parsed_receipt"

type dataFormat = {
  date: string
  company: string
  address: string
  store_id: string | null
  confidence_score: number
  items: { id: string; price: number; name: string }[]
}

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
          model: QWEN_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
                  Extract the receipt. Return the receipt information of what the person bought, no explanation needed.
                  Return it in JSON format that is easily parsed.
                  Add a confidence score that return a 0.0-1.0 score for how sure you ar about the data. If you believe the image is not
                  a receipt, return a JSON response with status code 400 with message explaining why.
                  If the item has an SKU (Stock Keeping Unit), add it. If it doesn't, set it to null.
                  Generate a list of items being bought, using the following structure:
                  '{
                      date: string,
                      company: string,
                      address: string,
                      city: string,
                      state: string,
                      zipcode: string
                      store_id: string | null,
                      confidence_score: number,
                      items: {
                        receipt_label: string,
                        normalize_name: string
                        price: number,
                        sku: number | string | null
                        quantity: number
                        tax_code: string
                      }[],
                      totals: {
                        subtotal: number,
                        tax: number,
                        tip: number,
                        grand_total: number
                      }
                    }'.
                  `,
                },
                { type: "image_url", image_url: { url: fileUrl } },
              ],
            },
          ],
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

        const jsonOutput = JSON.parse(
          output
            .replace("json", "")
            .replace(/^```(?:json)?\s*/i, "") // opening fence
            .replace(/\s*```$/, "") // closing fence
            .trim()
        ) as TReceipt

        await postParsedReceiptData(jsonOutput)

        return Response.json({
          status: 200,
          skipped: false,
          message: jsonOutput,
        })
      },
    },
  },
})
