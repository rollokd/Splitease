'use server'
import { sql } from '@vercel/postgres'


export type Group = {
  id: string,
  firstname: string,
  amount?: number,
  status?: true | false
}


export async function getNamesOfUsersInAGroup(group_uuid = '20328e6f-167b-4fb9-bb5e-c71580f59cd5'): Promise<Group[]> {
  try {
    // const data = await sql<Group>`
    // SELECT * From user_groups
    // LEFT JOIN users ON users.id = user_groups.user_id
    // WHERE group_id = '20328e6f-167b-4fb9-bb5e-c71580f59cd5'
    // `
    const data = await sql<Group>`
    SELECT firstname, id From users
    LEFT JOIN user_groups ON user_groups.user_id=users.id
    WHERE group_id = ${group_uuid}
    `;

    console.log("data.rows from the db", data.rows)

    return data.rows;

  } catch (error) {
    console.log('Database Error ====> ', error);
    throw new Error('Failed to fetch the group data')
  }
}

