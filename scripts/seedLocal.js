const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    firstName: 'User',
    lastName: 'Name',
    email: 'user@nextmail.com',
    password: '123456',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    firstName: 'Rollo',
    lastName: 'KD',
    email: 'rollo@nextmail.com',
    password: '12345678',
  },
];

const groups = [
  {
    id: '8b1859dc-4773-436a-812f-3a8fa998edd9',
    name: 'Group One',
    date: '2024-03-01',
    status: true,
  },
  {
    id: 'c8c5b547-da50-4833-98c5-24275ebb2761',
    name: 'Group Two',
    date: '2024-03-15',
    status: false,
  },
];

const userGroups = [
  {
    userId: '410544b2-4001-4271-9855-fec4b6a6442a',
    groupId: '8b1859dc-4773-436a-812f-3a8fa998edd9',
  },
  {
    userId: '410544b2-4001-4271-9855-fec4b6a6442b',
    groupId: '8b1859dc-4773-436a-812f-3a8fa998edd9',
  },
];

async function seedUsers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          `
        INSERT INTO users (id, firstName, lastName, email, password)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;
      `,
          [user.id, user.firstName, user.lastName, user.email, hashedPassword]
        );
      })
    );
    console.log('users seeded!');
    return { insertedUsers, createTable };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedGroups(client) {
  // const client = await pool.connect();
  try {
    const createGroup = await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        date DATE NOT NULL,
        status BOOLEAN NOT NULL
      );
    `);

    const insertedGroups = await Promise.all(
      groups.map(async (group) => {
        await client.query(
          `
        INSERT INTO groups (id, name, date, status)
        VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;
      `,
          [group.id, group.name, group.date, group.status]
        );
      })
    );

    console.log(`Seeded groups`);
    return {
      createGroup,
      insertedGroups,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function createJoinTable(client) {
  try {
    const joinGroup = await client.query(`
      CREATE TABLE IF NOT EXISTS user_groups (
        userId UUID NOT NULL,
        groupId UUID NOT NULL,
        PRIMARY KEY (userId, groupId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
    )`);

    console.log('Created "user_groups" junction table');
    const insertJoin = await Promise.all(
      userGroups.map(async ({ userId, groupId }) => {
        return client.query(
          `
        INSERT INTO user_groups (userId, groupId)
        VALUES ($1, $2)
        ON CONFLICT (userId, groupId) DO NOTHING`,
          [userId, groupId]
        );
      })
    );
    console.log('seeded user_groups');
    return {
      joinGroup,
      insertJoin,
    };
  } catch (error) {
    console.error('Error creating user_groups table:', error);
    throw error;
  }
}

async function main() {
  // const client = db.connect()
  const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'splitease',
    password: '2202',
    port: 5432,
  });
  console.log(client);

  await seedUsers(client);
  await seedGroups(client);
  await createJoinTable(client);
  // await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err
  );
});
