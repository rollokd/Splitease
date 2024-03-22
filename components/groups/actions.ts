'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SplitTable, TableDataType, TransInsert, UserValues } from './definititions';
import { getUserIdFromSession } from './data';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';

export async function getUserId()  {
  try{
    const session = await auth();
    const userId = await getUserIdFromSession(session?.user?.email ?? '');
    console.log('User ID from actions: ', userId)
    return userId;


  } catch (error) {
  
  }

}

export async function deleteTransaction(transactionId: string) {
  try {
    const resp = await sql`
      DELETE FROM transactions
      WHERE id = ${transactionId}
    `;
    revalidatePath('/group');
    return 'success'
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to delete transaction.');
  }
}

const FormSchemaTransaction = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  status: z.boolean(),
  date: z.coerce.date(),
  paid_by: z.string(),
  group_id: z.string()
})
const CreateTransaction = FormSchemaTransaction.omit({ id: true, status: true, group_id: true });

export async function createTransaction(tableData: TableDataType[], formData: FormData) {

  const { name, amount, date, paid_by } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    // status: formData.get('status')
    date: formData.get('date'),
    paid_by: formData.get('paid_by')
  })

  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const statusBla = false;
  // const paid_by = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupBla_id = '26c034f0-9105-4d26-80c9-e49a89e1a8dd';

  const transInsert =
    await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${statusBla}, ${paid_by}, ${groupBla_id})
  RETURNING id, group_id
  `
  //second insert data prep
  let transactionId = transInsert.rows[0].id
  let groupId = transInsert.rows[0].group_id
  let bundledUpTransactionValues: TransInsert = { trans_id: transactionId, amount: amountInPennies, group_id: groupId }
  let bundledUpTableData: UserValues;
  tableData.map((ele) => {
    if (ele.amount && ele.id) {
      if (ele.id == paid_by) {
        bundledUpTableData = { user_amount: (ele.amount * 100), user_id: ele.id, paid: true }
      } else {
        bundledUpTableData = { user_amount: (ele.amount * 100), user_id: ele.id, paid: false }
      }
      createSplit(bundledUpTableData, bundledUpTransactionValues)
    }
  })
}


export async function createSplit(userValues: UserValues, transInsert: TransInsert) {
  const { user_id, user_amount, paid } = userValues;
  const { trans_id, amount, group_id } = transInsert;
  await sql<SplitTable>`INSERT INTO splits (amount, user_amount, paid, user_id, trans_id, group_id)
  VALUES (${amount}, ${user_amount}, ${paid}, ${user_id}, ${trans_id}, ${group_id})
  `
  console.log("6 values to add to the split table", { transInsert, userValues })
  // revalidatePath('/viewGroup')
  // redirect('/viewGroup')
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
    await sql`
    INSERT INTO user_groups (user_id, group_id)
    VALUES (${userId}, ${groupId})`;
  }

  revalidatePath('/dashboard');
  redirect(`/group/${groupId}`);
}

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


