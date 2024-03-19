'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  status: z.boolean(),
});

const CreateGroup = FormSchema.omit({ id: true, date: true, status: true });
// const UpdateGroup = FormSchema.omit({ id: true, date: true });

export async function createGroup(formData: FormData) {
  const { name } = CreateGroup.parse({
    name: formData.get('name'),
  });
  const status = true;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO groups (name,status,date)
    VALUES (${name}, ${status},${date})`;
  } catch (error) {
    console.error(error);
    throw error;
  }
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
