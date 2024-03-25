export const dynamic = 'force-dynamic';
import GroupCrumbs from '@/components/group-view/breadcrumbs';
import React from 'react';
import CreateGroupForm from '@/components/groups/create-form';
import { fetchUsers } from '@/lib/data';
import { getUserId } from '@/lib/actions';
import Navbar from '@/components/Navbar';

const page = async () => {
  const name = 'Create';
  const users = await fetchUsers();
  const userID = (await getUserId()) as string;
  //const userID='3106eb8a-3288-4b62-a077-3b24bd640d9a'

  return (
    <>
      <Navbar />
      <div className='flex flex-col p-3 gap-3 h-full last:mt-auto'>
        <strong className='gap-3 mb-4 mt-2 p-3 '>
          <GroupCrumbs name={name} type={'create'} />
        </strong>
        <CreateGroupForm users={users} userID={userID} />
      </div>
    </>
  );
};

export default page;
