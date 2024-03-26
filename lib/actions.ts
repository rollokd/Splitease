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
    const {rows} = await sql`select * from users where email = ${email}`;
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
    console.log('Returned ID:', user.rows[0].id);

    redirect('/login');
  }

  // bug redirect } catch (error) {
  //   console.log(error);
  // }
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

  // revalidatePath('/home/');
  redirect(`/home/group/${groupId}`);
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
