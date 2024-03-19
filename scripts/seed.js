const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const { users, groups, userGroups, transactions, splits } = require('../lib/placeholder-data');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, firstName, lastName, email, password)
        VALUES (${user.id},${user.firstName}, ${user.lastName},${user.email},${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
        `
      })
    )
    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedGroups(client) {
  try {
    const createGroup = await client.sql`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        date DATE NOT NULL,
        status BOOLEAN NOT NULL
      );
    `

    console.log('Created Groups table')

    const insertedGroups = await Promise.all(
      groups.map(async (group) => {
        return client.sql`
        INSERT INTO groups (name, date, status)
        VALUES (${group.name},${group.date}, ${group.status})
        ON CONFLICT (id) DO NOTHING;
        `
      })
    )
    console.log(`Seeded ${groups.length} groups`);

    return {
      createGroup,
      groups: insertedGroups,
    };
  } catch (error) {
    console.error('Error seeding groups:', error)
    throw error;
  }
}

async function seedJunction(client) {
  try {
    const joinGroup = await client.sql`
      CREATE TABLE IF NOT EXISTS user_groups (
        user_id UUID NOT NULL,
        group_id UUID NOT NULL,
        PRIMARY KEY (user_id, group_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    )`

    const insertJoins = await Promise.all(
      userGroups.map(async ({ userId, groupId }) => {
        return client.sql`
        INSERT INTO user_groups (user_id, group_id)
        VALUES (${userId},${groupId})
        `
      })
    )
    console.log(`Seeded ${userGroups.length} user_groups`);
    return {
      joinGroup,
      userGroups: insertJoins,
    };

  } catch (error) {
    console.error('Error seeding junction:', error)
    throw error;
  }
}

async function seedTransactions(client) {
  try {
    const transactionTable = await client.sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        date DATE NOT NULL,
        amount INT NOT NULL,
        status BOOLEAN NOT NULL,
        paid_by UUID NOT NULL,
        group_id UUID NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
      )
    `
    console.log('Created Transactions table')

    const transactionsList = await Promise.all(
      transactions.map(async (transaction) => {
        return client.sql`
        INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
        VALUES (${transaction.name},${transaction.date},${transaction.amount},${transaction.status},${transaction.paid_by},${transaction.group_id})
        `
      })
    )
    console.log(`Seeded ${transactionsList.length} transactions`);
    return {
      transactionTable,
      transactionsList: transactions,
    };
  } catch (error) {
    console.error('Error seeding transactions:', error)
    throw error;
  }
}
async function seedSplits(client) {
  try {
    const splitsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS splits (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        amount INT NOT NULL,
        user_amount INT NOT NULL,
        paid BOOLEAN NOT NULL,
        user_id UUID NOT NULL,
        trans_id UUID NOT NULL,
        group_id UUID NOT NULL,
        FOREIGN KEY (trans_id) REFERENCES transactions(id) ON DELETE CASCADE
      )
    `
    console.log('Created Transactions table')

    const splitItems = await Promise.all(
      splits.map(async (split) => {
        return client.sql`
        INSERT INTO splits (amount, user_amount, paid, user_id, trans_id, group_id)
        VALUES (${split.amount},${split.user_amount},${split.paid},${split.user_id},${split.transaction_id},${split.group_id})
          `})
    )
    return {
      splitsTable,
      splitItems: splits,
    };
  } catch (error) {
    console.error('Error seeding transactions:', error)
    throw error;
  }
}

async function main() {
  const client = await db.connect()
  console.log(client)

  await seedUsers(client);
  await seedGroups(client);
  await seedJunction(client);
  await seedTransactions(client);
  const output = await seedSplits(client);
  console.log('splits', output)

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
