'use server'

import { revalidatePath } from "next/cache"
import { settleUpSplits } from "../databaseFunctions/settleUpSplits"

export async function settleSplitsDashboard(my_id: string, other_id: string) {
  try {
    await settleUpSplits(my_id, other_id)
    revalidatePath(`/home/settle_up_dashboard`)
    return 'success'
  } catch (err) {
    console.error('Failed to settle up:', err)
    throw new Error('Failed to settle up.')
  }
}