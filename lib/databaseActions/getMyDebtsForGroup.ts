import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function getMyDebtsForGroup(userID: string, groupID: string) {
  noStore();
  try {
    const { rows } = await sql`
    WITH
    BALANCES AS (
      SELECT
        SUM(USER_AMOUNT) AS BALANCE,
        USER_ID,
        PAID_BY
      FROM
        PUBLIC.SPLITS
        LEFT JOIN TRANSACTIONS ON SPLITS.TRANS_ID = TRANSACTIONS.ID
      WHERE
        PAID = FALSE AND transactions.group_id = ${groupID}
      GROUP BY
        USER_ID,
        PAID_BY
    )
    SELECT
      ID,
      FIRSTNAME,
      LASTNAME,
      (
        SELECT
          BALANCE
        FROM
          BALANCES
        WHERE
          PAID_BY = ${userID}
          AND USER_ID = ID
      ) AS OWED_AMOUNT,
      (
        SELECT
          BALANCE
        FROM
          BALANCES
        WHERE
          USER_ID = ${userID}
          AND PAID_BY = ID
      ) AS LENT_AMOUNT
    FROM
      PUBLIC.USERS
      WHERE id != ${userID}
    `
    return rows
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance data.');
  }
}