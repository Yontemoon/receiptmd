import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/parse_receipt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // POST image in hyperbolic API

        return Response.json({
          hello: "world",
        })
      },
      POST: async ({ request }) => {
        const payload = {
          model: "Qwen/Qwen2.5-VL-72B-Instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
              Extract the Driver License Number or unique ID from the card or passport.
              If an ID is found, respond exactly: 200,<ID_NUMBER>
              If no ID is present, respond: 400
              If the image does not contain a card, respond: 422
              If the two images show different cards, respond: 409
            `,
                },
                { type: "image_url", image_url: { url: frontDataUrl } },
                { type: "image_url", image_url: { url: backDataUrl } },
              ],
            },
          ],
          max_tokens: 512,
          temperature: 0.1,
          top_p: 0.001,
          stream: false,
        }

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
          return Response.json(
            {
              status: 200,
              skipped: true,
              message: "Validation skipped due to API failure.",
            },
            { status: 200 }
          )
        }

        if (!output) {
          return NextResponse.json(
            {
              status: 200,
              skipped: true,
              message: "Validation skipped (empty response).",
            },
            { status: 200 }
          )
        }

        return new Response("It  worked")
      },
    },
  },
})
