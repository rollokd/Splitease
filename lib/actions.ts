'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TableDataType } from './definititions';

const FormSchemaTransaction = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  status: z.boolean(),
  date: z.string().datetime(),
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
  `
  console.log("transInsert =====>", transInsert)


}
const FormSchemaSplit = z.object({
  id: z.string(),
  group_id: z.string(),
  trans_id: z.string(),
  user_id: z.string(),
  amount: z.coerce.number(),
  paid_by: z.string(),
  user_amount: z.number(),
})

const CreateSplitTransaction = FormSchemaSplit.omit({ id: true, status: true, paid_by: true });

export async function createSplit(tableData: TableDataType[], formData: FormData) {

  console.log("table data ===> ", tableData)
  console.log("form data ===> ", formData)

  // const amountInPennies = amount * 100;
  // const dateConverted = date.toISOString().split('T')[0];
  const status = false;
  const transaction = '7bfb17c6-029e-4f49-8004-d08c30760530'
  const paidBy = '410544b2-4001-4271-9855-fec4b6a6442a';
  const group = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  // await sql`INSERT INTO splits (group_id, trans_id, user_id, amount, paid_by, user_amount, status)
  // VALUES (${group}, ${transaction}, ${user_id}, ${amount}, ${paidBy}, ${user_amount}, ${status})
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
