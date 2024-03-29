'use client';
import { User } from '@/lib/definititions';
import { useEffect, useState } from 'react';
import { createGroup } from '@/lib/serverActions/createGroup';
import CreateUserSelector from './CreateUserSelector';
import { toast } from 'react-hot-toast';
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

  useEffect(() => {
    // Automatically add the logged-in user to selected users
    const loggedInUser = users.find((user) => user.id === userID);
    if (loggedInUser) {
      setSelectedUsers((prevSelectedUsers) => [
        ...prevSelectedUsers.filter((u) => u.id !== userID),
        loggedInUser,
      ]);
    }
  }, [userID, users]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
    } else {
      const filteredResults = users.filter(
        (user) =>
          user.id !== userID &&
          !selectedUsers.find((selectedUser) => selectedUser.id === user.id) &&
          (user.firstname.toLowerCase().includes(query.toLowerCase()) ||
            user.lastname.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredResults);
    }
  };

  // Add a user to the selected list
  const handleAddUser = (user: User) => {
    if (!selectedUsers.find((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
      setSearchQuery('');
    }
    setSearchResults((prevSearchResults) =>
      prevSearchResults.filter((searchResult) => searchResult.id !== user.id)
    );
  };

  // Remove a user from the selected list
  const handleRemoveUser = (userId: string) => {
    // Prevent logged-in user from being removed
    if (userId !== userID) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user.id !== userId)
      );
    }
  };

  // Submit form data to create a new group
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userIds = selectedUsers.map((user) => user.id);

    try {
      await createGroup(formData, userIds);
      toast.success('Group created successfully!', {
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to create group. Please try again.', {
        duration: 2000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col p-3 gap-3 h-full last:mt-auto'
    >
      <div className='flex-grow'>
        <InputName />
        <CreateUserSelector
          userID={userID}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          handleAddUser={handleAddUser}
          selectedUsers={selectedUsers}
          handleRemoveUser={handleRemoveUser}
        />
      </div>

      <ActionButtons />
    </form>
  );
}
