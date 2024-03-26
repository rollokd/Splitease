import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputEditName = ({ defaultValue }: { defaultValue: string }) => (
  <div className='mt-4 mb-6'>
    <Label htmlFor='name'>Edit Group Name</Label>
    <div className='relative mt-2 mb-2'>
      <Input
        id='name'
        name='name'
        type='text'
        defaultValue={defaultValue}
        required
      />
    </div>
  </div>
);

export default InputEditName;
