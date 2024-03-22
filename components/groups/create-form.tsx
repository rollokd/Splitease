'use client';
import { User } from '@/lib/definititions';
import { useState } from 'react';
import { createGroup, getUserId } from '@/lib/actions';
import CreateUserSelector from './CreateUserSelector';
import GroupNameInput from './GroupNameInput';
import ActionButtons from './CreateActionButtons';

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

    //Filter users but exclude current user
    const filteredResults = users.filter(
      (user) =>
        user.id !== userID &&
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
    <form onSubmit={handleSubmit} className='flex flex-col min-h-screen'>
      <div className='flex-grow'>
        <GroupNameInput />
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
