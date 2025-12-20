import { createFileRoute } from "@tanstack/react-router"
import { authMiddleware } from "~/lib/middleware/auth"
import { TReceipt } from "~/types/parsed.types"
import { QWEN_MODEL } from "~/utils/constants"
import { postParsedReceiptData } from "~/utils/supabase/parsed_receipt"

export const Route = createFileRoute("/api/parse_receipt")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context }) => {
        if (!context.user) {
          throw new Error("Unauthorized")
        }

        return Response.json({
          hello: "world",
        })
      },
      POST: async ({ request, context }) => {
        if (!context.user) {
          throw new Error("Unauthorized")
        }
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
                      Extract the receipt information. Return the data in a JSON format that is strictly parsable.

                      RULES:
                      1. CONFIDENCE: Return a 0.0-1.0 score for 'confidence_score'. If the image is not a receipt, return a JSON with status "error" and code 400.
                      2. DATES: Format all dates as ISO 8601 (YYYY-MM-DD).
                      3. MONEY: Convert all money to integers (cents). Example: $12.50 -> 1250.
                      4. NULLS: If a field (like SKU or transaction_id) is not visible, return null. Do not hallucinate data.

                      DATA NORMALIZATION:
                      - standard_unit: Must be one of ['ea', 'lb', 'oz', 'kg', 'g', 'l', 'ml']. Use 'ea' for counts (boxes, bottles).
                      - category: Must be one of ['Groceries', 'Household', 'Personal Care', 'Alcohol', 'Pet', 'Dining Out', 'Tax', 'Fee', 'Other'].

                      OUTPUT STRUCTURE:
                      {
                        "status": "success",
                        "confidence_score": 0.95,
                        "currency": string, // use ISO codes like "usd" or "eur" for example,
                        "transaction_id": string, // This can also be a receipt number or ID. Remove special characters if it has "#" or "-".
                        "merchant": {
                          "name": string,
                          "store_number": string | null, // The specific branch number printed on receipt (e.g. 106 or a unique phone-number). Remove any special characters.
                          "street_line": string,
                          "city": string,
                          "state": string,
                          "zipcode": number
                        },
                        "transaction": {
                          "date": string, // YYYY-MM-DD
                          "time": string // 24hr format HH:MM
                        },
                        "items": [
                          {
                            "raw_text": string, // The exact text as it appears on the line
                            "normalized_name": string, // Cleaned up name (e.g. "Oatly Oat Milk")
                            "category": string, // From the allowed list above
                            "quantity": number, // Default to 1 if not specified
                            "standard_unit": string, // From the allowed list above
                            "unit_price": number, // Price per 1 unit in cents
                            "total_line_price": number, // Quantity * Unit Price in cents
                            "sku_or_upc": string | null, // The product code if visible
                            "tax_code": string | null // e.g., "A", "E", "T", "F"
                          }
                        ],
                        "totals": {
                          "subtotal": number,
                          "tax": number,
                          "tip": number,
                          "grand_total": number
                        }
                      }
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
        console.log(output)

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
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
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
