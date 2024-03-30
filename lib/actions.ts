'use server';

import { z } from 'zod';
import { QueryResult, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  SplitTable,
  TableDataType,
  TransInsert,
  UserValues,
} from './definititions';
import { getUserIdFromSession } from './data';

import { signIn, auth, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

const schema = z.object({
  email: z.string().email({
    message: 'Invalid Email', // Custom message for email format validation
  }),
  firstName: z.string(), // Validates that firstName is a string
  lastName: z.string(), // Validates that lastName is a string
  password: z.string(), // Validates that password is a string
  // You can add more specific validations for each field as needed
});

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    //const rawFormData = {
    firstName: formData.get('first-name'),
    lastName: formData.get('last-name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  // where is the erro showned if the email is already taken // gabe

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(validatedFields);
  const { email, firstName, lastName, password } = validatedFields.data;
  // let emailExists;

  try {
    const { rows } = await sql`select * from users where email = ${email}`;
    if (rows.length > 0) {
      console.log('Email already exists');
      return { emailExists: 'Email already exists' };
    }
    //emailExists = await sql`select * from users where email = ${email}`;
  } catch (error) {
    console.log(error);
  }

  //bug try {
  //const { email, firstName, lastName, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await sql`
      INSERT INTO users (email, firstname, lastname, password)
      VALUES (${email}, ${firstName}, ${lastName}, ${hashedPassword})
      RETURNING id, email
    `;
  if (user.rows.length) {
    redirect('/login');
  }
}
export async function SignOut() {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

export async function getUserId() {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session?.user?.email ?? '');

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
  group_id: z.string(),
});
const CreateTransaction = FormSchemaTransaction.omit({
  id: true,
  status: true,
});

export async function createTransaction(
  tableData: TableDataType[],
  formData: FormData
) {
  const { name, amount, date, paid_by, group_id } = CreateTransaction.parse({
    name: formData.get('name'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    paid_by: formData.get('paid_by'),
    group_id: formData.get('group_id'),
  });

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
    group_id: groupId,
  };
  let bundledUpTableData: UserValues;
  tableData.map((ele) => {
    if (ele.amount && ele.id) {
      if (ele.id == paid_by) {
        bundledUpTableData = {
          user_amount: ele.amount * 100,
          user_id: ele.id,
          paid: true,
        };
      } else {
        bundledUpTableData = {
          user_amount: ele.amount * 100,
          user_id: ele.id,
          paid: false,
        };
      }
      createSplit(bundledUpTableData, bundledUpTransactionValues);
    }
  });
  revalidatePath(`/home/group/${group_id}`);
  redirect(`/home/group/${group_id}`);
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
      UPDATE splits
      SET status = True
      WHERE paid_by = ${userID};
      `;
  } catch (error) {
    console.log('Error updateSettleSplits: ', error)
    throw error;
  }
}

export async function updateSettleTransaction(transID: string, userID: string) {
  try {
    await sql`
      UPDATE transactions
      SET paid = True
      WHERE id = ${transID} AND user_id = ${userID};
      `;
  } catch (error) {
    console.log('Error updateSettleTransaction: ', error)
    throw error;
  }
}
