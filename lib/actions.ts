'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchemaTransaction = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  status: z.boolean(),
  date: z.coerce.date(),
  paid_by: z.string(),
  group_id: z.string(),
});
const CreateTransaction = FormSchemaTransaction.omit({
  id: true,
  status: true,
});

export async function createTransaction(formData: FormData, whoPaid: string[]) {
  const { name, amount, date } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    // status: formData.get('status')
    date: formData.get('date'),
  });
  const [firstname, id] = whoPaid;
  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const status = false;
  // const paid_by = '410544b2-4001-4271-9855-fec4b6a6442a';
  const group_id = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${status}, ${id}, ${group_id})
  `;
  // const insertIntoSplitTable = sql`INSERT INto splits (id, amount, user_amount, paid, user_id, trans_id, group_id)
  // VALUES (${}, ${}, ${}, ${}, ${}, ${}, ${group_id})
  // `

  //which user id (who paid initial amount ?)
  //paid individual values=> status of a whole transaction?
  //user_amount => should there be 4 user amounts or an array of user_amount?

  // revalidatePath()
  // redirect()
}

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
// const UpdateGroup = GroupFormSchema.omit({ id: true, date: true });

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
    await createJunction(userId, groupId);
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function createJunction(user_id: string, group_id: string) {
  try {
    await sql`
    INSERT INTO user_groups (user_id, group_id)
    VALUES (${user_id}, ${group_id})`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
