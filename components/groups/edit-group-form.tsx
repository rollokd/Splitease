'use client';
import { User } from '@/lib/definititions';
import { useEffect, useState } from 'react';
import { updateGroup } from '@/lib/actions';
import { usePathname } from 'next/navigation';
import GroupNameInput from './GroupNameInput';
import EditUserSelector from './EditUserSelector';
import ActionButtons from './EditActionButtons';

type FormProps = {
  users: User[];
  groupUsers: User[];
  userID: string;
};

export default function EditGroupForm({
  users,
  groupUsers,
  userID,
}: FormProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    setGroupId(segments[1]);
    setSelectedUsers(groupUsers);
  }, [groupUsers, pathname]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!groupId) {
      console.error('Group ID is not available');
      return;
    }
    const userIds = selectedUsers.map((user) => user.id);
    await updateGroup(new FormData(event.currentTarget), groupId, userIds);
  };
  return (
    <form onSubmit={handleSubmit} className='px-6'>
      <div className='flex flex-col h-screen justify-center'>
        <GroupNameInput />
        <EditUserSelector
          userID={userID}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          handleAddUser={handleAddUser}
          selectedUsers={selectedUsers}
          handleRemoveUser={handleRemoveUser}
        />
        <ActionButtons />
      </div>
    </form>
  );
}
