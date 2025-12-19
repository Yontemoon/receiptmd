import z from "zod"

const ZParsedData = z.object({
  receipt_label: z.string(),
  normalized_name: z.string(),
  price: z.number(),
  quantity: z.number(),
})

export { ZParsedData }
