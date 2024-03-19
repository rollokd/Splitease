
'use server'
import { sql } from '@vercel/postgres'
import { User } from './definititions';

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




export async function fetchOwnDashboardData () {

  try {
    const paidbyMe = await   sql`SELECT SUM(amount) AS total_amount
    FROM transactions
    WHERE paid_by = '3106eb8a-3288-4b62-a077-3b24bd640d9a';`;
    

    const MyPortionofBills = await   sql`SELECT SUM(user_amount) AS total_user_amount FROM splits WHERE user_id='3106eb8a-3288-4b62-a077-3b24bd640d9a' AND paid=false`;
    console.log(paidbyMe.rows[0].total_amount);
    console.log(MyPortionofBills.rows[0].total_user_amount);
    
    return {
      paidbyMe : paidbyMe.rows[0].total_amount,
      myPortionOfBills : MyPortionofBills.rows[0].total_user_amount,
      total: (paidbyMe.rows[0].total_amount - MyPortionofBills.rows[0].total_user_amount)
    }

  } catch (error) {
    console.error('Error querying the database:', error);
  }
}


export async function fetchUsers() {
  try {
    const data = await sql<User>`
      SELECT id,firstName,lastName FROM users;`;
    const users = data.rows;

    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

