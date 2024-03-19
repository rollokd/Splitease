import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Group, UserPaid, SplitToPay } from './definititions';

export async function fetchUserTransactionsAndGroups() {
  noStore();
  try {
    // The query is already parameter-free, but ensure to escape or parameterize any dynamic values
    const data = await sql`
    SELECT *
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN transactions ON transactions.paid_by = users.id
    WHERE transactions.group_id = user_groups.group_id;
    `;
    return data.rows;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function fetchGroupTotals(userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6', groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267') {
  noStore();
  try {
    const userPaid = await sql<UserPaid>`
    SELECT SUM(amount) AS total_amount
    FROM transactions
    WHERE paid_by = ${userID} AND group_id = ${groupID};
    `;
    const splitToPay = await sql<SplitToPay>`
    SELECT SUM(user_amount) AS total_user_amount
    FROM splits
    WHERE user_id = ${userID} AND group_id = ${groupID} AND paid = false;
    `;
    //Calculate the account
    const result = Number(userPaid.rows[0].total_amount) - Number( splitToPay.rows[0].total_user_amount);
    return result;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

// get all groups in a group
export async function getUsersbyGroup(group_id: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267') {
  noStore()
  try {
    const { rows } = await sql<Group>`
      SELECT * FROM users
      LEFT JOIN user_groups 
      ON users.id = user_groups.user_id
      WHERE group_id = ${group_id}`
    return rows
  } catch (err) {
    console.log('Database Error:', err);
  }
}

export async function getNameGroup(userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6', groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267') {
  noStore();
  try {
    const { rows } = await sql`
    SELECT users.id, firstname, lastname, groups.id as group_id, groups.name
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN groups ON groups.id = user_groups.group_id
    WHERE users.id = ${userID} and group_id = ${groupID}
    `

    return rows[0]
  } catch (error) {
    console.log('Database Error:', error);
  }
}

