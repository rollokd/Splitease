'use server'

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
// get all transactions for a group with user info
export async function updateTransactions() {
  noStore();
  try {
    const query = await sql`
      WITH
      OUTSTANDING AS (
        SELECT DISTINCT
          TRANSACTIONS.ID AS LEFT_ID
        FROM
          TRANSACTIONS
        LEFT JOIN SPLITS ON SPLITS.TRANS_ID = TRANSACTIONS.ID
        WHERE
          PAID = FALSE
      )
      UPDATE TRANSACTIONS
      SET
        STATUS = true
      WHERE
        NOT EXISTS (
          SELECT
            1
          FROM
            OUTSTANDING
          WHERE
            TRANSACTIONS.ID = OUTSTANDING.LEFT_ID
        )
      `
    return query
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update the transactions.');
  }
}