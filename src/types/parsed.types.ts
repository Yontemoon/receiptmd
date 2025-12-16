type TReceipt = {
  date: string
  company: string
  address: string
  city: string
  state: string
  zipcode: string
  store_id: string | null
  confidence_score: number
  items: TItem[]
  totals: {
    subtotal: number
    tax: number
    tip: number
    grand_total: number
  }
}

type TItem = {
  receipt_label: string
  normalize_name: string
  price: number
  sku: null | string
  quantity: number
  tax_code: string
}

export type { TReceipt, TItem }
