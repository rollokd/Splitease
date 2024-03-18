import { sql } from '@vercel/postgres';
import { User, Group, UserGroups } from './definititions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchGroup() {
  noStore();

  try {
    await new Promise((resolve) => resolve);
    const data = await sql<Group>`SELECT * FROM groups`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups.');
  }
}
