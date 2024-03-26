'use server'

import { revalidatePath } from "next/cache"
import { settleUpSplits } from "../databaseFunctions/settleUpSplits"

export async function settleUp(my_id: string, other_id: string, group_id: string) {
  try {
    await settleUpSplits(my_id, other_id)
    revalidatePath(`/group/${group_id}/settle_up`)
    return 'success'
  } catch (err) {
    console.error('Failed to settle up:', err)
    throw new Error('Failed to settle up.')
  }
}