import { UserGroupIcon } from '@heroicons/react/16/solid';
import React from 'react';

const GroupNameInput = () => (
  <div className='mt-4 mb-6'>
    <label
      htmlFor='name'
      className='flex flex-col gap-4 mb-6 p-4 border-2 border-black rounded-md'
    >
      Add Group Name
      <div className='relative'>
        <input
          id='name'
          name='name'
          type='text'
          placeholder='Enter a group name'
          className='peer block w-full rounded-md border-b-2 border-black py-2 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          required
        />
        <UserGroupIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-blue-500' />
      </div>
    </label>
  </div>
);

export default GroupNameInput;
