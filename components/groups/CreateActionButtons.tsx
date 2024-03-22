import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const ActionButtons = () => (
  <div className='mt-6 flex flex-col gap-3 p-6'>
    <Link href='/dashboard' passHref>
      <Button className='w-full py-3'>Cancel</Button>
    </Link>
    <Button type='submit' className='py-3'>
      Create Group
    </Button>
  </div>
);

export default ActionButtons;
