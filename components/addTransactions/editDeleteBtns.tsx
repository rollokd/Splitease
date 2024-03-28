

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

function EditDeleteBtn({
  isSubmitting,
  pending,
  groupId,
  text
}: {
  isSubmitting: boolean,
  pending: boolean,
  groupId: string,
  text: string
}) {
  return (
    <div className='mt-6 w-full flex flex-row gap-3 p-4 sticky bottom-0 bg-background'>
      <Link href={`/home/group/${groupId}`} className='w-1/2'>
        <Button className='w-full bg-secondary text-secondary-foreground'>Cancel</Button>
      </Link>
      <Button
        type='submit'
        className='w-1/2'
        disabled={isSubmitting || pending}
      >
        {isSubmitting ? "Submitting..." : `${text}`}
      </Button>
    </div>
  )
};

export default EditDeleteBtn;
