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

export type State = {
  errors?: {
    name?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateGroup = FormSchema.omit({ id: true, date: true });
// const UpdateGroup = FormSchema.omit({ id: true, date: true });

export async function createGroup(prevState: State, formData: FormData) {
  const { name, status } = CreateGroup.parse({
    name: formData.get('name'),
    status: formData.get('status'),
  });
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO groups (name,status,date)
    VALUES (${name}, ${status},${date})`;

  revalidatePath('dashboard/create-group');
  redirect('dashboard/groups');
}
