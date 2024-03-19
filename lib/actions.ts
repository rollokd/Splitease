'use server'

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  status: z.boolean(),
  date: z.coerce.date(),
  paid_by: z.string(),
  group_id: z.string()
})
const CreateTransaction = FormSchema.omit({ id: true, status: true, group_id: true, paid_by: true });

export async function createTransaction(formData: FormData) {
  const { name, amount, date } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    // status: formData.get('status')
    date: formData.get('date')
  })
  const amountInPennies = amount * 100;
  const dateConverted = date.toISOString().split('T')[0];
  const status = false;
  const paid_by = '410544b2-4001-4271-9855-fec4b6a6442a';
  const group_id = '20328e6f-167b-4fb9-bb5e-c71580f59cd5';

  await sql`INSERT INTO transactions (name, date, amount, status, paid_by, group_id)
  VALUES (${name}, ${dateConverted}, ${amountInPennies}, ${status}, ${paid_by}, ${group_id})
  `
  // revalidatePath()
  // redirect()
}
