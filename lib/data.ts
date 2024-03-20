import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { UserWJunction, Group, UserTransaction, User, Own } from './definititions';
import { promises } from 'dns';

export async function fetchUsersTransactionsOfGroups(groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267') {
  noStore();
  try {
    // The query is already parameter-free, but ensure to escape or parameterize any dynamic values
    const data = await sql`
    SELECT users.id, firstname, lastname, transactions.paid_by, transactions.amount, transactions.status AS status, transactions.group_id
    FROM users
    JOIN transactions ON users.id = transactions.paid_by
    WHERE transactions.group_id = ${groupID} AND status = 'false';
    `;
    return data.rows;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

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

// export type Group = {
//   id: string,
//   firstname: string,
//   amount?: number,
//   status?: true | false
// }

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

export async function fetchOwnDashboardData () : Promise<Own | undefined> {

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

