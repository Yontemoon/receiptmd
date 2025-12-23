import { getSupabaseServerClient } from "~/utils/supabase"

const getReceipts = async () => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("receipt")
    .select("*, store(*, company(*))")
    .order("purchased_at", { ascending: false })

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

const deleteReceipt = async (id: number) => {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from("receipt")
      .delete()
      .eq("receipt_id", id)

      .maybeSingle()

    if (error) {
      console.error(error)
      throw new Error("Something went wrong")
    }

    return { success: true }
  } catch (_error) {
    return { success: false }
  }
}

export { getReceipts, getReceiptById, deleteReceipt }
