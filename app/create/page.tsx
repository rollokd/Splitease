import React from 'react';
import CreateGroupForm from '../../components/groups/create-form';
import { fetchUsers } from '@/lib/data';
import GroupCrumbs from '@/components/group-view/breadcrumbs';

const page = async () => {
  const name = 'Create';
  const users = await fetchUsers();
  return (
    <div className='flex flex-col p-3 gap-3 h-full last:mt-auto'>
      <strong>
        <GroupCrumbs name={name} />
      </strong>
      <CreateGroupForm users={users} />;
    </div>
  );
};

export default page;
