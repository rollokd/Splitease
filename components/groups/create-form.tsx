'use client';
import { User } from '@/lib/definititions';
import { useEffect, useState } from 'react';
import { createGroup, getUserId } from '@/lib/actions';
import CreateUserSelector from './CreateUserSelector';

import ActionButtons from './CreateActionButtons';
import InputName from './GroupNameInput';

type CreateGroupFormProps = {
  users: User[];
  userID: string;
};
export default function CreateGroupForm({
  users,
  userID,
}: CreateGroupFormProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    // Filter users but exclude users that are in the selectedUsers
    const filteredResults = users.filter(
      (user) =>
        user.id !== userID &&
        !selectedUsers.find((selectedUser) => selectedUser.id === user.id) &&
        (user.firstname.toLowerCase().includes(query.toLowerCase()) ||
          user.lastname.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filteredResults);
  };

  // Add a user to the selected list
  const handleAddUser = (user: User) => {
    if (!selectedUsers.find((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    }
    setSearchResults((prevSearchResults) =>
      prevSearchResults.filter((searchResult) => searchResult.id !== user.id)
    );
  };

  // Remove a user from the selected list
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== userId)
    );
  };

  // Submit form data to create a new group
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userIds = [...selectedUsers.map((user) => user.id), userID];
    await createGroup(new FormData(event.currentTarget), userIds);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col p-3 gap-3 h-full last:mt-auto'
    >
      <div className='flex-grow'>
        <InputName />
        <CreateUserSelector
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          handleAddUser={handleAddUser}
          selectedUsers={selectedUsers}
          handleRemoveUser={handleRemoveUser}
        />
      </div>
      <div className='mt-auto'>
        <ActionButtons />
      </div>
    </form>
  );
}
