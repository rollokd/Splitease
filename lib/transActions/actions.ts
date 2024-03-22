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
} from '@/lib/definititions';

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


// const FormSchemaTransaction = z.object({
//   id: z.string(),
//   name: z.string(),
//   amount: z.coerce.number(),
//   status: z.boolean(),
//   date: z.coerce.date(),
//   paid_by: z.string(),
//   group_id: z.string()
// })
const UpdateTransaction = FormSchemaTransaction.omit({
  id: true,
  date: true,
  status: true
});
export async function editTransaction(
  formData: FormData,
  trans_id: string,
  user_id: string[]
) {
  const { name } = UpdateTransaction.parse({
    name: formData.get('name')
  })

  const currentUserValues = await sql`
      SELECT user_id FROM splits
      WHERE trans_id = ${trans_id}`;
  const currIds = currentUserValues.rows.map((row) => row.user_id);
  console.log("show me those mad as f ids...", currIds)
}