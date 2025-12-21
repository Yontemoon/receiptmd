import { getSupabaseServerClient } from "~/utils/supabase"

const getReceipts = async () => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("receipt")
    .select("*, store(*, company(*))")

  if (error) {
    return []
  }

  return data
}

const getReceiptById = async (id: number) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("receipt")
    .select("*, store(*, company(*))")
    .eq("receipt_id", id)

    .maybeSingle()

  if (error) {
    return null
  }

  return data
}

export { getReceipts, getReceiptById }
