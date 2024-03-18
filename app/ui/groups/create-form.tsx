'use client';
import { Group } from '@/lib/definititions';
import Link from 'next/link';
import { createGroup } from '@/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({ group }: { group: Group[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispach] = useFormState(createGroup, initialState);
}
