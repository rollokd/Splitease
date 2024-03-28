import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { GroupBalancesByUser } from '../definititions';

export async function getMyDebtsForGroup(userID: string, groupID: string) {
  noStore();
  try {
    const { rows } = await sql<GroupBalancesByUser>`
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
      ID AS USER_ID,
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
      ) AS LENT_AMOUNT,
      (
        SELECT
          BALANCE
        FROM
          BALANCES
        WHERE
          USER_ID = ${userID}
          AND PAID_BY = ID
      ) AS OWED_AMOUNT
    FROM
      PUBLIC.USERS
      LEFT JOIN user_groups ON USERS.ID = USER_GROUPS.USER_ID
      WHERE user_groups.group_id = ${groupID} AND id != ${userID}
    `
    return rows
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance data.');
  }
}