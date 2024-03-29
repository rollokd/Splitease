import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  UserWJunction,
  Group,
  UserTransaction,
  User,
  Own,
  GroupMember,
  Name,
  Debts,
  GroupUsersBasic,
} from './definititions';

// get group from group id
export async function getGroupById(group_id: string) {
  noStore();
  try {
    const { rows } =
      await sql<Group>`SELECT * FROM groups WHERE id = ${group_id}`;
    return rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}

// get all transactions for a group with user info
export async function getTransactionsByGroup(
  group_id: string
): Promise<UserTransaction[]> {
  noStore();
  try {
    const { rows } = await sql<UserTransaction>`
      SELECT transactions.id AS trans_id, group_id, name, amount, paid_by, status, date, users.id, firstname,lastname, email FROM transactions
      Left JOIN users
	    ON users.id = transactions.paid_by
      WHERE group_id = ${group_id}`;
    return rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchUserBalance(userID: string, groupID: string) {
  noStore();
  try {
    const totalPaid = await sql`
    SELECT SUM(amount) AS total_amount
    FROM transactions
    WHERE paid_by = ${userID} AND group_id = ${groupID};
    `;
    const userPaid = await sql`
    SELECT SUM(user_amount) AS total_amount
    FROM transactions
    LEFT JOIN splits
    ON transactions.id = splits.trans_id
    WHERE paid_by = ${userID} AND splits.group_id = ${groupID} AND user_id = ${userID};
    `;
    const splitToPay = await sql`
    SELECT SUM(user_amount) AS total_user_amount
    FROM splits
    WHERE user_id = ${userID} AND group_id = ${groupID} AND paid = false;
    `;
    //Calculate the account
    const result =
      Number(totalPaid.rows[0].total_amount) -
      Number(userPaid.rows[0].total_amount) -
      Number(splitToPay.rows[0].total_user_amount);
    return result;
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance data.');
  }
}

// get all groups in a group
export async function getUsersbyGroup(group_id: string) {
  noStore();
  try {
    const { rows } = await sql<UserWJunction>`
    SELECT * FROM users
    LEFT JOIN user_groups 
    ON users.id = user_groups.user_id
    WHERE group_id = ${group_id}`;
    return rows;
  } catch (err) {
    console.log('Database Error:', err);
    throw new Error('Failed to fetch group data.');
  }
}

export async function getNameGroup(userID: string, groupID: string) {
  noStore();
  try {
    const { rows } = await sql<GroupMember>`
    SELECT users.id, firstname, lastname, groups.id as group_id, groups.name
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN groups ON groups.id = user_groups.group_id
    WHERE users.id = ${userID} and group_id = ${groupID}
    `;
    return rows[0];
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function fetchOwnDashboardData(
  userID: string
): Promise<Own | undefined> {
  try {
    // const paidbyMe = await sql`SELECT SUM(amount) AS total_amount
    // FROM transactions
    // WHERE paid_by = ${userID} AND status=false;`;

    const SumOfEverybodysSlpitsNotSettle = await sql`
    SELECT SUM(user_amount) AS total_amount
    FROM transactions
    LEFT JOIN splits
    ON transactions.id = splits.trans_id
    WHERE paid_by = ${userID} AND paid=false`;

    const SumOfMySlpitsNotSettle =
      await sql`SELECT SUM(user_amount) AS total_user_amount FROM splits WHERE user_id=${userID} AND paid=false`;
    return {
      paidbyMe:
      SumOfEverybodysSlpitsNotSettle.rows[0].total_amount,
      myPortionOfBills: SumOfMySlpitsNotSettle.rows[0].total_user_amount,
      total:
      SumOfEverybodysSlpitsNotSettle.rows[0].total_amount -
      SumOfMySlpitsNotSettle.rows[0].total_user_amount
    };
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}
/// CREATE GROUP & EDIT GROUP DATA
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
export async function fetchGroupUsers(group_id: string) {
  noStore();
  try {
    const { rows } = await sql<User>`
    SELECT id,firstName,lastName FROM users
    LEFT JOIN user_groups 
    ON users.id = user_groups.user_id
    WHERE group_id = ${group_id}`;
    return rows;
  } catch (err) {
    console.log('Database Error:', err);
    throw new Error('Failed to fetch group data.');
  }
}
//////////////////////////////////////////////////////

export async function getUserGroups(userID: string) {
  noStore();
  try {
    const { rows } = await sql<GroupMember>`
    SELECT users.id, firstname, lastname, groups.id as group_id, groups.name
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN groups ON groups.id = user_groups.group_id
    WHERE users.id = ${userID}
    `;
    return rows;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function getDebts(userID: string) {
  noStore();
  try {
    const { rows } = await sql<Debts>`
    SELECT paid_by, SUM(user_amount) FROM public.transactions
    JOIN splits ON transactions.id = splits.trans_id
    WHERE user_id = ${userID} AND paid=false
    GROUP BY paid_by;
    `;
    return rows;
  } catch (error) {
    console.log('Database Error:', error);
  }
}
export async function getSpecificDebt(userID: string, paid_by: string) {
  noStore();
  try {
    const { rows } = await sql<Debts>`
    SELECT paid_by, user_id, SUM(user_amount) FROM public.transactions
    JOIN splits
    ON transactions.id = splits.trans_id
    WHERE transactions.paid_by = ${userID} AND splits.user_id = ${paid_by} AND paid=false
    GROUP BY paid_by, user_id;
    `;
    return Number(rows[0].sum);
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function getName(userID: string) {
  noStore();
  try {
    const { rows } = await sql<Name>`
    SELECT users.firstname
    FROM users
    WHERE users.id = ${userID}
    `;
    return rows[0].firstname;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function getUserIdFromSession(
  email: string
): Promise<string | undefined> {
  try {
    const result = await sql`
    SELECT id FROM users WHERE email = ${email}`;
    return result.rows[0].id;
  } catch (error) {
    console.error(error);
  }
}
