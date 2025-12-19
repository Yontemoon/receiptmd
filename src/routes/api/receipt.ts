import { createFileRoute } from "@tanstack/react-router"
import { TReceipt } from "~/types/parsed.types"
import { getSupabaseServerClient } from "~/utils/supabase"
import { authMiddleware } from "~/lib/middleware/auth"
import { json } from "@tanstack/react-start"

export const Route = createFileRoute("/api/receipt")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context }) => {
        if (!context.user) {
          return json({ error: "Unauthorized" }, { status: 401 })
        }
        return json({ hello: "world" })
      },
      POST: async ({ request, context }) => {
        try {
          const user = context.user
          if (!user) {
            return json(
              { success: false, message: "Unauthorized" },
              { status: 401 }
            )
          }

          const receiptData = (await request.json()) as TReceipt
          const { items, merchant, totals, transaction, currency } = receiptData
          const { city, name, state, store_number, street_line, zipcode } =
            merchant

          const supabase = getSupabaseServerClient()

          // ---------------------------------------------------------
          // 1. COMPANY LOGIC: Get existing or Create new
          // ---------------------------------------------------------
          let companyId: number

          const { data: existingCompany } = await supabase
            .from("company")
            .select("company_id")
            .eq("name", name)
            .single()

          if (existingCompany) {
            companyId = existingCompany.company_id
          } else {
            const { data: newCompany, error: companyError } = await supabase
              .from("company")
              .insert({ name })
              .select("company_id")
              .single()

            if (companyError || !newCompany)
              throw new Error(
                `Failed to create company: ${companyError?.message}`
              )
            companyId = newCompany.company_id
          }

          // ---------------------------------------------------------
          // 2. STORE LOGIC: Get existing or Create new
          // ---------------------------------------------------------
          let storeId: number | null = null

          // Strategy: Try matching by Store Number first (most accurate), then Address
          if (store_number) {
            const { data: storeByNum } = await supabase
              .from("store")
              .select("store_id")
              .eq("unique_name", store_number) // Assuming 'unique_name' holds the store #
              .eq("company_id", companyId) // Scope by company to avoid collisions
              .single()

            if (storeByNum) storeId = storeByNum.store_id
          }

          // Fallback: If no store ID found via number, try address
          if (!storeId && street_line) {
            const { data: storeByAddress } = await supabase
              .from("store")
              .select("store_id")
              .eq("street_line", street_line)
              .eq("city", city) // Adding city for tighter matching
              .single()

            if (storeByAddress) storeId = storeByAddress.store_id
          }

          // If still no store, Create it
          if (!storeId) {
            const { data: newStore, error: storeError } = await supabase
              .from("store")
              .insert({
                company_id: companyId,
                unique_name: store_number,
                street_line,
                city,
                state,
                zip_code: zipcode,
              })
              .select("store_id")
              .single()

            if (storeError || !newStore)
              throw new Error(`Failed to create store: ${storeError?.message}`)
            storeId = newStore.store_id
          }

          // ---------------------------------------------------------
          // 3. RECEIPT HEADER LOGIC
          // ---------------------------------------------------------
          const { data: newReceipt, error: receiptError } = await supabase
            .from("receipt")
            .insert({
              store_id: storeId,
              user_id: user.claims.sub,
              purchased_at: transaction.date, // Ensure this matches DB format (ISO 8601)
              currency: currency,
              subtotal: totals.subtotal,
              tip: totals.tip,
              tax: totals.tax,
              grand_total: totals.grand_total,
            })
            .select("receipt_id")
            .single()

          if (receiptError || !newReceipt)
            throw new Error(
              `Failed to create receipt: ${receiptError?.message}`
            )

          const receiptId = newReceipt.receipt_id

          // ---------------------------------------------------------
          // 4. ITEMS LOGIC (Parallelized)
          // ---------------------------------------------------------
          await Promise.all(
            items.map(async (item) => {
              let productId: number

              // A. Product Resolution
              const { data: existingProduct } = await supabase
                .from("products")
                .select("product_id")
                .eq("normalized_name", item.normalized_name)
                .single()

              if (existingProduct) {
                productId = existingProduct.product_id
              } else {
                const { data: newProduct, error: prodError } = await supabase
                  .from("products")
                  .insert({
                    normalized_name: item.normalized_name,
                    category: item.category,
                    standard_unit: item.standard_unit,
                  })
                  .select("product_id")
                  .single()

                if (prodError || !newProduct) {
                  console.error(
                    `Failed to create product ${item.normalized_name}`,
                    prodError
                  )
                  return // Skip this item but don't crash the whole request
                }
                productId = newProduct.product_id
              }

              // B. Receipt Item Insertion
              const { error: itemError } = await supabase
                .from("receipt_items")
                .insert({
                  receipt_id: receiptId,
                  product_id: productId,
                  user_id: user.claims.sub,
                  unit_price: item.unit_price,
                  total_line_price: item.total_line_price,
                  quantity: item.quantity,
                  raw_receipt_label: item.raw_text,
                })

              if (itemError) {
                console.error(
                  `Failed to insert item ${item.normalized_name}`,
                  itemError
                )
              }
            })
          )

          return json({
            success: true,
            receiptId: receiptId,
          })
        } catch (error: any) {
          console.error("Error in '/api/receipt'", error)
          return json(
            {
              success: false,
              message: error.message || "Internal Server Error",
            },
            { status: 500 }
          )
        }
      },
    },
  },
})
