'use client';
import { User } from '@/lib/definititions';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/16/solid';
import { Button } from '../../../components/ui/button';
import Search from '../search';
import { useState } from 'react';

export default function CreateGroupForm({ users }: { users: User[] }) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    const filteredResults = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(query.toLowerCase()) ||
        user.lastname.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleAddUser = (user: User) => {
    if (!selectedUsers.find((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    }
  };
  return (
    <form>
      {/** Group name  */}
      <div className='mb-4'>
        <label htmlFor='name' className='mb-2 block text-sm font-medium'>
          Add group Name
        </label>
        <div className='relative'>
          <input
            id='name'
            name='name'
            type='string'
            placeholder='Enter a group name'
            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
            required
          />
          <UserGroupIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </div>
      </div>

      {/** Add users */}
      <div className='mb-4'>
        <label htmlFor='customer' className='mb-2 block text-sm font-medium'>
          Choose participants
        </label>
        <Search onSearch={handleSearch} />
        <div>
          {searchQuery && <h3>Select Participants:</h3>}
          <ul>
            {searchResults.map((user) => (
              <li key={user.id} className='flex justify-between items-center'>
                {`${user.firstname} ${user.lastname}`}
                <button
                  type='button'
                  onClick={() => handleAddUser(user)}
                  className='ml-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2'
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='mt-6 flex justify-end gap-4'>
          <Link
            href='/dashboard'
            className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
          >
            Cancel
          </Link>
          <Link href='/dashboard'>
            <Button type='submit'>Create Group</Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
