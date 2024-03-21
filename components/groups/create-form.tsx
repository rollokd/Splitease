'use client';
import { User } from '@/lib/definititions';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/16/solid';
import { Button } from '../ui/button';
import Search from '../search';
import { useState } from 'react';
import { createGroup } from '@/lib/actions';

export default function CreateGroupForm({ users }: { users: User[] }) {
  const currUser = 'abde2287-4cfa-4cc7-b810-dd119df1d039';
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
        user.id !== currUser &&
        (user.firstname.toLowerCase().includes(query.toLowerCase()) ||
          user.lastname.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filteredResults);
  };

  const handleAddUser = (user: User) => {
    // Add user to selectedUsers if not already added
    if (!selectedUsers.find((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    }

    // Remove user from searchResults
    setSearchResults((prevSearchResults) =>
      prevSearchResults.filter((searchResult) => searchResult.id !== user.id)
    );
  };
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== userId)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userIds = [...selectedUsers.map((user) => user.id), currUser];
    // console.log('Users added to the group:', userIds);
    await createGroup(formData, userIds);
  };
  return (
    <form onSubmit={handleSubmit} className='px-6'>
      <div className='flex flex-col h-screen justify-center'>
        {/** Group name  */}
        <div className='mt-auto'>
          <label
            htmlFor='name'
            className='mb-2 block text-large font-medium p-6 '
          >
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
        <div className='mt-auto'>
          <label
            htmlFor='customer'
            className='mb-2 block text-large font-medium p-6'
          >
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
        </div>
        <div className='mt-auto'>
          <label
            htmlFor='customer'
            className='mb-2 block text-large font-medium p-6'
          >
            Selected participants
          </label>
          <div className='border flex border-gray-200 p-4 rounded shadow'>
            <ul className='w-full'>
              {selectedUsers.map((user) => (
                <li
                  key={user.id}
                  className='flex justify-between items-center w-full'
                >
                  <span>
                    {user.firstname} {user.lastname}
                  </span>
                  <button
                    type='button'
                    onClick={() => handleRemoveUser(user.id)}
                    className='ml-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2'
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='mt-auto flex flex-col gap-4 p-6'>
          <Link href='/dashboard' passHref>
            <Button className='w-full'>Cancel</Button>
          </Link>

          <Button type='submit'>Create Group</Button>
        </div>
      </div>
    </form>
  );
}
