import { getSupabaseServerClient } from "../supabase"
const getReceiptItems = async (receiptId: number) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("receipt_items")
    .select("*, receipt(*), products(*)")
    .eq("receipt_id", receiptId)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
  return data
}

export { getReceiptItems }
