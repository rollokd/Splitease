'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const GroupFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date(),
  status: z.boolean(),
});

const CreateGroup = GroupFormSchema.omit({
  id: true,
  date: true,
  status: true,
});

export async function createGroup(formData: FormData, userIds: string[]) {
  const { name } = CreateGroup.parse({
    name: formData.get('name'),
  });
  const status = true;
  const date = new Date().toISOString().split('T')[0];

  const groupResult = await sql`
      INSERT INTO groups (name, status, date)
      VALUES (${name}, ${status}, ${date})
      RETURNING id`;

  const groupId = groupResult.rows[0].id;

  for (const userId of userIds) {
    await sql`
    INSERT INTO user_groups (user_id, group_id)
    VALUES (${userId}, ${groupId})`;
  }

  // revalidatePath('/home/');
  redirect(`/home/group/${groupId}`);
}
