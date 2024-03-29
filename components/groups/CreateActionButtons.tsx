import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

const ActionButtons = () => (
  <div className='sticky bottom-0 bg-background mt-6 flex flex-row gap-5 p-4 '>
    <Link href='/dashboard' passHref>
      <Button className='bg-secondary text-secondary-foreground  py-4 w-[35vw]'>
        Cancel
      </Button>
    </Link>
    <Button type='submit' className='py-4 w-[35vw]'>
      Create Group
    </Button>
  </div>
);

export default ActionButtons;
