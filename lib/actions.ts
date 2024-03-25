'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  SplitTable,
  TableDataType,
  TransInsert,
  UserValues
} from './definititions';
import { getUserIdFromSession } from './data';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';


export async function getUserId() {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session?.user?.email ?? '');
    //console.log('User ID from actions: ', userId)

    return userId;
  } catch (error) {
    console.log('error', error);
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const resp = await sql`
      DELETE FROM transactions
      WHERE id = ${transactionId}
    `;
    revalidatePath('/group');
    return 'success';
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
const CreateTransaction = FormSchemaTransaction.omit({ id: true, status: true });

export async function createTransaction(
  tableData: TableDataType[],
  formData: FormData
) {

  const { name, amount, date, paid_by, group_id } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    paid_by: formData.get('paid_by'),
    group_id: formData.get('group_id')
  })

  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const statusBla = false;

  const transInsert =
    await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${statusBla}, ${paid_by}, ${group_id})
  RETURNING id, group_id
  `;
  //second insert data prep
  let transactionId = transInsert.rows[0].id;
  let groupId = transInsert.rows[0].group_id;
  let bundledUpTransactionValues: TransInsert = {
    trans_id: transactionId,
    amount: amountInPennies,
    group_id: groupId
  };
  let bundledUpTableData: UserValues;
  tableData.map((ele) => {
    if (ele.amount && ele.id) {
      if (ele.id == paid_by) {
        bundledUpTableData = {
          user_amount: ele.amount * 100,
          user_id: ele.id,
          paid: true
        };
      } else {
        bundledUpTableData = {
          user_amount: ele.amount * 100,
          user_id: ele.id,
          paid: false
        };
      }
      createSplit(bundledUpTableData, bundledUpTransactionValues);

    }
  });
  revalidatePath(`/home/group/${group_id}`)
  redirect(`/home/group/${group_id}`)
}

export async function createSplit(
  userValues: UserValues,
  transInsert: TransInsert
) {
  const { user_id, user_amount, paid } = userValues;
  const { trans_id, amount, group_id } = transInsert;
  await sql<SplitTable>`INSERT INTO splits (amount, user_amount, paid, user_id, trans_id, group_id)
  VALUES (${amount}, ${user_amount}, ${paid}, ${user_id}, ${trans_id}, ${group_id})
  `;
}

const GroupFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date(),
  status: z.boolean()
});

const CreateGroup = GroupFormSchema.omit({
  id: true,
  date: true,
  status: true
});

export async function createGroup(formData: FormData, userIds: string[]) {
  const { name } = CreateGroup.parse({
    name: formData.get('name')
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

const UpdateGroup = GroupFormSchema.omit({
  id: true,
  date: true,
  status: true
});

export async function updateGroup(
  formData: FormData,
  groupId: string,
  userIds: string[]
) {
  const { name } = UpdateGroup.parse({
    name: formData.get('name')
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
  formData: FormData
) {
  try {
    const user = await signIn('credentials', formData);
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

export async function updateSettleSplits(splitID: string, userID: string) {
  try {
    await sql`
      UPDATE trasnactions
      SET status = True
      WHERE id = ${splitID} AND paid_by = ${userID};
      `;
  } catch (error) {
    console.log('Error updateSettleSplits: ', error)
  }
}

export async function updateSettleTransaction(transID: string, userID: string) {
  try {
    await sql`
      UPDATE splits
      SET paid = True
      WHERE id = ${transID} AND user_id = ${userID};
      `;
  } catch (error) {
    console.log('Error updateSettleTransaction: ', error)
  }
}
