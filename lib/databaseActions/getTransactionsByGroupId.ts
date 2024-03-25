import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { UserTransaction } from '../definititions';
// get all transactions for a group with user info
export async function getTransactionsByGroupAndId(
  group_id: string,
  user_id: string
) {
  noStore();
  try {
    const { rows } = await sql<UserTransaction>`
    SELECT
    TRANSACTIONS.ID AS TRANS_ID,
    TRANSACTIONS.GROUP_ID,
    NAME,
    TRANSACTIONS.AMOUNT,
    PAID_BY,
    STATUS,
    DATE,
    USERS.ID,
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    CASE
      WHEN paid_by != ${user_id} THEN 0 
      ELSE CAST(COALESCE(SUM(splits.user_amount) FILTER(WHERE splits.user_id != ${user_id} AND splits.paid = 'false' ), 0) AS INTEGER)
    END as amount_lent,
    CASE
      WHEN paid_by = ${user_id} THEN 0 
      ELSE CAST(COALESCE(SUM(splits.user_amount) FILTER(WHERE splits.user_id = ${user_id} AND splits.paid = 'false' ), 0) AS INTEGER)
    END as amount_owed
  FROM
    TRANSACTIONS
    LEFT JOIN USERS ON USERS.ID = TRANSACTIONS.PAID_BY
    LEFT JOIN SPLITS ON TRANSACTIONS.ID = SPLITS.TRANS_ID
  WHERE
    TRANSACTIONS.GROUP_ID = ${group_id}
  GROUP BY
    TRANSACTIONS.ID, USERS.ID;
    `
    return rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}