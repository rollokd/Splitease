import { sql } from '@vercel/postgres';
import { User } from './definititions';

export async function fetchUsers() {
  try {
    const data = await sql<User>`
      SELECT id,firstName,lastName FROM users;`;
    const users = data.rows;
    console.log(users);
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}
