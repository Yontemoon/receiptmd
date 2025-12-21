import { getSupabaseServerClient } from "~/utils/supabase"

const getItems = async (receiptId: number) => {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("receipt_items")
      .select("*")
      .eq("receipt_id", receiptId)

    if (error) {
      console.error(error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    return null
  }
}

const getItemsById = async (itemId: number) => {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("receipt_items")
      .select("*")
      .eq("item_id", itemId)
      .maybeSingle()

    if (error) {
      console.error(error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    return null
  }
}

export { getItems, getItemsById }
