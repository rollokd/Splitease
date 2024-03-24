'use client';
import { User } from '@/lib/definititions';
import { useEffect, useState } from 'react';
import { updateGroup } from '@/lib/actions';
import EditUserSelector from './EditUserSelector';
import ActionButtons from './EditActionButtons';
import InputEditName from './GroupNameEdit';

type FormProps = {
  users: User[];
  groupUsers: User[];
  userID: string;
  name: string;
  group_id: string;
  balances: { [key: string]: number };
};

export default function EditGroupForm({
  users,
  groupUsers,
  userID,
  name,
  group_id,
  balances,
}: FormProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedUsers(groupUsers);
  }, [groupUsers]);

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
    const userBalance = balances[userId];

    // Check if balance is not zero
    if (userBalance !== 0) {
      alert('A participant can only be removed if their balance is zero.');
      return;
    }
    // Prevent logged-in user from being removed
    if (userId !== userID) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user.id !== userId)
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!group_id) {
      console.error('Group ID is not available');
      return;
    }
    const userIds = selectedUsers.map((user) => user.id);
    await updateGroup(new FormData(event.currentTarget), group_id, userIds);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col p-3 gap-3 h-full last:mt-auto'
    >
      <div className='flex-grow'>
        <InputEditName name={name} />
        <EditUserSelector
          userID={userID}
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
