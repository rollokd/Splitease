'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Split, SplitTable, TableDataType, TransInsert, UserValues } from './definititions';

const FormSchemaTransaction = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  status: z.boolean(),
  date: z.coerce.date(),
  paid_by: z.string(),
  group_id: z.string()
})
const CreateTransaction = FormSchemaTransaction.omit({ id: true, status: true, paid_by: true, group_id: true });

export async function createTransaction(tableData: TableDataType[], formData: FormData) {

  const { name, amount, date } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    // status: formData.get('status')
    date: formData.get('date')
  })

  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const statusBla = false;
  const paid_by = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupBla_id = '752a8475-1aa9-4174-b4ba-9bb51b5de033';

  const transInsert = await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
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
        bundledUpTableData = { user_amount: ele.amount, user_id: ele.id, paid: true }
      } else {
        bundledUpTableData = { user_amount: ele.amount, user_id: ele.id, paid: false }
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
