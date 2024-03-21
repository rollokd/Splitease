import { UserGroupIcon } from '@heroicons/react/16/solid';
import React from 'react';

const GroupNameInput = () => (
  <div className='mt-auto'>
    <label htmlFor='name' className='mb-2 block text-large font-medium p-6'>
      Add Group Name
    </label>
    <div className='relative'>
      <input
        id='name'
        name='name'
        type='text' // Correct type for input
        placeholder='Enter a group name'
        className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
        required
      />
      <UserGroupIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  </div>
);

export default GroupNameInput;
