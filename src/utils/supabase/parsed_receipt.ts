import { TReceipt } from "~/types/parsed.types"
import { getSupabaseServerClient } from "../supabase"

const postParsedReceiptData = async (rawJson: TReceipt) => {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("uploaded_parsed_data").insert({
      raw_data: rawJson,
    })
    if (error) {
      throw new Error(error.message)
    }
    return "success"
  } catch (error) {
    console.error(error)
    return error
  }
}

export { postParsedReceiptData }
