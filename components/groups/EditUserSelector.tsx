import { User } from '@/lib/definititions';
import React from 'react';
import Search from '../search';

const EditUserSelector = ({
  userID,
  searchQuery,
  handleSearch,
  searchResults,
  handleAddUser,
  selectedUsers,
  handleRemoveUser,
}: {
  userID: string;
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
      <div className='flex flex-col gap-4 mb-6 p-4 border-2 border-black rounded-md'>
        <label
          htmlFor='customer'
          className='mb-2 text-xl border-b-2 border-black'
        >
          Choose participants
        </label>
        <Search onSearch={handleSearch} />
        <div className='flex flex-col gap-2 p-2 overflow-y-auto'>
          <ul className='space-y-2'>
            {searchResults.map((user) => (
              <li key={user.id} className='flex justify-between items-center'>
                {`${user.firstname} ${user.lastname}`}
                <button
                  type='button'
                  onClick={() => handleAddUser(user)}
                  className='ml-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4'
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='flex flex-col gap-4 mb-6 p-4 border-2 border-black rounded-md'>
        <label
          htmlFor='customer'
          className='mb-2 text-xl border-b-2 border-black'
        >
          Edit Selected participants
        </label>
        <div className='flex flex-col gap-2 border border-gray-500 p-4 rounded shadow'>
          <ul className='space-y-2'>
            {selectedUsers.map((user) => (
              <li
                key={user.id}
                className='flex justify-between items-center p-2 rounded-md hover:bg-gray-100'
              >
                <span>
                  {user.firstname} {user.lastname}
                </span>
                {user.id !== userID && (
                  <button
                    type='button'
                    onClick={() => handleRemoveUser(user.id)}
                    className='ml-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4'
                  >
                    -
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default EditUserSelector;
