

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

function EditDeleteBtn({
  isSubmitting,
  pending,
  groupId
}: {
  isSubmitting: boolean,
  pending: boolean,
  groupId: string
}) {
  return (
    <div className='mt-6 w-full flex flex-row gap-3 p-4'>
      <Link href={`/home/group/${groupId}`} className='w-1/2'>
        <Button className='w-full '>Cancel</Button>
      </Link>
      <Button
        type='submit'
        className='w-1/2'
        variant={"sticky"}

        disabled={isSubmitting || pending}
      >
        {isSubmitting ? "Submitting..." : "Submit Changes"}
      </Button>
    </div>
  )
};

export default EditDeleteBtn;
