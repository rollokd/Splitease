'use server'

import { revalidatePath } from "next/cache"
import { settleUpSplits } from "../databaseFunctions/settleUpSplits"

export async function settleUp(my_id: string, other_id: string, group_id: string) {
  try {
    console.log('Settling up:', my_id, other_id)
    await settleUpSplits(my_id, other_id)
    revalidatePath(`/group/${group_id}/settle_up`)
    console.log('Settled up')
    return 'success'
  } catch (err) {
    console.error('Failed to settle up:', err)
    throw new Error('Failed to settle up.')
  }
}