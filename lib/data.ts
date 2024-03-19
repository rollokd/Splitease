import { sql } from '@vercel/postgres';
import { User } from './definititions';



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

