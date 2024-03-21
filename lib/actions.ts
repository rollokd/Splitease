'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Split, TableDataType } from './definititions';

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
  console.log("aloha..... ")

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
  const groupBla_id = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  const transInsert = await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${statusBla}, ${paid_by}, ${groupBla_id})
  RETURNING id, amount, group_id
  `
  let transactionId = transInsert.rows[0].id
  let totalAmountPaid = transInsert.rows[0].amount
  let groupId = transInsert.rows[0].group_id
  let tableDataValues = tableData.map((ele) => {

    if (ele.amount && ele.id) return [ele.amount, ele.id];


  })
  console.log(tableDataValues)
  // createSplit(tableData, transInsert)

}
const FormSchemaSplit = z.object({
  id: z.string(),
  group_id: z.string(),
  trans_id: z.string(),
  user_id: z.string(),
  amount: z.coerce.number(),
  paid: z.boolean(),
  user_amount: z.number(),
})

const CreateSplitTransaction = FormSchemaSplit.omit({ id: true, paid: true });

export async function createSplit(tableData: TableDataType[], transInsert) {
  let tableDataArray = tableData.forEach((x) => {
    return x
  })
  let transInsertArray = transInsert.forEach((x) => {
    return x
  })
  console.log(" ** <3 ** arrays of tableData and transInsert =====> ", tableDataArray, transInsertArray)

  // await sql`INSERT INTO splits (id, amount, user_amount, paid, user_id, trans_id, group_id)
  // VALUES (${id}, ${amount}, ${user_amount}, ${paid}, ${user_id}, ${trans_id}, ${group_id})
  // `
  // revalidatePath('/Dashboard/viewGroup')
  // redirect('/Dashboard/viewGroup')
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
