import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { GroupUsersBasic } from '../definititions';

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