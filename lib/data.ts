import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { UserWJunction, Group, UserTransaction, User, Own, GroupMember, Name, Debts } from './definititions';

export async function fetchUsersTransactionsOfGroups(
  groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267'
) {
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
      SELECT transactions.id AS trans_id, group_id, name, amount, paid_by,status, date, users.id, firstname,lastname, email FROM transactions
      Left JOIN users
	    ON users.id = transactions.paid_by
      WHERE group_id = ${group_id}`;
    return rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}
// get all transactions for a group with user info
export async function getTransactionsByGroupAndId(
  group_id: string,
  user_id: string
) {
  noStore();
  try {
    const { rows } = await sql<UserTransaction>`
      SELECT * FROM transactions
      Left JOIN users
	    ON users.id = transactions.paid_by
      WHERE group_id = ${group_id}`;
    const myPortionOfBills = await Promise.all(
      rows.map(async (row) => {
        const { rows } = await sql`
        SELECT * FROM splits
        WHERE user_id = ${user_id} AND group_id = ${group_id} AND paid = false;
        `;
        return rows[0].total_user_amount;
      })
    );
    return rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchUserBalance(
  userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6',
  groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267'
) {
  noStore();
  try {
    // i pay 50 quid for dinner - owed 25
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
  }
}
export async function fetchUserAndBalance(
  userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6',
  groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267'
) {
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
    const result =
      Number(userPaid.rows[0].total_amount) -
      Number(splitToPay.rows[0].total_user_amount);
    return { user: userID, result };
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

export async function getNameGroup(
  userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6',
  groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267'
) {
  noStore();
  try {
    const { rows } = await sql<GroupMember>`
    SELECT users.id, firstname, lastname, groups.id as group_id, groups.name
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN groups ON groups.id = user_groups.group_id
    WHERE users.id = ${userID} and group_id = ${groupID}
    `
    // console.log('getNameGroup: ', rows);
    return rows[0]
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function getNamesOfUsersInAGroup(
  group_id: string = '20328e6f-167b-4fb9-bb5e-c71580f59cd5'
): Promise<UserWJunction[]> {
  noStore();
  try {
    const data = await sql<UserWJunction>`
    SELECT firstname, id From users
    LEFT JOIN user_groups ON user_groups.user_id=users.id
    WHERE group_id = ${group_id}
    `;

    console.log('data.rows from the db', data.rows);

    return data.rows;
  } catch (error) {
    console.log('Database Error ====> ', error);
    throw new Error('Failed to fetch the group data');
  }
}

export async function getRecentlyAddedTransactionId() {
  noStore();
  try {
  } catch (e) {
    console.log('Database failed to fetch recent transaction id', e);
    throw new Error('Failed to fetch the recent transaction id');
  }
}

export async function fetchOwnDashboardData(): Promise<Own | undefined> {
  try {
    const paidbyMe = await sql`SELECT SUM(amount) AS total_amount
    FROM transactions
    WHERE paid_by = '3106eb8a-3288-4b62-a077-3b24bd640d9a';`;

    const MyPortionofBills =
      await sql`SELECT SUM(user_amount) AS total_user_amount FROM splits WHERE user_id='3106eb8a-3288-4b62-a077-3b24bd640d9a' AND paid=false`;
    console.log(paidbyMe.rows[0].total_amount);
    console.log(MyPortionofBills.rows[0].total_user_amount);

    return {
      paidbyMe: paidbyMe.rows[0].total_amount,
      myPortionOfBills: MyPortionofBills.rows[0].total_user_amount,
      total:
        paidbyMe.rows[0].total_amount -
        MyPortionofBills.rows[0].total_user_amount,
    };
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

export async function getUserGroups(
  userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6'
) {
  noStore();
  try {
    const { rows } = await sql<GroupMember>`
    SELECT users.id, firstname, lastname, groups.id as group_id, groups.name
    FROM users
    JOIN user_groups ON users.id = user_groups.user_id
    JOIN groups ON groups.id = user_groups.group_id
    WHERE users.id = ${userID}
    `;
    // console.log('userGroups result: ', rows);
    return rows;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function getDebts(userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6') {
  noStore();
  try {
    const { rows } = await sql<Debts>`
    SELECT paid_by, SUM(user_amount) FROM public.transactions
    JOIN splits ON transactions.id = splits.trans_id
    WHERE user_id = ${userID} AND paid=false
    GROUP BY paid_by;
    `
    // console.log('getDebts result: ', rows);
    return rows
  } catch (error) {
    console.log('Database Error:', error);
  }
}
export async function getSpecificDebt(userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6', paid_by: string = '410544b2-4001-4271-9855-fec4b6a6442a') {
  noStore();
  try {
    const { rows } = await sql<Debts>`
    SELECT paid_by, user_id, SUM(user_amount) FROM public.transactions
    JOIN splits
    ON transactions.id = splits.trans_id
    WHERE transactions.paid_by = ${userID} AND splits.user_id = ${paid_by} AND paid=false
    GROUP BY paid_by, user_id;
    `
    // console.log('getSpecificDebt result: ', rows[0].sum);
    return Number(rows[0].sum)
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
    `
    // console.log('getName Result: ', rows);
    return rows[0].firstname
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
