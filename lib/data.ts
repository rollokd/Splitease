import { sql } from '@vercel/postgres'
import { unstable_noStore as noStore } from 'next/cache';
import { Group, Transaction, UserTransaction, UserWJunction } from './definititions';

// get group from group id
export async function getGroupById(group_id: string) {
  noStore()
  try {
    const { rows } = await sql<Group>`SELECT * FROM groups WHERE id = ${group_id}`
    return rows[0]
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}

// get all groups in a group
export async function getUsersbyGroup(group_id: string) {
  noStore()
  try {
    const { rows } = await sql<UserWJunction>`
      SELECT * FROM users
      LEFT JOIN user_groups 
      ON users.id = user_groups.user_id
      WHERE group_id = ${group_id}`
    return rows
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user data.');
  }
}

// get all transactions for a group with user info
export async function getTransactionsByGroup(group_id: string) {
  noStore()
  try {
    const { rows } = await sql<UserTransaction>`
      SELECT * FROM transactions
      Left JOIN users
	    ON users.id = transactions.paid_by
      WHERE group_id = ${group_id}`
    return rows
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchUserBalance(userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6', groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267') {
  noStore();
  try {
    const userPaid = await sql`
    SELECT SUM(amount) AS total_amount
    FROM transactions
    WHERE paid_by = ${userID} AND group_id = ${groupID};
    `;
    const splitToPay = await sql`
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