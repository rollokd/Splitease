'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TableDataType } from './definititions';
import { getUserIdFromSession } from './data';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';

export async function getUserId() {
  const session = await auth();
  const userId = await getUserIdFromSession(session?.user?.email ?? '');
  console.log('User ID: ', userId)
}

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
  paid_by: true,
  group_id: true,
});

export async function createTransaction(formData: FormData) {
  console.log('aloha..... ');

  const { name, amount, date } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    // status: formData.get('status')
    date: formData.get('date'),
  });

  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const statusBla = false;
  const paid_by = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupBla_id = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  const transInsert =
    await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${statusBla}, ${paid_by}, ${groupBla_id})
  `;
  console.log('transInsert =====>', transInsert);
}
const FormSchemaSplit = z.object({
  id: z.string(),
  group_id: z.string(),
  trans_id: z.string(),
  user_id: z.string(),
  amount: z.coerce.number(),
  paid_by: z.string(),
  user_amount: z.number(),
});

const CreateSplitTransaction = FormSchemaSplit.omit({
  id: true,
  status: true,
  paid_by: true,
});

export async function createSplit(
  tableData: TableDataType[],
  formData: FormData
) {
  console.log('table data ===> ', tableData);
  console.log('form data ===> ', formData);

  // const amountInPennies = amount * 100;
  // const dateConverted = date.toISOString().split('T')[0];
  const status = false;
  const transaction = '7bfb17c6-029e-4f49-8004-d08c30760530';
  const paidBy = '410544b2-4001-4271-9855-fec4b6a6442a';
  const group = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  // await sql`INSERT INTO splits (group_id, trans_id, user_id, amount, paid_by, user_amount, status)
  // VALUES (${group}, ${transaction}, ${user_id}, ${amount}, ${paidBy}, ${user_amount}, ${status})
  // `
  // revalidatePath('/Dashboard/viewGroup')
  // redirect('/Dashboard/viewGroup')
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

const UpdateGroup = GroupFormSchema.omit({
  id: true,
  date: true,
  status: true,
});

export async function updateGroup(formData: FormData, groupId: string) {
  const { name } = UpdateGroup.parse({
    name: formData.get('name'),
  });

  const groupResult = await sql`
      UPDATE groups 
      SET name = ${name}
      WHERE id = ${groupId} `;

  // const groupId = groupResult.rows[0].id;

  // for (const userId of userIds) {
  //   await createJunction(userId, groupId);
  // }

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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const user = await signIn('credentials', formData);
    console.log('gabe', user);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


