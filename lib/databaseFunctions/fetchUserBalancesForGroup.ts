import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { GroupBalancesByUser } from '../definititions';

export async function fetchUserBalancesForGroup(
  groupID: string
) {
  noStore();
  try {
    // i pay 50 quid for dinner - owed 25
    const result = await sql<GroupBalancesByUser>`
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
        PAID = FALSE
        AND TRANSACTIONS.GROUP_ID = ${groupID}
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
          SUM(BALANCE)
        FROM
          BALANCES
        WHERE
          USER_ID = ID
      ) AS OWED_AMOUNT,
      (
        SELECT
          SUM(BALANCE)
        FROM
          BALANCES
        WHERE
          PAID_BY = ID
      ) AS LENT_AMOUNT
    FROM
      PUBLIC.USERS
      LEFT JOIN user_groups ON USERS.ID = USER_GROUPS.USER_ID
      WHERE user_groups.group_id = ${groupID};
    `
    return result;
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance data.');
  }
}