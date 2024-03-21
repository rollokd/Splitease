import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const ActionButtons = () => (
  <div className='mt-auto flex flex-col gap-4 p-6'>
    <Link href='/dashboard' passHref>
      <Button className='w-full'>Cancel</Button>
    </Link>
    <Button type='submit'>Edit Group</Button>
  </div>
);

export default ActionButtons;
