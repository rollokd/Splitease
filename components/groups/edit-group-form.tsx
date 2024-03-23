'use client';
import { User } from '@/lib/definititions';
import { useEffect, useState } from 'react';
import { updateGroup } from '@/lib/actions';
import { usePathname } from 'next/navigation';
import EditUserSelector from './EditUserSelector';
import ActionButtons from './EditActionButtons';
import InputEditName from './GroupNameEdit';
import { useToast } from '@/components/ui/use-toast';

type FormProps = {
  users: User[];
  groupUsers: User[];
  userID: string;
  name: string;
};

export default function EditGroupForm({
  users,
  groupUsers,
  userID,
  name,
}: FormProps) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const [groupId, setGroupId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    setGroupId(segments[2]);
    setSelectedUsers(groupUsers);
  }, [groupUsers, pathname]);

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
    if (userId === userID) {
      toast({
        description: 'Action not allowed',
      });
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user.id !== userId)
      );
    }
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
