'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  SplitTable,
  TableDataType,
  TransInsert,
  UserValues,
  TableDataTypeExtended
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

  const transInsert = await sql`
  INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${statusBla}, ${paid_by}, ${group_id})
  RETURNING id, group_id
  `;

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

  await sql<SplitTable>`
  INSERT INTO splits (amount, user_amount, paid, user_id, trans_id, group_id)
  VALUES (${amount}, ${user_amount}, ${paid}, ${user_id}, ${trans_id}, ${group_id})
  `;
}



const FormSchemaTransactionUpdate = FormSchemaTransaction.omit({ group_id: true, status: true, id: true });

export async function updateTransaction(
  transactionId: string,
  formData: FormData,
  tableData: TableDataTypeExtended[]
) {

  const { name, amount, date, paid_by } = FormSchemaTransactionUpdate.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    paid_by: formData.get('paid_by'),
  });

  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const groupID = await sql`
  select * from transactions
  WHERE id=${transactionId}
  `
  
  const value = await sql`
  UPDATE transactions
  SET name = ${name},
  date = ${dateConverted},
  amount = ${amountInPennies},
  paid_by = ${paid_by}
  WHERE id = ${transactionId}
  `;

  await sql`DELETE FROM splits WHERE trans_id = ${transactionId}`;

  // tableData.forEach(async (ele) => {
  //   console.log("test 2: ele amount test", ele.user_amount)
  //   let userAmount = ele.user_amount * 100;
  //   let paid = ele.id === paid_by;
  //   await createSplit({
  //     user_id: ele.id,
  //     user_amount: userAmount,
  //     paid: paid,
  //   }, {
  //     trans_id: transactionId,
  //     amount: amountInPennies,
  //     group_id: groupID.rows[0].group_id
  //   });
  // });
  await Promise.all(tableData.map(ele => {
    let userAmount = Number(ele.user_amount.toFixed(2)) * 100;
    let paid = ele.id === paid_by;
    return createSplit({
      user_id: ele.id,
      user_amount: userAmount,
      paid: paid,
    }, {
      trans_id: transactionId,
      amount: amountInPennies,
      group_id: groupID.rows[0].group_id
    });
  }));


  revalidatePath(`/home/group/${groupID.rows[0].group_id}`);
  redirect(`/home/group/${groupID.rows[0].group_id}`);
}