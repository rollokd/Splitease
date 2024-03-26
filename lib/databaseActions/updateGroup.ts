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
const UpdateGroup = GroupFormSchema.omit({
  id: true,
  date: true,
  status: true,
});

export async function updateGroup(
  formData: FormData,
  groupId: string,
  userIds: string[]
) {
  const { name } = UpdateGroup.parse({
    name: formData.get('name'),
  });
  // fetch current users
  const currentUsersResult = await sql`
      SELECT user_id 
      FROM user_groups 
      WHERE group_id = ${groupId}`;
  const currentUserIds = currentUsersResult.rows.map((row) => row.user_id);

  // determine users to add or remvoe
  const usersToRemove = currentUserIds.filter(
    (userId) => !userIds.includes(userId)
  );
  const usersToAdd = userIds.filter(
    (userId) => !currentUserIds.includes(userId)
  );

  // update group name
  await sql`
      UPDATE groups
      SET name = ${name}
      WHERE id = ${groupId} `;

  //Remove users
  for (const userId of usersToRemove) {
    const removedUsers = await sql`
    DELETE FROM user_groups
    WHERE group_id = ${groupId} AND user_id = ${userId}`;
  }

  // Add new users
  for (const userId of usersToAdd) {
    const addedUsers = await sql`
      INSERT INTO user_groups (user_id, group_id)
      VALUES (${userId}, ${groupId})
      ON CONFLICT (user_id, group_id) 
      DO NOTHING`;
  }

  revalidatePath('/dashboard');
  redirect(`/group/${groupId}`);
}
