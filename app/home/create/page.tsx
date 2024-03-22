import GroupCrumbs from '@/components/group-view/breadcrumbs';
import React from 'react';
import CreateGroupForm from '@/components/groups/create-form';
import { fetchUsers } from '@/lib/data';
import { getUserId } from '@/lib/actions';

const page = async () => {
  const name = 'Create';
  const users = await fetchUsers();
  const userID = (await getUserId()) as string;

  return (
    <div className='flex flex-col p-3 gap-3 h-full last:mt-auto'>
      <strong>
        <GroupCrumbs name={name} />
      </strong>
      <CreateGroupForm users={users} userID={userID} />;
    </div>
  );
};

export default page;
