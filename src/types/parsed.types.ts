type TReceipt = {
  status: "success"
  confidence_score: number
  merchant: TMerchant
  transaction: TTime
  items: TItem[]
  currency: string
  totals: TTotals
}

type TItem = {
  raw_text: string
  normalized_name: string
  unit_price: number
  total_line_price: number
  sku: null | string
  standard_unit: string
  quantity: number
  tax_code: string
  category: string
  sku_or_upc: string
}

type TTime = {
  date: string // YYYY-MM-DD
  time: string // HH:MM
}

type TTotals = {
  subtotal: number
  tax: number
  tip: number
  grand_total: number
}

type TMerchant = {
  name: string
  store_number: string | null
  street_line: string
  city: string
  state: string
  zipcode: number
}

export type { TReceipt, TItem, TMerchant, TTime, TTotals }
