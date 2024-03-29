'use client';
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
type Props = {
  onSearch: (query: string) => void;
  id: string;
  value?: string;
};

export default function Search({ onSearch, id, value = '' }: Props) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onSearch(newQuery);
  };

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        id={id}
        className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
        onChange={handleChange}
        value={value}
        name='search'
        placeholder='Search participants...'
        autoComplete='off'
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  );
}
