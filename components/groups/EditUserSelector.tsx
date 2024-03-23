import { User } from '@/lib/definititions';
import React from 'react';
import Search from '../search';
import { UserIcon, Plus, Minus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';

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
      {/* Search and Add Users */}
      <div className='mt-4 mb-4'>
        <Label htmlFor='user-search'>Choose participants</Label>
        <Command className='rounded-lg border shadow-md mt-4'>
          <Search onSearch={handleSearch} />
          <CommandList>
            <CommandGroup heading='Search Results'>
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  className='flex justify-between items-center w-full p-2'
                  onClick={() => handleAddUser(user)}
                >
                  <UserIcon />
                  {`${user.firstname} ${user.lastname}`}
                  <Plus />
                </button>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {/* Selected Users */}
      <div className='mt-4 mb-4'>
        <Label htmlFor='selected-users'>Selected participants</Label>
        <Command className='rounded-lg border shadow-md mt-4'>
          <CommandList>
            {selectedUsers.length > 0 ? (
              <CommandGroup heading='Selected Users'>
                {selectedUsers.map((user) => (
                  <button
                    key={user.id}
                    className='flex justify-between items-center w-full p-2'
                    onClick={(event) => {
                      event.preventDefault();
                      if (user.id === userID) {
                      } else {
                        handleRemoveUser(user.id);
                      }
                    }}
                  >
                    <UserIcon />
                    {`${user.firstname} ${user.lastname}`}
                    <Minus />
                  </button>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No selected users.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </div>
    </>
  );
};

export default EditUserSelector;
