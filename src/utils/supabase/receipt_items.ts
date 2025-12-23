import { getSupabaseServerClient } from "../supabase"

const getReceiptItems = async (receiptId: number) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("receipt")
    .select("*, receipt_items(*, products(*)), store(*, company(*))")
    .eq("receipt_id", receiptId)
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
  return data
}

export { getReceiptItems }
