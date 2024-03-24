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