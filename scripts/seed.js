const { createPool,db } = require('@vercel/postgres');
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
        const hashedPassword = await bcrypt.hash(user.password,10);
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

async function main() {
  const client = db.connect()
  // const client = new createPool({
  //   user: 'postgres',
  //   host: 'localhost',
  //   database: 'splitease',
  //   password: '2202',
  //   port: 5432, 
  // });
  console.log(client)

  await seedUsers(client);
  // await seedCustomers(client);
  // await seedInvoices(client);
  // await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
