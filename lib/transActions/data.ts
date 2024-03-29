import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { GroupUsersBasic } from '../definititions';
import { getNameGroup } from '../data';

export async function getNamesOfUsersInAGroup(
  group_id: string
): Promise<GroupUsersBasic[]> {
  noStore()
  try {
    const data = await sql<GroupUsersBasic>`
    SELECT firstname, id From users
    LEFT JOIN user_groups ON user_groups.user_id=users.id
    WHERE group_id = ${group_id}
    `;

    return data.rows;
  } catch (error) {
    console.log('Database Error ====> ', error);
    throw new Error('Failed to fetch the group data');
  }
}

export async function getGroupsName(
  group_id: string
) {
  noStore()
  try {
    const data = await sql`
    SELECT name FROM groups
    WHERE id = ${group_id}
    `

    return data.rows[0].name
  } catch (e) {
    console.log("database could not fetch group's name", e)
  }

}

export async function verifyGroupId(
  id: string
) {
  noStore()
  try {
    const groupEnquiry = await sql`
    SELECT 
  EXISTS(
    SELECT 
      1
    FROM 
      groups 
    WHERE 
      id =${id}
  )
    `
    return groupEnquiry.rows[0].exists

  } catch (e) {
    console.log("database could not verify whether group id exists", e)

  }
}

export async function verifyTransId(
  id: string
) {
  noStore()
  try {
    const transactionEnquiry = await sql`
    SELECT 
  EXISTS(
    SELECT 
      1
    FROM 
      transactions
    WHERE 
      id =${id}
  )
    `
    return transactionEnquiry.rows[0].exists

  } catch (e) {
    console.log("database could not verify whether group id exists", e)
  }
}

export async function getGroupNameWithTransId(
  id: string
) {
  noStore()
  try {
    const transactionEnquiry = await sql`
    SELECT group_id FROM transactions
    WHERE id =${id}
    `
    const groupID = transactionEnquiry.rows[0].group_id
    const name = await getGroupsName(groupID)
    return name


  } catch (e) {
    console.log("database could not verify whether group id exists", e)
  }
}

export async function fetchUsersFromTransactionId(
  id: string
) {
  noStore()
  try {
    let intermediate = await sql`
    select group_id, amount from splits
    where trans_id=${id}
    `

    let result = await sql`
    SELECT 
    u.firstname,
    u.id, 
    COALESCE(s.user_amount, 0) AS user_amount,
    t.date AS date,
    t.amount AS total_amount,
    t.name AS transaction_name,
    t.id AS group_id
    FROM 
    user_groups ug
    INNER JOIN users u ON ug.user_id = u.id
    LEFT JOIN splits s ON u.id = s.user_id AND s.trans_id = ${id}
    INNER JOIN transactions t ON t.id = ${id}
    WHERE
    ug.group_id = ${intermediate.rows[0].group_id}
    `
    return result.rows
  } catch (e) {
    console.log("could not fetch users based on transaction id", e)
    throw new Error("coudn't fetch trans data")
  }
}