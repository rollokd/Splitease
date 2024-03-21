import { User } from '@/lib/definititions';
import React from 'react';
import Search from '../search';

const EditUserSelector = ({
  searchQuery,
  handleSearch,
  searchResults,
  handleAddUser,
  selectedUsers,
  handleRemoveUser,
}: {
  searchQuery: string;
  handleSearch: (query: string) => void;
  searchResults: User[];
  handleAddUser: (user: User) => void;
  selectedUsers: User[];
  handleRemoveUser: (userId: string) => void;
}) => {
  return (
    <>
      {/* * Add users */}
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
          Edit Selected participants
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
    </>
  );
};
export default EditUserSelector;
