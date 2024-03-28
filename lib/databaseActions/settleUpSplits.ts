import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { updateTransactions } from '../databaseFunctions/updateTransactions';
// get all transactions for a group with user info
export async function settleUpSplits(
  my_id: string,
  other_id: string
) {
  noStore();
  try {
    const query = await sql`
    WITH
    TS AS (
      SELECT
        splits.id AS split_id
      FROM
        TRANSACTIONS
        LEFT JOIN SPLITS ON SPLITS.TRANS_ID = TRANSACTIONS.ID
      WHERE
        PAID = FALSE AND ((
          SPLITS.USER_ID = ${my_id}
          AND TRANSACTIONS.PAID_BY = ${other_id}
        )
        OR (
          TRANSACTIONS.PAID_BY = ${my_id}
          AND SPLITS.USER_ID = ${other_id}
        ))
      )
    UPDATE SPLITS
    SET
      PAID = TRUE
    FROM
      TS
    WHERE
    splits.id = TS.split_id
    `
    await updateTransactions();
    return query
  }catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update your debts.');
  }
}